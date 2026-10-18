#!/usr/bin/env python3
"""Contrôle de conformité d'un site du parc, bloquant au build.

Copié avec le thème dans <site>/themes/pbn/_controle/ (jamais publié : Hugo ne lit pas ce dossier).
Python 3.11 ou plus, bibliothèque standard seulement.

Usage (depuis la racine du site, après `hugo --gc --minify`) :
    python3 themes/pbn/_controle/controle.py
    python3 themes/pbn/_controle/controle.py --public /tmp/build --site . --type B --tout
Options :
    --site <dossier>    racine du site Hugo (défaut : trois niveaux au-dessus de ce fichier)
    --public <dossier>  site construit (défaut : <site>/public)
    --type A|B          force le type (sinon pbn.yaml, puis [params.pbn] type de hugo.toml, puis B)
    --tout              affiche toutes les occurrences (défaut : 8 par règle)
Sortie en code 1 s'il reste une faute bloquante non couverte par une exception de pbn.yaml (clé `controle:`),
en code 2 si le contrôle ne peut pas tourner (dossier absent, pbn.yaml illisible).
Règles et format des exceptions : README.md du même dossier.
"""
import html as htmlmod
import json
import os
import re
import sys
import unicodedata
from html.parser import HTMLParser
from urllib.parse import quote, urlsplit

try:
    import tomllib
except ImportError:  # Python < 3.11
    tomllib = None

ICI = os.path.dirname(os.path.abspath(__file__))

# ------------------------------------------------------------------ arguments

def lire_args(argv):
    o = {'site': None, 'public': None, 'type': None, 'tout': False}
    i = 0
    while i < len(argv):
        a = argv[i]
        if a in ('--site', '--public', '--type') and i + 1 < len(argv):
            o[a[2:]] = argv[i + 1]; i += 2; continue
        if a == '--tout':
            o['tout'] = True; i += 1; continue
        if a in ('-h', '--help'):
            print(__doc__); sys.exit(0)
        print(f'argument inconnu : {a}'); sys.exit(2)
    return o


ARGS = lire_args(sys.argv[1:])
SITE = os.path.abspath(ARGS['site'] or os.path.join(ICI, '..', '..', '..'))
PUBLIC = os.path.abspath(ARGS['public'] or os.path.join(SITE, 'public'))

def stop(msg):
    print(f'CONTROLE IMPOSSIBLE : {msg}')
    sys.exit(2)

if not os.path.isdir(PUBLIC) or not os.path.isfile(os.path.join(PUBLIC, 'index.html')):
    stop(f'pas de site construit dans {PUBLIC} (lancer hugo avant le contrôle)')

# ------------------------------------------------------------------ configuration Hugo

def toml_mini(texte):
    """Lecteur TOML de repli (Python < 3.11, ex. /usr/bin/python3 de macOS) : tables, tableaux de tables, chaînes,
    nombres, booléens, tableaux et tables en ligne. Suffisant pour hugo.toml ; tomllib est préféré quand il existe."""
    racine, cour = {}, None
    cour = racine

    def valeur(s, i):
        while s[i] in ' \t\n\r':
            i += 1
        c = s[i]
        if s.startswith('"""', i) or s.startswith("'''", i):
            q = s[i:i + 3]; j = s.index(q, i + 3)
            v = s[i + 3:j].lstrip('\n')
            return (v.encode().decode('unicode_escape') if q == '"""' and '\\' in v else v), j + 3
        if c == '"':
            j = i + 1; out = []
            while s[j] != '"':
                if s[j] == '\\':
                    out.append({'n': '\n', 't': '\t', '"': '"', '\\': '\\'}.get(s[j + 1], s[j + 1])); j += 2
                else:
                    out.append(s[j]); j += 1
            return ''.join(out), j + 1
        if c == "'":
            j = s.index("'", i + 1)
            return s[i + 1:j], j + 1
        if c == '[':
            out = []; i += 1
            while True:
                while s[i] in ' \t\n\r,' or s[i] == '#':
                    if s[i] == '#':
                        i = s.index('\n', i)
                    i += 1
                if s[i] == ']':
                    return out, i + 1
                v, i = valeur(s, i); out.append(v)
        if c == '{':
            out = {}; i += 1
            while True:
                while s[i] in ' \t,':
                    i += 1
                if s[i] == '}':
                    return out, i + 1
                m = re.compile(r'\s*("[^"]*"|\'[^\']*\'|[\w.-]+)\s*=').match(s, i)
                k = m.group(1).strip('"\''); v, i = valeur(s, m.end()); out[k] = v
        m = re.compile(r'[^\s,\]}#]+').match(s, i)
        brut = m.group(0)
        if brut in ('true', 'false'):
            return brut == 'true', m.end()
        try:
            return (float(brut) if re.search(r'[.eE]', brut) and not re.match(r'\d{4}-', brut) else int(brut.replace('_', ''))), m.end()
        except ValueError:
            return brut, m.end()

    def chemin(d, cles, dernier_tableau=False):
        for k in cles:
            v = d.setdefault(k, {})
            d = v[-1] if isinstance(v, list) else v
        return d

    i, s = 0, texte + '\n'
    cle_re = re.compile(r'[ \t]*("[^"]*"|\'[^\']*\'|[\w-]+(?:[ \t]*\.[ \t]*(?:"[^"]*"|[\w-]+))*)[ \t]*=')
    while i < len(s):
        fin = s.find('\n', i)
        ligne = s[i:fin].strip()
        if not ligne or ligne.startswith('#'):
            i = fin + 1; continue
        if ligne.startswith('[['):
            cles = [k.strip().strip('"\'') for k in ligne[2:ligne.index(']]')].split('.')]
            parent = chemin(racine, cles[:-1])
            parent.setdefault(cles[-1], [])
            if not isinstance(parent[cles[-1]], list):
                parent[cles[-1]] = []
            parent[cles[-1]].append({}); cour = parent[cles[-1]][-1]
            i = fin + 1; continue
        if ligne.startswith('['):
            cles = [k.strip().strip('"\'') for k in ligne[1:ligne.index(']')].split('.')]
            cour = chemin(racine, cles)
            i = fin + 1; continue
        m = cle_re.match(s, i)
        if not m:
            raise ValueError(f'ligne non comprise : {ligne[:60]}')
        cles = [k.strip().strip('"\'') for k in m.group(1).split('.')]
        v, j = valeur(s, m.end())
        chemin(cour, cles[:-1])[cles[-1]] = v
        fin = s.find('\n', j)
        i = (fin if fin >= 0 else len(s)) + 1
    return racine


def lire_config():
    for nom in ('hugo.toml', 'config.toml'):
        p = os.path.join(SITE, nom)
        if os.path.isfile(p):
            with open(p, 'rb') as f:
                brut = f.read()
            try:
                return tomllib.loads(brut.decode('utf-8')) if tomllib else toml_mini(brut.decode('utf-8'))
            except Exception as e:
                stop(f'{nom} illisible : {e}')
    stop(f'ni hugo.toml ni config.toml dans {SITE}')


def cle(d, k, defaut=None):
    """Lecture sans casse (Hugo met les clés de params en minuscules)."""
    if not isinstance(d, dict):
        return defaut
    for kk, v in d.items():
        if kk.lower() == k.lower():
            return v
    return defaut


CONF = lire_config()
PARAMS = cle(CONF, 'params', {}) or {}
PBN = cle(PARAMS, 'pbn', {}) or {}
LANGUES = cle(CONF, 'languages', {}) or {}


def hote(url):
    try:
        h = (urlsplit(url).hostname or '').lower()
    except ValueError:
        return ''
    return h[4:] if h.startswith('www.') else h


SITE_HOTE = hote(cle(CONF, 'baseURL', '') or '')

# ------------------------------------------------------------------ pbn.yaml (clé controle:)

def scalaire(v):
    v = v.strip()
    if not v:
        return None
    if v[0] in '"\'':
        q = v[0]
        fin = v.find(q, 1)
        while q == '"' and fin > 0 and v[fin - 1] == '\\':
            fin = v.find(q, fin + 1)
        s = v[1:fin] if fin > 0 else v[1:]
        return s.replace('\\"', '"') if q == '"' else s.replace("''", "'")
    v = re.sub(r'\s+#.*$', '', v).strip()
    if v.startswith('[') and v.endswith(']'):
        return [scalaire(x) for x in re.findall(r'"[^"]*"|\'[^\']*\'|[^,\[\]]+', v[1:-1]) if x.strip()]
    low = v.lower()
    if low in ('true', 'yes', 'oui'):
        return True
    if low in ('false', 'no', 'non'):
        return False
    if low in ('null', '~'):
        return None
    return v


def yaml_mini(lignes):
    """Sous-ensemble YAML suffisant pour la clé controle: (dictionnaires, listes de scalaires ou de dictionnaires)."""
    toks = []
    for brut in lignes:
        if not brut.strip() or brut.lstrip().startswith('#'):
            continue
        toks.append((len(brut) - len(brut.lstrip(' ')), brut.strip()))
    pos = 0

    def bloc(ind):
        nonlocal pos
        if pos >= len(toks):
            return None
        if toks[pos][1].startswith('- ') or toks[pos][1] == '-':
            out = []
            while pos < len(toks) and toks[pos][0] == ind and (toks[pos][1].startswith('- ') or toks[pos][1] == '-'):
                reste = toks[pos][1][1:].strip()
                if not reste:
                    pos += 1
                    out.append(bloc(toks[pos][0]) if pos < len(toks) and toks[pos][0] > ind else None)
                elif re.match(r'^[\w.-]+\s*:(\s|$)', reste):
                    # élément dictionnaire : la première clé est sur la ligne du tiret
                    toks[pos] = (ind + 2, reste)
                    out.append(bloc(ind + 2))
                else:
                    pos += 1
                    out.append(scalaire(reste))
            return out
        out = {}
        while pos < len(toks) and toks[pos][0] == ind and not toks[pos][1].startswith('- '):
            m = re.match(r'^([\w.-]+)\s*:\s*(.*)$', toks[pos][1])
            if not m:
                raise ValueError(f'ligne non comprise : {toks[pos][1]}')
            k, v = m.group(1), m.group(2)
            pos += 1
            if v.strip() and not v.strip().startswith('#'):
                out[k] = scalaire(v)
            elif pos < len(toks) and (toks[pos][0] > ind or (toks[pos][0] == ind and toks[pos][1].startswith('- '))):
                out[k] = bloc(toks[pos][0])
            else:
                out[k] = None
        return out

    return bloc(toks[0][0]) if toks else {}


def lire_pbn_yaml():
    """pbn.yaml du site (format 1, défini par l'agent parc-pbn-geo du plugin SEO). Le contrôle n'en lit que trois clés :
    controle (ses exceptions), site.type et marque_editrice. Tout le reste appartient aux skills de rédaction."""
    cands = [os.path.join(SITE, 'pbn.yaml')]
    parent = os.path.dirname(SITE)
    if not os.path.exists(os.path.join(SITE, '.git')) and os.path.exists(os.path.join(parent, '.git')):
        cands.append(os.path.join(parent, 'pbn.yaml'))  # sources Hugo dans un sous-dossier (meilleur-logiciel-rh.fr)
    for p in cands:
        if not os.path.isfile(p):
            continue
        texte = open(p, encoding='utf-8').read()
        try:
            import yaml  # PyYAML s'il est là, sinon le sous-ensemble ci-dessous
            data = yaml.safe_load(texte) or {}
            if not isinstance(data, dict):
                stop(f'{p} : un dictionnaire est attendu')
            return p, {k: data.get(k) for k in ('controle', 'site', 'marque_editrice')}
        except Exception:
            pass  # PyYAML absent, ou fichier qu'il refuse (jetons {{...}} non remplacés) : sous-ensemble ci-dessous
        out = {}
        for cle_y in ('controle', 'site', 'marque_editrice'):
            lignes, dedans = [], False
            for l in texte.splitlines():
                m = re.match(r'^' + cle_y + r'\s*:(.*)$', l)
                if m:
                    if m.group(1).strip() and not m.group(1).strip().startswith('#'):
                        out[cle_y] = scalaire(m.group(1)); break
                    dedans = True; continue
                if dedans and l.strip() and not l.startswith((' ', '\t', '#')):
                    break
                if dedans:
                    lignes.append(l.replace('\t', '  '))
            if dedans:
                try:
                    out[cle_y] = yaml_mini(lignes) or {}
                except Exception as e:
                    stop(f'clé {cle_y}: de {p} illisible : {e}')
        return p, out
    return None, {}


YAML_CHEMIN, YAML_DATA = lire_pbn_yaml()
CTRL = YAML_DATA.get('controle') or {}
YAML_SITE = YAML_DATA.get('site') or {}
if not isinstance(CTRL, dict):
    stop('la clé controle: de pbn.yaml doit être un dictionnaire')
if not isinstance(YAML_SITE, dict):
    YAML_SITE = {}

TYPE = str(ARGS['type'] or CTRL.get('type') or cle(PBN, 'type') or YAML_SITE.get('type') or 'B').upper()
if TYPE not in ('A', 'B'):
    stop(f'type inconnu : {TYPE}')
TYPE_B = TYPE == 'B'
NOINDEX_SITE = cle(PBN, 'noindexSite') is True

# ------------------------------------------------------------------ domaines permis en lien externe

OFFICIELS = [
    # liste par défaut du thème (pbn/sources-liens.html)
    'gouv.fr', 'service-public.fr', 'europa.eu', 'insee.fr', 'ademe.fr', 'has-sante.fr', 'sante.fr', 'inrs.fr',
    'who.int', 'iso.org', 'afnor.org', 'ameli.fr', 'anses.fr', 'santepubliquefrance.fr', 'inserm.fr', 'cnil.fr',
    'urssaf.fr', 'banque-france.fr', 'amf-france.org',
    # organismes publics, parapublics et paritaires (sources de faits)
    'francetravail.fr', 'francetravail.org', 'pole-emploi.fr', 'apec.fr', 'net-entreprises.fr', 'caf.fr', 'msa.fr',
    'agirc-arrco.fr', 'impots.gouv.fr', 'bpifrance.fr', 'cci.fr', 'cma-france.fr', 'atout-france.fr', 'ofii.fr',
    'meteofrance.com', 'ign.fr', 'cnrs.fr', 'inrae.fr', 'ineris.fr', 'injep.fr', 'dares.travail-emploi.gouv.fr',
    'data.gouv.fr', 'opendatafrance.fr', 'ecologie.gouv.fr', 'ademe.fr', 'cerema.fr', 'anah.fr', 'anil.org',
    'ordre-experts-comptables.fr', 'experts-comptables.fr', 'cnb.avocat.fr', 'notaires.fr', 'acpr.banque-france.fr',
    'oecd.org', 'imf.org', 'worldbank.org', 'un.org', 'unesco.org', 'ilo.org', 'eurostat.ec.europa.eu', 'ine.es', 'istat.it',
    'destatis.de', 'ons.gov.uk', 'ec.europa.eu', 'ema.europa.eu', 'efsa.europa.eu', 'nih.gov', 'ncbi.nlm.nih.gov',
    # études et publications scientifiques
    'doi.org', 'pubmed.ncbi.nlm.nih.gov', 'cochranelibrary.com', 'cochrane.org', 'thelancet.com', 'nejm.org', 'bmj.com',
    'jamanetwork.com', 'nature.com', 'science.org', 'sciencedirect.com', 'springer.com', 'link.springer.com',
    'wiley.com', 'onlinelibrary.wiley.com', 'journals.plos.org', 'plos.org', 'frontiersin.org', 'mdpi.com', 'cairn.info',
    'persee.fr', 'hal.science', 'theses.fr', 'researchgate.net', 'scholar.google.com', 'academic.oup.com', 'tandfonline.com',
    # crédits et licences des images (attribution exigée par la licence)
    'wikimedia.org', 'wikipedia.org', 'wikidata.org', 'creativecommons.org', 'pexels.com', 'unsplash.com', 'pixabay.com',
    'flickr.com', 'openverse.org', 'rawpixel.com', 'stocksnap.io', 'publicdomainpictures.net', 'freepik.com',
    'openstreetmap.org', 'pewresearch.org',
    # sites officiels des grandes villes
    'paris.fr', 'lyon.fr', 'marseille.fr', 'toulouse.fr', 'nice.fr', 'bordeaux.fr', 'nantes.fr', 'strasbourg.eu', 'lille.fr',
    'montpellier.fr', 'rennes.fr', 'grenoble.fr', 'annecy.fr',
]
SUFFIXES_OFFICIELS = ('.gouv.fr', '.gouv', '.gov', '.gov.uk', '.gob.es', '.gov.it', '.bund.de', '.admin.ch', '.europa.eu',
                      '.int', '.public.lu', '.belgium.be', '.fgov.be', '.edu', '.ac.uk', '.ac.jp', '.edu.au', '.univ.fr',
                      '.u-paris.fr', '.sorbonne-universite.fr', '.cnrs.fr', '.inserm.fr', '.inrae.fr', '.travel')
PARTAGE = re.compile(r'^https?://(www\.)?(linkedin\.com/(sharing|shareArticle)|twitter\.com/intent|x\.com/intent|'
                     r'facebook\.com/sharer|api\.whatsapp\.com/send|wa\.me/|pinterest\.[a-z.]+/pin/create|'
                     r'reddit\.com/submit|t\.me/share|bsky\.app/intent)', re.I)


def liste(v):
    if v is None:
        return []
    if isinstance(v, (list, tuple)):
        return [str(x) for x in v if x is not None]
    return [str(v)]


def norm_dom(d):
    d = d.strip().lower()
    d = re.sub(r'^https?://', '', d).split('/')[0]
    return d[4:] if d.startswith('www.') else d


PERMIS = set(norm_dom(d) for d in OFFICIELS)
PERMIS |= set(norm_dom(d) for d in liste(cle(PBN, 'sourcesLiens')))
PERMIS |= set(norm_dom(d) for d in liste(CTRL.get('domaines')))
if SITE_HOTE:
    PERMIS.add(SITE_HOTE)
MARQUE = set(norm_dom(d) for d in liste(cle(PBN, 'sourcesMarque')) + liste(YAML_DATA.get('marque_editrice')))
LIENS_LEGAUX = []
for lg, lc in LANGUES.items():
    lp = cle(cle(lc, 'params', {}) or {}, 'pbn', {}) or {}
    for x in liste(None) + (cle(lp, 'legalLinks', []) or []):
        if isinstance(x, dict) and str(cle(x, 'url', '')).startswith('http'):
            LIENS_LEGAUX.append(hote(cle(x, 'url')))
for x in cle(PBN, 'legalLinks', []) or []:
    if isinstance(x, dict) and str(cle(x, 'url', '')).startswith('http'):
        LIENS_LEGAUX.append(hote(cle(x, 'url')))
if not TYPE_B:
    PERMIS |= MARQUE or set(h for h in LIENS_LEGAUX if h)


def domaine_permis(h):
    if not h:
        return True
    for d in PERMIS:
        if h == d or h.endswith('.' + d):
            return True
    return h.endswith(SUFFIXES_OFFICIELS)


SLD = ('co.uk', 'com.au', 'co.jp', 'com.br', 'co.nz', 'com.na', 'co.za', 'gouv.fr', 'asso.fr', 'com.es', 'co.it')


def etiquette(h):
    """Nom distinctif d'un domaine : inextenso pour www.inextenso.fr, cafecoton pour cafecoton.com."""
    parts = h.split('.')
    if len(parts) >= 3 and '.'.join(parts[-2:]) in SLD:
        parts = parts[:-1]
    return re.sub(r'[^a-z0-9]', '', parts[-2] if len(parts) >= 2 else parts[0])


def compact(t):
    return re.sub(r'[^a-z0-9]', '', sans_accents(htmlmod.unescape(t)).lower())


def domaine_enregistre(h):
    parts = h.split('.')
    n = 3 if len(parts) >= 3 and '.'.join(parts[-2:]) in SLD else 2
    return '.'.join(parts[-n:])


if not TYPE_B and SITE_HOTE:
    PERMIS.add(domaine_enregistre(SITE_HOTE))  # site client sur un sous-domaine : le domaine du client est sa marque

AFFILIATION = re.compile(r'[?&](?:utm_[a-z]+|aff(?:iliate)?(?:_?id)?|ref|tag|partner(?:id)?|awc|clickref|cjevent|irclickid|'
                         r'subid|tduid|ranmid|rfsn)=|/aff/|awin1\.com|tradedoubler|effiliation|kwanko|tradetracker|'
                         r'amzn\.to|go\.skimresources|\.prf\.hn', re.I)

# ------------------------------------------------------------------ règles

REGLES = {
    'pages-legales': 'pages légales (type B : présentes, upearly, Ruben Sebag, SIRET, CGU)',
    'telephone': 'aucun téléphone dans les mentions légales',
    'noindex-legal': 'pages légales en noindex',
    'signature': 'signature unique de la rédaction (type B)',
    'pages-auteurs': 'aucune page d\'auteur (type B)',
    'person': 'aucun JSON-LD Person',
    'jsonld': 'JSON-LD lisible',
    'mention': 'mention « Publication sponsorisée » et disclaimer de classement',
    'traceur': 'aucun traceur (type B)',
    'inscription': 'aucun formulaire d\'inscription (type B)',
    'allegation': 'aucune allégation',
    'methode': 'aucune description de méthode',
    'note': 'aucune note du site',
    'classement-datashake': 'jamais de classement de datashake ni d\'upearly',
    'lien-externe': 'liens externes : sources officielles seulement (et marque éditrice en type A)',
    'auteur': 'aucun champ author dans le front matter',
    'empreinte': 'aucune trace du réseau dans ce qui est publié',
    'squelette': 'aucun jeton du squelette ({{...}}) dans ce qui est publié',
    'taxonomie': 'une URL de terme, une seule page : une graphie par terme, dossier de page de terme nommé d\'après le terme',
    'exception': 'exceptions de pbn.yaml justifiées',
}
CONSTATS = []  # [regle, niveau 'KO'|'AV', page, extrait, exception]
DEJA = set()


def constat(regle, niveau, page, extrait='', mot=None, entier=False):
    """mot : occurrence trouvée ; la même sur la même page n'est rapportée qu'une fois (title, description et h1 se répètent).
    entier : message gardé en entier (consigne de correction), sinon extrait coupé à 220 caractères."""
    if mot is not None:
        k = (regle, page, re.sub(r'\s+', ' ', mot.lower()))
        if k in DEJA:
            return
        DEJA.add(k)
    extrait = re.sub(r'\s+', ' ', extrait).strip()
    CONSTATS.append([regle, niveau, page, extrait if entier else extrait[:220], None])

if YAML_SITE.get('type') and cle(PBN, 'type') and str(YAML_SITE.get('type')).upper() != str(cle(PBN, 'type')).upper():
    constat('exception', 'AV', 'pbn.yaml', f"site.type ({YAML_SITE.get('type')}) diffère de [params.pbn] type ({cle(PBN, 'type')}) : "
            "le contrôle suit hugo.toml")

# ------------------------------------------------------------------ lecture du HTML

VIDES = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'param'}
# régions du texte d'un article contrôlé (classes)
INCLURE = {'post-title', 'post-desc', 'tldr', 'post-content', 'faq', 'sources'}
INCLURE_PAGE = {'page-title', 'page-desc', 'prose'}
EXCLURE = {'ranking-disclaimer', 'content-disclaimer', 'group-notice', 'toc', 'post-toc', 'share', 'author-box',
           'related', 'prev-next', 'post-tags', 'breadcrumb'}


class Page(HTMLParser):
    def __init__(self, inclure):
        super().__init__(convert_charrefs=True)
        self.inclure = inclure
        self.pile = []          # (tag, inclus, exclu)
        self.texte = []         # texte des régions contrôlées
        self.titres = []        # h2, h3, h4, th, td des régions contrôlées (pour le classement de datashake)
        self.tout = []          # texte visible de <body>, hors script et style
        self.hors_main = []     # texte visible hors <main>
        self.liens = []         # (href, dans_region)
        self.meta = {}
        self.lang = ''
        self.title = ''
        self._dans_title = False
        self.ld = []
        self._ld = None
        self.inputs = []
        self.forms = []
        self.scripts_src = []
        self.iframes = []
        self.cellule = None
        self.robots = ''

    def etat(self):
        inc = any(p[1] for p in self.pile)
        exc = any(p[2] for p in self.pile) or any(p[0] in ('script', 'style', 'noscript', 'template') for p in self.pile)
        return inc, exc

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = set((a.get('class') or '').split())
        if tag == 'html':
            self.lang = (a.get('lang') or '').lower()
        if tag == 'meta':
            n = (a.get('name') or a.get('property') or '').lower()
            if n:
                self.meta.setdefault(n, []).append(a.get('content') or '')
        if tag == 'title':
            self._dans_title = True
        if tag == 'script':
            t = (a.get('type') or '').lower()
            if t == 'application/ld+json':
                self._ld = []
            if a.get('src'):
                self.scripts_src.append(a['src'])
        if tag == 'iframe' and a.get('src'):
            self.iframes.append(a['src'])
        if tag == 'input':
            self.inputs.append(a)
        if tag == 'form':
            self.forms.append(a)
        inc_avant, exc_avant = self.etat()
        if tag == 'a' and a.get('href'):
            self.liens.append((a['href'].strip(), inc_avant and not exc_avant))
        if tag in VIDES:
            return
        self.pile.append((tag, bool(cls & self.inclure), bool(cls & EXCLURE)))
        if tag in ('h2', 'h3', 'h4', 'th', 'td', 'dt') and inc_avant and not exc_avant:
            self.cellule = (tag, len(self.pile), [])

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VIDES:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag == 'title':
            self._dans_title = False
        if tag == 'script' and self._ld is not None:
            self.ld.append(''.join(self._ld)); self._ld = None
        if tag in VIDES:
            return
        for i in range(len(self.pile) - 1, -1, -1):
            if self.pile[i][0] == tag:
                if self.cellule and self.cellule[1] >= i + 1:
                    self.titres.append((self.cellule[0], ' '.join(self.cellule[2])))
                    self.cellule = None
                del self.pile[i:]
                break

    def handle_data(self, d):
        if self._ld is not None:
            self._ld.append(d); return
        if self._dans_title:
            self.title += d; return
        if any(p[0] in ('script', 'style', 'noscript', 'template') for p in self.pile):
            return
        self.tout.append(d)
        if not any(p[0] == 'main' for p in self.pile):
            self.hors_main.append(d)
        inc, exc = self.etat()
        if inc and not exc:
            self.texte.append(d)
            if self.cellule:
                self.cellule[2].append(d)


def lire(p):
    with open(p, encoding='utf-8', errors='replace') as f:
        return f.read()


def url_de(rel):
    rel = rel.replace(os.sep, '/')
    if rel.endswith('/index.html'):
        return '/' + rel[:-len('index.html')]
    if rel == 'index.html':
        return '/'
    return '/' + rel

# ------------------------------------------------------------------ motifs de texte

def sans_accents(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')


def motif(*parts):
    return re.compile('|'.join(parts), re.I)


# Allégations bloquantes : formulations sans autre sens possible. Le texte est comparé sans accents, apostrophes droites.
# Calibré le 2026-10-17 sur les 43 sites Hugo du parc : chaque motif ambigu (référence, inégale, #1 d'un nom de produit,
# tests indépendants d'un laboratoire...) est passé en avertissement.
ALLEG_KO = motif(
    r"\b(?:le|la|les|notre|nos|votre|son|sa|leur|est|reste|devient|comme|vrai|veritable)\s+(?:n\s?[o°º]\.?\s?1|#1|numero\s+(?:1|un))\b(?![\d.,])",
    r"\b(?:n\s?[o°º]\.?\s?1|numero\s+(?:1|un))\s+(?:du\s+marche|du\s+secteur|des\s+ventes|en\s+france|en\s+europe|mondial|europeen|francais|incontest)",
    r"\b(?:the|our|is|ranked)\s+(?:number\s+one|no\.\s?1|#1)\b(?!\s+(?:rule|tip|mistake|step|reason|question))",
    r"\bour\s+top\s+picks?\b", r"\bour\s+(?:pick|choice)\b(?!\s+of\b)", r"\beditor'?s\s+(?:choice|pick)\b",
    r"\bnotre\s+(?:choix|coup de c(?:oe|œ)ur|favori)\b(?!\s+(?:de|d'|du|des|parmi|pour)\b)", r"\bnos\s+coups?\s+de\s+c(?:oe|œ)ur\b",
    r"\bchoix\s+de\s+la\s+redaction\b", r"\bcoups?\s+de\s+c(?:oe|œ)ur\s+de\s+la\s+redaction\b", r"\bnuestra\s+eleccion\b",
    r"\bla\s+nostra\s+scelta\b", r"\bunsere\s+wahl\b", r"\btestsieger\b", r"\bscelta\s+della\s+redazione\b", r"\beleccion\s+del\s+editor\b",
    # vérification ou test par le site
    r"\bavis\s+(?:clients?\s+)?verifies\b", r"\bverified\s+(?:customer\s+)?reviews?\b",
    r"\b(?:classement|comparatif)\s+verifie\b", r"\b(?:donnees|informations|tarifs)\s+verifiees\s+par\b",
    r"\bnous\s+avons\s+(?:verifie|teste|controle)\b", r"\b(?:verifie|teste)(?:e|s|es)?\s+par\s+(?:nos\s+soins|la\s+redaction|notre\s+(?:equipe|redaction)|nous)\b",
    r"\bnos\s+(?:tests|essais|releves)\b", r"\bour\s+(?:tests|testing|own\s+(?:checks|readings|tests))\b",
    r"\bwe\s+(?:have\s+)?(?:tested|verified)\b", r"\btested\s+by\s+(?:us|our\s+(?:team|editors?)|the\s+editorial)",
    r"\bnuestras\s+pruebas\b", r"\bi\s+nostri\s+test\b",
    # indépendance, objectivité affirmées par le site
    r"\b(?:notre|nos|ce|cet|un|le)\s+(?:comparateur|comparatif|classement|media|site|blog|magazine|guide)s?\s+(?:\w+\s+)?"
    r"(?:independant|objectif|impartial|neutre)s?\b",
    r"\b(?:notre|la|une)\s+redaction\s+(?:\w+\s+)?(?:independante|objective|impartiale)\b",
    r"\bavis\s+(?:\w+\s+)?(?:independants?|objectifs?|impartia(?:l|ux)|honnetes?)\b",
    r"\ben\s+toute\s+(?:independance|objectivite|impartialite|neutralite)\b",
    r"\b(?:independent|unbiased|impartial|objective|honest)\s+(?:reviews?|comparisons?|rankings?|selection|editorial)\b",
    r"\bunabhangige?r?s?\s+(?:vergleich|test|bewertung)", r"\bcomparativa\s+independiente\b", r"\bconfronto\s+indipendente\b",
    # supériorité affirmée
    r"\bla\s+reference\s+(?:du\s+marche|du\s+secteur|incontestee|absolue)\b", r"\breference\s+incontestee\b",
    r"\bleader\s+(?:du\s+marche|du\s+secteur|incontest\w*|mondial|europeen|francais|national|sur\s+son\s+marche)\b",
    r"\b(?:market|industry)\s+leader\b", r"\bleader\s+in\s+(?:its|the)\s+(?:market|field|sector|industry)\b",
    r"\bimbattables?\b", r"\bunbeatable\b", r"\bunrivall?ed\b", r"\ble\s+meilleur\s+du\s+marche\b", r"\bthe\s+best\s+on\s+the\s+market\b",
)
# Sur le texte accentué : « inégalé » (et non « inégale », qui veut dire irrégulière).
ALLEG_KO_ACC = re.compile(r"\binégalée?s?\b|\bsans\s+égal\b", re.I)
# Sur le texte accentué, en avertissement : « vérifié », « testé » (participes, pas l'impératif « vérifiez » ni « vérifie »).
ALLEG_AV_ACC = re.compile(r"\bvérifiée?s?\b|\btestée?s?\b", re.I)
# Avertissements : mots qui ont aussi un sens permis (travailleur indépendant, objectif de l'article, référence d'une norme,
# nom de produit en #1, tests d'un laboratoire...). À relire, jamais bloquants, et cherchés seulement dans les classements.
# « indépendant » et « objectif » seuls ne sont pas cherchés : sur tout le parc ils sortent plus de 2 000 fois, toujours
# dans un sens permis (travailleur indépendant, objectif de l'article) ; ils le sont quand le site parle de lui-même.
ALLEG_AV = motif(
    r"\bn\s?[o°º]\.?\s?1\b(?![\d.,])", r"\bnumero\s+(?:1|un)\b", r"(?:^|[\s(])#1\b(?![\d.,])", r"\bnumber\s+one\b",
    r"\btop\s+picks?\b", r"\bour\s+pick\s+of\b", r"\bour\s+favou?rites?\b", r"\bnotre\s+(?:preference|selection\s+de\s+la\s+redaction)\b",
    r"\b(?:nous|notre|nos|we|our|sommes|are)\b(?:\W+\w+){0,5}?\W+(?:independant|independent|objecti[fv]|impartia|neutre|neutral|honnete|honest)",
    r"\bobjectivement\b", r"\bobjectivite\b", r"\bimpartialite\b", r"\bindependance\s+(?:editoriale|de\s+(?:la|notre)\s+redaction)\b",
    r"\bverified\b", r"\bon\s+a\s+teste\b",
    r"\b(?:est|reste|demeure|comme)\s+(?:la|une)\s+(?:veritable\s+)?reference\b", r"\ble\s+leader\b", r"\bthe\s+leader\b", r"\bincontournables?\b",
    r"\bsans\s+equivalent\b",
)
METHODE = motif(
    r"\bnos\s+criteres\s+(?:de\s+)?(?:selection|classement|notation|choix|evaluation)\b",
    r"\bnotre\s+(?:methodologie|methode\s+(?:de\s+)?(?:classement|selection|notation|test|evaluation))\b",
    r"\bcomment\s+(?:nous\s+avons|avons-nous|on\s+a)\s+(?:classe|selectionne|choisi|compare|teste|note)",
    r"\b(?:nous\s+avons|on\s+a)\s+(?:compare|analyse|passe\s+au\s+crible|selectionne|evalue|note|teste)\s+(?:plus\s+de\s+)?\d+",
    r"\bce\s+(?:comparatif|classement)\s+s'appuie\s+sur\s+\w+\s+criteres\b",
    r"\bour\s+(?:methodology|selection\s+criteria|ranking\s+(?:method|methodology|criteria)|testing\s+process)\b",
    r"\bhow\s+we\s+(?:ranked|tested|selected|chose|compared|rated|built\s+this)\b",
    r"\bwe\s+(?:compared|analy[sz]ed|reviewed|tested|rated)\s+(?:over\s+|more\s+than\s+)?\d+",
    r"\bla\s+methode\s+derriere\s+ce\s+classement\b",
)
RANKING = re.compile(r'\b(?:meilleur|meilleure|meilleurs|meilleures|top\s*\d+|classement|comparatif|best|ranking|vs)\b', re.I)
NOTE_ETOILES_KO = re.compile(r'[★☆⭐✩✪✫✬✭✮✯]\s?[★☆⭐✩✪✫✬✭✮✯]|\d(?:[.,]\d)?\s?/\s?5\s?[★⭐]|[★⭐]\s?\d[.,]\d')
NOTE_ETOILES = re.compile('[★☆⭐✩✪✫✬✭✮✯]')
NOTE_FRACTION = re.compile(r'(?<![\d/.,])(\d{1,2}(?:[.,]\d{1,2})?)\s?/\s?(5|10|20|100)(?![\d/])')
NOTE_CONTEXTE = re.compile(r'\b(?:note|notes|notee?s?|notation|rating|ratings|rated|etoiles?|stars?|avis|reviews?|trustpilot|'
                           r'bewertung|valutazione|valoracion|puntuacion)\b', re.I)
DATASHAKE = re.compile(r'\b(datashake|upearly)\b', re.I)
TRACEURS = re.compile(r"googletagmanager\.com|google-analytics\.com|gtag\(|\bGTM-[A-Z0-9]{4,}\b|\bG-[A-Z0-9]{8,12}\b|\bUA-\d{4,}-\d+\b|"
                      r"fbq\(|connect\.facebook\.net|facebook\.com/tr\b|static\.hotjar\.com|clarity\.ms|matomo\.(?:js|php)|"
                      r"plausible\.io/js|cdn\.segment\.com|analytics\.tiktok\.com|snap\.licdn\.com|px\.ads\.linkedin\.com|"
                      r"static\.ads-twitter\.com|cloudflareinsights\.com|umami\.is|mc\.yandex\.ru|bat\.bing\.com|"
                      r"googleadservices\.com|doubleclick\.net|pagead2\.googlesyndication", re.I)
INSCRIPTION = re.compile(r'news\s*-?\s*letter|list-manage\.com|sendinblue|brevo\.com|substack\.com|mailerlite|convertkit|'
                         r'kit\.com/|klaviyo|beehiiv', re.I)
EMPREINTE = re.compile(r'(?<![a-z0-9])pbn', re.I)

LEGAL_SLUGS = ('mentions-legales', 'legal-notice', 'impressum', 'aviso-legal', 'note-legali', 'informazioni-legali')
TERMS_SLUGS = ('cgu', 'terms-of-service', 'terms', 'terms-of-use', 'conditions-generales-dutilisation', 'agb',
               'nutzungsbedingungen', 'condiciones-de-uso', 'condizioni-di-utilizzo')
PRIVACY_SLUGS = ('politique-de-confidentialite', 'privacy-policy', 'privacy', 'datenschutz', 'datenschutzerklaerung',
                 'politica-de-privacidad', 'informativa-sulla-privacy', 'cookies', 'politique-de-cookies',
                 'politique-cookies', 'cookie-policy')


def slug(url):
    s = url.rstrip('/').rsplit('/', 1)[-1]
    return s[:-5] if s.endswith('.html') else s


def extrait(t, m, avant=60, apres=60):
    return t[max(0, m.start() - avant):m.end() + apres]


def prepare(t):
    t = htmlmod.unescape(t).replace('’', "'").replace('ʼ', "'").replace(' ', ' ').replace(' ', ' ')
    return sans_accents(t)

# ------------------------------------------------------------------ parcours du site construit

pages_html = []
for d, ds, fs in os.walk(PUBLIC):
    ds[:] = [x for x in ds if not x.startswith('.')]
    for f in fs:
        if f.endswith('.html'):
            pages_html.append(os.path.join(d, f))
pages_html.sort()

n_articles = n_classements = 0
signatures = {}
legales = {'legal': [], 'terms': [], 'privacy': []}
langues_vues = set()
pngs_mention = set()

for p in pages_html:
    rel = os.path.relpath(p, PUBLIC)
    url = url_de(rel)
    h = lire(p)
    if re.search(r'http-equiv="?refresh', h[:800], re.I):
        continue  # alias de redirection
    article = bool(re.search(r'<article class="?post"?[ >]', h))
    page_mention = bool(re.search(r'<article class="?page page-mention"?[ >]', h))
    parts = [x for x in url.strip('/').split('/') if x]
    if parts and re.fullmatch(r'[a-z]{2}', parts[0]):
        parts = parts[1:]
    sl = slug(url) if len(parts) == 1 else ''
    est_legal = sl in LEGAL_SLUGS
    est_terms = sl in TERMS_SLUGS
    est_privacy = sl in PRIVACY_SLUGS
    info = est_legal or est_terms or est_privacy or sl in ('a-propos', 'qui-sommes-nous', 'about', 'about-us', 'contact',
                                                           'uber-uns', 'ueber-uns', 'quienes-somos', 'chi-siamo', 'kontakt',
                                                           'contacto', 'contatti', 'plan-du-site', 'sitemap')
    pg = Page(INCLURE if article else INCLURE_PAGE)
    try:
        pg.feed(h); pg.close()
    except Exception as e:  # HTML très abîmé : on garde ce qui a été lu
        constat('jsonld', 'AV', url, f'HTML mal lu : {e}')
    langues_vues.add(pg.lang[:2])
    robots = ' '.join(pg.meta.get('robots', [])).lower()

    # JSON-LD
    for blk in pg.ld:
        try:
            data = json.loads(blk)
        except Exception as e:
            constat('jsonld', 'KO', url, f'JSON-LD illisible ({e})'); continue
        s = json.dumps(data, ensure_ascii=False)
        if re.search(r'"@type"\s*:\s*(?:\[[^\]]*)?"Person"', s):
            constat('person', 'KO' if TYPE_B else 'AV', url, 'type Person dans le JSON-LD')
        if re.search(r'"(?:aggregateRating|reviewRating)"|"@type"\s*:\s*"(?:AggregateRating|Rating|Review)"', s):
            constat('note', 'KO', url, 'note dans le JSON-LD (aggregateRating, reviewRating ou Review)')

    # pages légales
    if est_legal or est_terms or est_privacy:
        if 'noindex' not in robots:
            constat('noindex-legal', 'KO', url, 'page légale sans noindex')
        if 'mention-sponsorisee' in h:
            constat('mention', 'KO', url, 'mention « Publication sponsorisée » sur une page légale')
        corps = prepare(' '.join(pg.texte) or ' '.join(pg.tout))
        if est_legal:
            legales['legal'].append((url, pg.lang[:2]))
            if TYPE_B:
                if 'ruben sebag' not in corps.lower():
                    constat('pages-legales', 'KO', url, 'directeur de la publication Ruben Sebag absent')
                if not re.search(r'922\s?000\s?989\s?00033', corps):
                    constat('pages-legales', 'KO', url, 'SIRET 922 000 989 00033 absent')
                if 'upearly' not in corps.lower():
                    constat('pages-legales', 'KO', url, 'éditeur upearly absent')
                sans_siret = re.sub(r'922\s?000\s?989\s?00033|\b\d{3}\s?\d{3}\s?\d{3}\b', ' ', corps)
                m = re.search(r'telephone|\+\s?33|\b0[1-9](?:[ .]?\d{2}){4}\b', sans_siret, re.I)
                if m:
                    constat('telephone', 'KO', url, extrait(sans_siret, m))
        if est_terms:
            legales['terms'].append((url, pg.lang[:2]))
            if TYPE_B:
                if not re.search(r'\b30\s+(?:jours|days|dias|giorni|tage|tagen)\b', corps, re.I):
                    constat('pages-legales', 'KO', url, 'CGU : délai de signalement de 30 jours absent')
                m = re.search(r"clientes?\s+d'upearly|clients\s+of\s+upearly", corps, re.I)
                if m:
                    constat('pages-legales', 'KO', url, 'CGU : ' + extrait(corps, m))
        if est_privacy:
            legales['privacy'].append((url, pg.lang[:2]))

    # traceurs et inscription
    if TYPE_B:
        for m in TRACEURS.finditer(h):
            constat('traceur', 'KO', url, extrait(h, m, 50, 40)); break
        for f in pg.forms:
            act = f.get('action') or ''
            if INSCRIPTION.search(act):
                constat('inscription', 'KO', url, f'formulaire vers {act}')
        if any((i.get('type') or '').lower() == 'email' for i in pg.inputs):
            constat('inscription', 'KO', url, 'champ e-mail (formulaire d\'inscription)')
        hm = prepare(' '.join(pg.hors_main))
        m = INSCRIPTION.search(hm)
        if m:
            constat('inscription', 'KO', url, 'hors contenu : ' + extrait(hm, m))
    else:
        m = TRACEURS.search(h)
        if m:
            constat('traceur', 'AV', url, 'type A, traceur du client ? ' + extrait(h, m, 50, 40))

    # mention et disclaimer de classement
    tete = h.split('<main', 1)[-1].split('</h1>', 1)[0]
    mention_tete = 'mention-sponsorisee' in tete
    for m in re.finditer(r'mention-sponsorisee-([a-z]{2})\.png', h):
        pngs_mention.add(m.group(1))
    if not TYPE_B:
        if 'mention-sponsorisee' in h or 'ranking-disclaimer' in h:
            constat('mention', 'KO', url, 'type A : mention ou disclaimer de classement affiché')
    elif article:
        corps_art = h.split('<main', 1)[-1].split('class=related', 1)[0].split('class="related', 1)[0]
        disc = 'ranking-disclaimer' in corps_art
        if mention_tete != disc:
            constat('mention', 'KO', url, 'mention et disclaimer de classement dissociés')
        if not mention_tete and any('"ItemList"' in b for b in pg.ld):
            constat('mention', 'AV', url, 'liste de marques (ItemList) sans mention : classement: false voulu ?')

    if article:
        n_articles += 1
        n_classements += mention_tete
        if TYPE_B:
            auteurs = pg.meta.get('author', [])
            if not auteurs or not auteurs[0].strip():
                constat('signature', 'KO', url, 'meta author (signature de la rédaction) absente')
            else:
                signatures.setdefault(pg.lang[:2], {}).setdefault(auteurs[0].strip(), []).append(url)
            if 'author-box' not in h:
                constat('signature', 'KO', url, 'bloc de la rédaction absent')

    # texte contrôlé : articles et pages sous mention (bloquant), autres pages hors pages d'information (avertissement)
    if article or page_mention:
        brut = ' '.join([pg.title, ' '.join(pg.meta.get('description', [])[:1]), ' '.join(pg.texte)])
        niveau_fort = 'KO'
    elif not info and '/tags/' not in url and '/page/' not in url:
        brut = ' '.join(pg.texte)  # contenu propre de la page (prose, titre, description)
        niveau_fort = 'AV'
    else:
        brut = ''
        niveau_fort = None
    texte = prepare(brut)
    if texte:
        vus = set()
        for m in ALLEG_KO.finditer(texte):
            vus.add(m.start())
            constat('allegation', niveau_fort, url, extrait(texte, m), m.group(0))
        acc = htmlmod.unescape(brut).replace('\u2019', "'")
        for m in ALLEG_KO_ACC.finditer(acc):
            constat('allegation', niveau_fort, url, extrait(acc, m), sans_accents(m.group(0)))
        if (article or page_mention) and (mention_tete or page_mention or any('"ItemList"' in b for b in pg.ld)
                                          or RANKING.search(prepare(pg.title))):
            for m in ALLEG_AV.finditer(texte):
                if any(abs(m.start() - v) < 40 for v in vus):
                    continue
                constat('allegation', 'AV', url, extrait(texte, m), m.group(0))
            for m in ALLEG_AV_ACC.finditer(acc):
                if any(abs(m.start() - v) < 60 for v in vus):
                    continue
                constat('allegation', 'AV', url, extrait(acc, m), sans_accents(m.group(0)))
        for m in METHODE.finditer(texte):
            constat('methode', niveau_fort, url, extrait(texte, m), m.group(0))
        m = NOTE_ETOILES_KO.search(texte)
        if m:
            constat('note', niveau_fort, url, extrait(texte, m))
        elif article or page_mention:
            m = NOTE_ETOILES.search(texte)
            if m:
                constat('note', 'AV', url, 'étoile isolée : ' + extrait(texte, m))
        for m in NOTE_FRACTION.finditer(texte):
            ctx = texte[max(0, m.start() - 50):m.end() + 50]
            if re.search(r'\d{1,2}\s?/\s?\d{1,2}\s?/\s?\d{2,4}', ctx):
                continue  # date
            avant = texte[max(0, m.start() - 12):m.start()]
            if re.search(r'\b(?:h|heures?|jours?|j|km|mois)\s*$', avant, re.I):
                continue
            num, den = float(m.group(1).replace(',', '.')), float(m.group(2))
            if num > den or (num < 2 and '.' not in m.group(1) and ',' not in m.group(1)):
                continue  # 90/10 (composition), 1/10 (dilution) : pas une note
            if NOTE_CONTEXTE.search(ctx):
                constat('note', niveau_fort, url, extrait(texte, m, 50, 50), m.group(0))
            elif article or page_mention:
                constat('note', 'AV', url, extrait(texte, m, 50, 50), m.group(0))
        if article and 'datashake' not in SITE_HOTE:
            for tag, t in pg.titres:
                t2 = prepare(t)
                if DATASHAKE.search(t2):
                    constat('classement-datashake', 'KO', url, f'{tag} : {t2}')
            for m in DATASHAKE.finditer(texte):
                constat('classement-datashake', 'AV', url, extrait(texte, m)); break

    # liens externes (hors pages d'information, qui citent l'hébergeur)
    # Un lien vers un domaine hors liste blanche est bloquant quand il désigne une marque présentée par la page (le nom du
    # domaine figure dans un intertitre ou une cellule de tableau) ou quand il porte un paramètre d'affiliation ;
    # sinon c'est une source à relire (avertissement) : une étude, un office de tourisme, un média cité.
    if not info:
        vitrine = set()
        for tag, t in pg.titres:
            mots = [compact(x) for x in re.sub(r'^\s*(?:n\s?[°º]|#)?\s*\d+\s*[.)/:-]?\s*', '', sans_accents(htmlmod.unescape(t))).split()]
            mots = [x for x in mots if x]
            if tag in ('td', 'th', 'dt') and len(mots) > 4:
                vitrine.add(''.join(mots))  # longue cellule : seulement si elle est le nom entier
                continue
            for k in range(1, min(4, len(mots)) + 1):
                vitrine.add(''.join(mots[:k]))  # début d'un intertitre ou d'une cellule courte : « 1. In Extenso », « Café Coton : »
        for href, dans in pg.liens:
            if not re.match(r'^https?://', href, re.I) and not href.startswith('//'):
                continue
            if PARTAGE.match(href):
                continue
            ho = hote(href if not href.startswith('//') else 'https:' + href)
            if domaine_permis(ho):
                continue
            nom_dom = etiquette(ho)
            marque = len(nom_dom) >= 3 and nom_dom in vitrine
            affil = bool(AFFILIATION.search(href))
            niveau = 'KO' if (marque or affil) else 'AV'
            pourquoi = ' (marque présentée par la page)' if marque else (' (lien d\'affiliation)' if affil else ' (source à relire)')
            constat('lien-externe', niveau, url, f'{ho}{pourquoi} : {href[:110]}' + ('' if dans else ' [hors contenu]'))

# un domaine reconnu comme marque sur une page l'est sur tout le site
marques_site = set(re.match(r'(\S+)', c[3]).group(1) for c in CONSTATS if c[0] == 'lien-externe' and c[1] == 'KO')
for c in CONSTATS:
    if c[0] == 'lien-externe' and c[1] == 'AV' and re.match(r'(\S+)', c[3]).group(1) in marques_site:
        c[1] = 'KO'
        c[3] = c[3].replace('(source à relire)', '(marque présentée ailleurs sur le site)')

# pages légales attendues (type B)
if TYPE_B:
    if not legales['legal']:
        constat('pages-legales', 'KO', '/', 'aucune page de mentions légales (slug mentions-legales, legal-notice...)')
    if not legales['terms']:
        constat('pages-legales', 'KO', '/', 'aucune page de CGU (slug cgu, terms...)')
    if not legales['privacy']:
        constat('pages-legales', 'AV', '/', 'aucune politique de confidentialité trouvée par son slug')
    for lg in sorted(x for x in langues_vues if x):
        if legales['legal'] and not any(l == lg for _, l in legales['legal']):
            constat('pages-legales', 'AV', f'/{lg}/', f'pas de mentions légales dans la langue {lg}')
    for lg, sigs in signatures.items():
        if len(sigs) > 1:
            detail = ' ; '.join(f'« {s} » ({len(u)})' for s, u in sigs.items())
            constat('signature', 'KO', f'/{lg}/', f'plusieurs signatures : {detail}')
    for d in ('auteurs', 'authors', 'author', 'auteur', 'autori', 'autoren', 'autores'):
        for base in [PUBLIC] + [os.path.join(PUBLIC, l) for l in langues_vues if l]:
            if os.path.isdir(os.path.join(base, d)):
                constat('pages-auteurs', 'KO', '/' + os.path.relpath(os.path.join(base, d), PUBLIC) + '/', 'pages d\'auteur publiées')
for lg in pngs_mention:
    if not os.path.isfile(os.path.join(PUBLIC, 'images', f'mention-sponsorisee-{lg}.png')):
        constat('mention', 'KO', '/images/', f'mention-sponsorisee-{lg}.png appelé mais absent')

# empreinte du réseau
base_url = (cle(CONF, 'baseURL', '') or '').rstrip('/')
retirer = None
if EMPREINTE.search(base_url):
    # URL de préversion (analytics-ds.github.io/pbn-geo-<slug>/) : toutes les URL absolues la portent. Une seule ligne,
    # bloquante si le site est ouvert aux moteurs, avertissement s'il est en préparation (noindexSite).
    constat('empreinte', 'AV' if NOINDEX_SITE else 'KO', 'hugo.toml',
            f'baseURL {base_url} : URL de préversion' + (' (site en préparation, à remplacer par le domaine à la mise en ligne)'
                                                         if NOINDEX_SITE else ' publiée et ouverte aux moteurs'))
    chemin = urlsplit(base_url).path.rstrip('/')
    formes = {base_url, quote(base_url, safe=':/'), base_url.replace('https://', '//')}
    if EMPREINTE.search(chemin):
        formes |= {chemin, quote(chemin, safe='/')}
    retirer = re.compile('|'.join(re.escape(f) for f in sorted(formes, key=len, reverse=True)), re.I)
JETON = re.compile(r'\{\{[A-Z][A-Z0-9_]+\}\}')
for d, ds, fs in os.walk(PUBLIC):
    for f in fs:
        p = os.path.join(d, f)
        rel = os.path.relpath(p, PUBLIC).replace(os.sep, '/')
        if EMPREINTE.search(rel):
            constat('empreinte', 'KO', '/' + rel, 'nom de fichier'); continue
        if not re.search(r'\.(html|xml|txt|json|css|js|webmanifest|svg)$', f):
            continue
        t = lire(p)
        if retirer:
            t = retirer.sub(' ', t)
        for m in EMPREINTE.finditer(t):
            # « PBN » écrit comme un mot dans un texte (article sur le netlinking) : avertissement ; dans une URL, une classe,
            # un identifiant ou un nom de fichier : faute.
            av, ap = t[max(0, m.start() - 1):m.start()], t[m.end():m.end() + 2]
            code = bool(re.match(r'[-_./=\w]', ap[:1]) and not re.match(r's\b|s[^\w]', ap)) or av in ('/', '-', '_', '.', '=', '"', "'")
            constat('empreinte', 'KO' if code else 'AV', '/' + rel, extrait(t, m, 40, 30))
            break
        if f.endswith('.html'):
            m = JETON.search(t)
            if m:
                constat('squelette', 'AV' if NOINDEX_SITE else 'KO', '/' + rel, f'jeton {m.group(0)} non remplacé')

# front matter : champ author
DOSSIERS_CONTENU = {os.path.join(SITE, 'content')}
for lg, lc in LANGUES.items():
    cd = cle(lc, 'contentDir')
    if cd:
        DOSSIERS_CONTENU.add(os.path.join(SITE, cd))
for m in (cle(cle(CONF, 'module', {}) or {}, 'mounts', []) or []):
    if isinstance(m, dict) and str(cle(m, 'target', '')).startswith('content') and cle(m, 'source'):
        DOSSIERS_CONTENU.add(os.path.join(SITE, cle(m, 'source')))
vus_fm = set()
auteurs_a = []
for base in sorted(DOSSIERS_CONTENU):
    if not os.path.isdir(base):
        continue
    for d, ds, fs in os.walk(base):
        for f in fs:
            if not f.endswith(('.md', '.markdown', '.html')):
                continue
            p = os.path.realpath(os.path.join(d, f))
            if p in vus_fm:
                continue
            vus_fm.add(p)
            t = lire(p)
            rel = os.path.relpath(p, SITE)
            if t.startswith('---'):
                fm = t[3:].split('\n---', 1)[0]
                m = re.search(r'^(author|authors|auteur|auteurs)\s*:\s*(.*)$', fm, re.M)
            elif t.startswith('+++'):
                fm = t[3:].split('\n+++', 1)[0]
                m = re.search(r'^(author|authors|auteur|auteurs)\s*=\s*(.*)$', fm, re.M)
            else:
                m = None
            if m:
                if TYPE_B:
                    constat('auteur', 'KO', rel, f'{m.group(1)}: {m.group(2)}')
                else:
                    auteurs_a.append(f'{rel} ({m.group(2).strip()})')
if auteurs_a:
    constat('auteur', 'AV', 'content/', f'type A : {len(auteurs_a)} fichier(s) avec un champ author (ignoré par le thème, '
            f'à retirer à l\'occasion), ex. {auteurs_a[0]}')

# ------------------------------------------------------------------ termes de taxonomie : une URL, une seule page
# Hugo range un terme sous une clé (minuscules, blancs changés en tirets, accents, apostrophes et ponctuation gardés) et
# le publie à une URL d'où removePathAccents retire les accents, et d'où sortent apostrophes et ponctuation.
# Deux clés pour une URL (« Crédit immobilier » et « credit immobilier », « L'immobilier » et « L’immobilier », terme
# « Travaux et Rénovation » et page de terme rangée dans content/categories/travaux-et-renovation/) font deux pages
# pour une seule URL : Hugo publie l'une ou l'autre au hasard d'un build à l'autre, parfois la page vide.
# Mesuré sur Hugo 0.165 : la casse et « e commerce » / « e-commerce » donnent la même clé, donc un seul terme.

def taxonomies_par_langue():
    """{langue: {pluriel: singulier}} des taxonomies qui publient des pages de terme."""
    dk = [str(x).lower() for x in (cle(CONF, 'disableKinds', []) or [])]
    if 'term' in dk:
        return {}
    racine = cle(CONF, 'taxonomies')
    if racine is None:
        racine = {'category': 'categories', 'tag': 'tags'}  # défaut de Hugo
    out = {}
    for lg in (list(LANGUES) or [DEFAUT_LANGUE]):
        t = cle(cle(LANGUES, lg, {}) or {}, 'taxonomies')
        t = racine if t is None else t
        out[lg] = {str(v).lower(): str(k) for k, v in (t or {}).items()}
    return out


DEFAUT_LANGUE = str(cle(CONF, 'defaultContentLanguage', '') or (next(iter(LANGUES)) if LANGUES else 'en')).lower()
SANS_ACCENTS_URL = cle(CONF, 'removePathAccents') is True
DANS_SOUS_DOSSIER = cle(CONF, 'defaultContentLanguageInSubdir') is True


def racines_contenu():
    """[(dossier absolu, langue ou None)] : contentDir des langues et montages vers content (lang, sites.matrix)."""
    out = []
    for lg, lc in LANGUES.items():
        cd = cle(lc, 'contentDir')
        if cd:
            out.append((os.path.join(SITE, cd), lg))
        for m in (cle(cle(lc, 'module', {}) or {}, 'mounts', []) or []):
            if isinstance(m, dict) and str(cle(m, 'target', '')).startswith('content') and cle(m, 'source'):
                out.append((os.path.join(SITE, cle(m, 'source')), lg))
    for m in (cle(cle(CONF, 'module', {}) or {}, 'mounts', []) or []):
        if not (isinstance(m, dict) and str(cle(m, 'target', '')).startswith('content') and cle(m, 'source')):
            continue
        lg = cle(m, 'lang')
        mat = liste(cle(cle(cle(m, 'sites', {}) or {}, 'matrix', {}) or {}, 'languages'))
        if not lg and len(mat) == 1:
            lg = mat[0]
        out.append((os.path.join(SITE, cle(m, 'source')), lg or None))
    out.append((os.path.join(SITE, cle(CONF, 'contentDir', 'content') or 'content'), None))
    vus, res = set(), []
    for d, lg in out:
        d = os.path.normpath(d)
        if d not in vus and os.path.isdir(d):
            vus.add(d); res.append((d, lg))
    return res


def cle_terme(s):
    """Clé Hugo d'un terme ou d'un dossier de page de terme."""
    return re.sub(r'\s', '-', unicodedata.normalize('NFC', s.strip('\n')).lower())


def url_terme(k):
    """Segment d'URL publié pour une clé (accents retirés si removePathAccents, ponctuation et apostrophes retirées)."""
    if SANS_ACCENTS_URL:
        k = unicodedata.normalize('NFC', sans_accents(k))
    return ''.join(c for c in k if c.isalnum() or c in '-_./#+~@')


def valeurs_front_matter(t, nom):
    """(valeurs du champ `nom` du front matter, brouillon ?) pour YAML, TOML ou JSON ; liste vide si absent."""
    if t.startswith('---'):
        fm, sep = t[3:].split('\n---', 1)[0], ':'
    elif t.startswith('+++'):
        fm, sep = t[3:].split('\n+++', 1)[0], '='
    elif t.lstrip().startswith('{'):
        try:
            d, _ = json.JSONDecoder().raw_decode(t.lstrip())
        except ValueError:
            return [], False
        v = cle(d, nom)
        return ([str(x) for x in v] if isinstance(v, list) else [str(v)] if isinstance(v, str) else []), cle(d, 'draft') is True
    else:
        return [], False
    brouillon = bool(re.search(r'^draft\s*' + re.escape(sep) + r'\s*["\']?true\b', fm, re.M | re.I))
    lignes = fm.split('\n')
    for i, l in enumerate(lignes):
        m = re.match(r'^' + re.escape(nom) + r'\s*' + re.escape(sep) + r'[ \t]*(.*)$', l, re.I)
        if not m:
            continue
        v = m.group(1).strip()
        if v.startswith('['):
            j = i
            while ']' not in re.sub(r'"(?:[^"\\]|\\.)*"|\'[^\']*\'', '', v) and j + 1 < len(lignes):
                j += 1; v += ' ' + lignes[j].strip()
            corps = v[1:v.rfind(']')] if ']' in v else v[1:]
            vals = []
            for q in re.finditer(r'"((?:[^"\\]|\\.)*)"|\'((?:[^\']|\'\')*)\'|([^,\s][^,]*)', corps):
                if q.group(1) is not None:
                    vals.append(q.group(1).replace('\\"', '"').replace('\\\\', '\\'))
                elif q.group(2) is not None:
                    vals.append(q.group(2).replace("''", "'"))
                elif q.group(3).strip() and not q.group(3).strip().startswith('#'):
                    vals.append(q.group(3).strip())
            return vals, brouillon
        if v and not v.startswith('#'):
            s = scalaire(v) if sep == ':' else (v[1:-1] if v[:1] in '"\'' and v[-1:] == v[:1] else None)
            return ([str(s)] if s not in (None, '') and not isinstance(s, (bool, list)) else []), brouillon
        vals = []
        for l2 in lignes[i + 1:]:
            if not l2.strip() or l2.lstrip().startswith('#'):
                continue
            m2 = re.match(r'^\s*-\s+(.*)$', l2) or re.match(r'^\s*-$', l2)
            if not m2 or not l2[:1].isspace() and not l2.startswith('-'):
                break
            s = scalaire(m2.group(1)) if m2.groups() else None
            if s not in (None, '') and not isinstance(s, (bool, list)):
                vals.append(str(s))
        return vals, brouillon
    return [], brouillon


def controle_taxonomies():
    taxos = taxonomies_par_langue()
    if not any(taxos.values()):
        return
    racines = racines_contenu()
    noms_langues = {str(x).lower() for x in LANGUES}
    # (langue, pluriel) -> clé -> {'graphies': {graphie: [fichiers]}, 'pages': [fichiers _index.md], 'url': url forcée}
    termes = {}
    vus = set()
    for base, _ in sorted(racines, key=lambda r: len(r[0])):
        for d, ds, fs in os.walk(base):
            ds[:] = [x for x in ds if not x.startswith('.')]
            for f in fs:
                if not f.endswith(('.md', '.markdown', '.html')):
                    continue
                p = os.path.join(d, f)
                rp = os.path.realpath(p)
                if rp in vus:
                    continue
                vus.add(rp)
                racine, lg = max(((r, l) for r, l in racines if p.startswith(r + os.sep)), key=lambda x: len(x[0]))
                m = re.search(r'\.([a-z]{2}(?:-[a-z]+)?)\.(?:md|markdown|html)$', f, re.I)
                if m and m.group(1).lower() in noms_langues:
                    lg = m.group(1).lower()
                lg = (lg or DEFAUT_LANGUE).lower()
                plur = taxos.get(lg) or taxos.get(DEFAUT_LANGUE) or {}
                rel_racine = os.path.relpath(p, racine).replace(os.sep, '/').split('/')
                rel = os.path.relpath(p, SITE)
                t = lire(p)
                # page de terme : <racine>/<pluriel>/<dossier>/_index.md
                if len(rel_racine) == 3 and rel_racine[0].lower() in plur and re.match(r'_index(\.[\w-]+)?\.(md|markdown|html)$', f):
                    k = cle_terme(rel_racine[1])
                    e = termes.setdefault((lg, rel_racine[0].lower()), {}).setdefault(k, {'graphies': {}, 'pages': [], 'url': None})
                    e['pages'].append(rel)
                    u, _ = valeurs_front_matter(t, 'url')
                    sl, _ = valeurs_front_matter(t, 'slug')
                    if u:
                        e['url'] = u[0].strip('/').lower()
                    elif sl:
                        e['url'] = rel_racine[0].lower() + '/' + url_terme(cle_terme(sl[0]))
                    continue
                if rel_racine[0].lower() in plur:
                    continue  # index de la taxonomie
                for pl in plur:
                    vals, brouillon = valeurs_front_matter(t, pl)
                    if brouillon:
                        break
                    for v in vals:
                        if not v.strip():
                            continue
                        e = termes.setdefault((lg, pl), {}).setdefault(cle_terme(v), {'graphies': {}, 'pages': [], 'url': None})
                        e['graphies'].setdefault(v, []).append(rel)
    for (lg, pl), cles_ in sorted(termes.items()):
        par_url = {}
        for k, e in cles_.items():
            par_url.setdefault(e['url'] or pl + '/' + url_terme(k), []).append(k)
        for u, ks in sorted(par_url.items()):
            if len(ks) < 2:
                g = cles_[ks[0]]['graphies']
                if len(g) > 1:
                    # casse, blancs ou tirets : Hugo fusionne en un seul terme (une page), libellé choisi par le thème
                    detail = ' ; '.join(f'« {x} » ({len(f)} page(s) : {", ".join(f[:2])}{" ..." if len(f) > 2 else ""})'
                                        for x, f in sorted(g.items(), key=lambda x: -len(x[1])))
                    constat('taxonomie', 'AV', f'/{u}/', f'{pl} : graphies d\'un même terme, fusionnées par Hugo (une seule '
                            f'page) : {detail}. À unifier à l\'occasion sur la plus fréquente.', entier=True)
                continue
            prefixe = '' if (lg == DEFAUT_LANGUE and not DANS_SOUS_DOSSIER) or not LANGUES else f'/{lg}'
            url = f'{prefixe}/{u}/' if not u.endswith('.html') else f'{prefixe}/{u}'
            n = {k: sum(len(x) for x in cles_[k]['graphies'].values()) for k in ks}
            avec_articles = [k for k in ks if n[k]]
            garder = max(avec_articles or ks, key=lambda k: (n[k], bool(cles_[k]['pages'])))
            garder_g = max(cles_[garder]['graphies'].items(), key=lambda g: len(g[1]))[0] if cles_[garder]['graphies'] else None
            parts, quoi = [], []
            for k in sorted(ks, key=lambda k: -n[k]):
                e = cles_[k]
                for g, fichiers in sorted(e['graphies'].items(), key=lambda g: -len(g[1])):
                    ex = '' if k == garder and g == garder_g else ' : ' + ', '.join(fichiers[:3]) + (f' et {len(fichiers) - 3} autre(s)' if len(fichiers) > 3 else '')
                    parts.append(f'« {g} » ({len(fichiers)} page(s){ex})')
                for pg in e['pages']:
                    parts.append(f'page de terme {pg}')
                    if k != garder:
                        dossier = os.path.dirname(pg)
                        cible = os.path.join(os.path.dirname(dossier), garder)
                        quoi.append(f'nommer le dossier d\'après le terme : git mv « {dossier} » « {cible} » (même URL)'
                                    if not cles_[garder]['pages'] else
                                    f'fusionner {pg} dans la page de terme {cles_[garder]["pages"][0]}, puis supprimer « {dossier} »')
            if any(k != garder and cles_[k]['graphies'] for k in ks):
                quoi.insert(0, f'unifier la graphie dans le front matter des pages citées : « {garder_g or garder} »'
                               + (' (et la reporter dans le title de la page de terme s\'il faut une majuscule ou des accents)'
                                  if cles_[garder]['pages'] else ''))
            constat('taxonomie', 'KO', url, f'{pl} : ' + ' ; '.join(parts) + f' : même URL pour {len(ks)} pages de terme, Hugo publie '
                    'l\'une ou l\'autre au hasard d\'un build à l\'autre. Corriger : ' + ' ; '.join(quoi) + '. Une URL qui change garde l\'ancienne en aliases.', entier=True)


controle_taxonomies()

# ------------------------------------------------------------------ exceptions de pbn.yaml

exceptions = CTRL.get('exceptions') or []
if not isinstance(exceptions, list):
    exceptions = []
    constat('exception', 'KO', 'pbn.yaml', 'controle.exceptions doit être une liste')
n_exc_util = [0] * len(exceptions)
for i, e in enumerate(exceptions):
    if not isinstance(e, dict) or not e.get('regle'):
        constat('exception', 'KO', 'pbn.yaml', f'exception n°{i + 1} sans règle'); continue
    if not str(e.get('raison') or '').strip():
        constat('exception', 'KO', 'pbn.yaml', f'exception n°{i + 1} ({e.get("regle")}) sans raison')
    if e.get('regle') not in REGLES:
        constat('exception', 'KO', 'pbn.yaml', f'exception n°{i + 1} : règle inconnue « {e.get("regle")} »')
for c in CONSTATS:
    if c[0] == 'exception':
        continue
    for i, e in enumerate(exceptions):
        if not isinstance(e, dict) or e.get('regle') != c[0] or not str(e.get('raison') or '').strip():
            continue
        pages = liste(e.get('page')) + liste(e.get('pages'))
        if pages and not any(c[2] == x or (x.endswith('/') and c[2].startswith(x)) or c[2].startswith(x.rstrip('*'))
                             for x in pages):
            continue
        txt = e.get('texte')
        if txt and sans_accents(str(txt)).lower() not in sans_accents(c[3]).lower():
            continue
        c[4] = i; n_exc_util[i] += 1
        break
for i, e in enumerate(exceptions):
    if isinstance(e, dict) and e.get('regle') in REGLES and n_exc_util[i] == 0:
        constat('exception', 'AV', 'pbn.yaml', f'exception n°{i + 1} ({e.get("regle")}) ne couvre plus rien : la retirer')

# ------------------------------------------------------------------ rapport

ko = [c for c in CONSTATS if c[1] == 'KO' and c[4] is None]
av = [c for c in CONSTATS if c[1] == 'AV' and c[4] is None]
exc = [c for c in CONSTATS if c[4] is not None]
nom = os.path.basename(SITE.rstrip('/')) if os.path.basename(SITE) != 'hugo' else os.path.basename(os.path.dirname(SITE))
print(f'Contrôle de conformité : {nom} (type {TYPE}), {len(pages_html)} pages HTML, {n_articles} articles'
      + (f' dont {n_classements} classements' if TYPE_B else '')
      + (f', exceptions lues dans {os.path.relpath(YAML_CHEMIN, SITE)}' if YAML_CHEMIN else ''))
lim = None if ARGS['tout'] else 8


def grouper(lot):
    """Une faute de gabarit se répète sur chaque page : même règle et même extrait, une seule ligne."""
    g = {}
    for c in lot:
        g.setdefault((c[0], c[3]), []).append(c[2])
    return g


gko, gav = grouper(ko), grouper(av)
for titre, g in (('KO', gko), ('AV', gav)):
    par = {}
    for (r, ext), pages in g.items():
        par.setdefault(r, []).append((pages, ext))
    for r in REGLES:
        if r not in par:
            continue
        lignes = par[r]
        for pages, ext in lignes[:lim]:
            plus = f' (et {len(pages) - 1} autre(s) page(s))' if len(pages) > 1 else ''
            print(f'{titre}  [{r}] {pages[0]}{plus} : {ext}')
        if lim and len(lignes) > lim:
            print(f'{titre}  [{r}] ... {len(lignes) - lim} de plus (--tout pour tout voir)')
if exc:
    print(f'{len(exc)} constat(s) couverts par les exceptions de pbn.yaml')
print(f'Bilan : {len(gko)} faute(s) bloquante(s), {len(gav)} avertissement(s)')
print('CONTROLE DE CONFORMITE :', 'KO' if ko else 'ok')
sys.exit(1 if ko else 0)
