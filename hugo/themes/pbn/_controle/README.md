# Contrôle de conformité du thème (bloquant au build)

`controle.py` relit le site construit (`public/`) et le front matter (`content/`), et sort en **code 1** s'il reste une faute bloquante. Il est copié avec le thème dans chaque site (`themes/pbn/_controle/`, jamais publié : Hugo ne lit pas ce dossier) et tourne dans le workflow GitHub Actions, après le build et avant le déploiement : un site en faute ne se déploie pas.

Python 3.9 ou plus, bibliothèque standard seulement (le runner `ubuntu-24.04` a Python 3.12). Environ 5 secondes pour 1 000 pages.

```bash
hugo --gc --minify
python3 themes/pbn/_controle/controle.py                  # racine du site, public/ par défaut
python3 themes/pbn/_controle/controle.py --public /tmp/build --tout
```

Options : `--site <dossier>` (racine Hugo, défaut : trois niveaux au-dessus du script), `--public <dossier>` (défaut `<site>/public`), `--type A|B` (défaut : `[params.pbn] type` de `hugo.toml`, puis `site.type` de `pbn.yaml`, puis B), `--tout` (toutes les occurrences, sinon 8 par règle). Code 2 : contrôle impossible (pas de build, `hugo.toml` ou `pbn.yaml` illisible).

Sortie : une ligne par constat, `KO` (bloquant) ou `AV` (avertissement, à relire, jamais bloquant), avec la règle entre crochets, la page et l'extrait. Une faute de gabarit qui se répète sur toutes les pages tient en une ligne (« et N autres pages »).

## Règles

Les références sont la checklist finale de conformité du parc et les règles articles (checklist de Ruben Sebag, 15/10/2026). Une règle sujette à faux positifs est un avertissement ; seules les vraies fautes bloquent. Calibrage du 2026-10-17 sur les 43 sites Hugo du parc.

| Règle | Type | Bloquant (KO) | Avertissement (AV) |
|---|---|---|---|
| `pages-legales` | B | aucune page de mentions légales ou de CGU (trouvées par leur slug, comme le thème) ; mentions légales sans Ruben Sebag, sans le SIRET 922 000 989 00033 ou sans upearly ; CGU sans délai de signalement de 30 jours ou qui disent « clientes d'upearly » | pas de politique de confidentialité ; une langue sans mentions légales |
| `telephone` | B | un numéro ou le mot « téléphone » dans les mentions légales | |
| `noindex-legal` | A, B | mentions légales, CGU, confidentialité ou cookies sans `noindex` | |
| `signature` | B | article sans `meta author` ou sans bloc de la rédaction ; plusieurs signatures dans une même langue | |
| `pages-auteurs` | B | dossier `auteurs/`, `authors/`… publié | |
| `person` | B (A : AV) | `"@type": "Person"` dans un JSON-LD | |
| `jsonld` | A, B | JSON-LD illisible | |
| `mention` | B | mention « Publication sponsorisée » et disclaimer de classement dissociés sur un article ; mention sur une page légale ; image de mention appelée mais absente | liste de marques (`ItemList`) sans mention |
| `mention` | A | mention ou disclaimer de classement affiché | |
| `traceur` | B (A : AV) | Google Analytics, Tag Manager, pixel Meta, Hotjar, Clarity, Matomo, Plausible, LinkedIn, TikTok, etc. | |
| `inscription` | B | formulaire vers un outil d'envoi de courriels, champ e-mail, appel à s'inscrire hors du contenu (en-tête, pied de page) | |
| `allegation` | A, B | formulations sans autre sens possible, dans le texte visible des articles (title, description, h1, « En bref », contenu, FAQ, sources) : « notre n°1 », « le n°1 du marché », « numéro un », « notre choix », « choix de la rédaction », « editor's choice », « our pick », « avis vérifiés », « nous avons testé / vérifié », « testé par nos soins », « nos tests », « nos relevés », « comparateur indépendant », « en toute objectivité », « avis impartial », « la référence du marché », « leader du marché », « imbattable », « inégalé », « le meilleur du marché »… | dans les classements seulement : « n°1 » ou « #1 » seuls (noms de produits), « top picks », « our favourite », « vérifié », « testé », « reste la référence », « le leader », « incontournable », « sans équivalent », « nous… indépendant / objectif » ; hors articles : les formulations bloquantes, à relire |
| `methode` | A, B | « nos critères de sélection », « notre méthodologie », « comment nous avons classé », « nous avons comparé 12 marques », « we compared 5 shops », « how we ranked »… | |
| `note` | A, B | étoiles en série (★★★★☆), note sur 5, 10, 20 ou 100 près d'un mot de notation (note, avis, rating, étoiles, Trustpilot…), `aggregateRating` ou `reviewRating` dans le JSON-LD | étoile isolée (hôtel 4★), fraction sans contexte (« Quality Score de 10/10 ») ; « 90/10 » ou « 1/10 » ne sont jamais des notes |
| `classement-datashake` | A, B (sauf site sur un domaine datashake) | datashake ou upearly dans un intertitre ou une cellule de tableau d'un article | datashake ou upearly cité dans le texte |
| `lien-externe` | A, B | lien vers un domaine hors liste blanche qui est une marque présentée par la page (son nom ouvre un intertitre ou une cellule de tableau : « 1. In Extenso », « Café Coton : ») ou porte un paramètre d'affiliation ; tout lien vers ce domaine sur le reste du site | autre domaine hors liste blanche : source à relire (étude, office de tourisme, média) |
| `auteur` | B (A : AV) | champ `author`, `authors`, `auteur` dans le front matter | type A : une ligne par site, le thème l'ignore |
| `empreinte` | A, B | `pbn` dans un nom de fichier publié, une URL, une classe, un identifiant, un script ; `baseURL` de préversion (`…/pbn-geo-<slug>/`) sur un site ouvert aux moteurs | « PBN » écrit comme un mot dans un article (sujet SEO) ; `baseURL` de préversion d'un site en préparation (`noindexSite`) |
| `squelette` | A, B | jeton du squelette (`{{SITE_TITLE}}`…) dans une page publiée, site ouvert aux moteurs | même chose, site en préparation |
| `exception` | | exception de `pbn.yaml` sans règle, sans raison ou à la règle inconnue | exception qui ne couvre plus rien ; `site.type` de `pbn.yaml` différent de `hugo.toml` |

**Liste blanche des liens externes** : le domaine du site, la liste par défaut des sources officielles du thème (`pbn/sources-liens.html`), des organismes publics et paritaires (France Travail, net-entreprises, Apec, CCI, Atout France, OCDE, Eurostat…), les publications scientifiques (doi.org, PubMed, BMJ, JAMA, PLOS, Cochrane, Cairn…), les sites de crédits et licences d'images (Wikimedia, Creative Commons, Pexels, Unsplash, Flickr…), les sites des grandes villes, les suffixes publics (`.gouv.fr`, `.gov`, `.europa.eu`, `.int`, `.edu`, `.ac.uk`…), plus `[params.pbn] sourcesLiens` du site et `controle.domaines` de `pbn.yaml`. Type A : le domaine de la marque éditrice en plus (`sourcesMarque`, `marque_editrice` de `pbn.yaml`, domaine des `legalLinks`, et le domaine du client quand le site est sur son sous-domaine). Les liens de partage (LinkedIn, X, Facebook) sont permis. Les pages d'information (légales, à propos, contact, plan du site) ne sont pas contrôlées sur ce point : elles citent l'hébergeur.

**Ce qui n'est pas contrôlé** (jugement humain, veille juridique quotidienne) : les éloges seuls sur les concurrents cités, les sujets interdits, la pertinence des disclaimers santé et finance, le `classement: true` d'un evergreen.

## Exceptions par site : clé `controle:` de `pbn.yaml`

`pbn.yaml` est la fiche d'identité éditoriale du site (format 1, défini par l'agent `parc-pbn-geo` du plugin SEO). Le contrôle n'y lit que `controle`, `site.type` et `marque_editrice` ; le reste appartient aux skills de rédaction. Pour `meilleur-logiciel-rh.fr` (sources Hugo dans `hugo/`), `pbn.yaml` est à la racine du dépôt.

```yaml
controle:
  domaines:                       # domaines permis en lien externe en plus de la liste blanche (sous-domaines compris)
    - globalwellnessinstitute.org
  exceptions:                     # chaque faute acceptée, avec sa raison ; la raison est obligatoire
    - regle: empreinte            # identifiant de la règle, celui affiché entre crochets
      page: /blog/erreurs-seo-a-eviter/   # facultatif : chemin publié, ou préfixe finissant par « / » (toutes les pages sinon)
      texte: "PBN"                # facultatif : extrait du constat (sous-chaîne, sans casse ni accents)
      raison: "article sur le netlinking, le mot y désigne la pratique, pas le site"
    - regle: lien-externe
      pages: [/blog/un-article/, /en/blog/an-article/]
      texte: exemple.org
      raison: "étude citée comme source, validée par Damien le 2026-10-17"
```

- Une exception couvre aussi bien un KO qu'un AV ; le rapport compte les constats couverts.
- Une exception sans raison, à la règle inconnue ou mal formée est elle-même un KO ; une exception qui ne couvre plus rien est signalée (à retirer).
- `controle.type: A|B` force le type (rare : `hugo.toml` fait foi).
- Une exception se décide avec Damien : c'est une dérogation à la checklist, pas un moyen de faire passer le build.

## Étape à ajouter au workflow des sites

Workflow standard (`.github/workflows/hugo.yml`), juste après « Build with Hugo » et avant « Upload artifact » :

```yaml
      - name: Contrôle de conformité
        run: python3 themes/pbn/_controle/controle.py
```

`meilleur-logiciel-rh.fr` (sources dans `hugo/`, `build.sh` recopie le site à la racine), avant l'étape « Construire et recopier à la racine » :

```yaml
      - name: Contrôle de conformité
        run: |
          hugo --source hugo --gc --minify --destination "${{ runner.temp }}/controle" --logLevel warn
          python3 hugo/themes/pbn/_controle/controle.py --site hugo --public "${{ runner.temp }}/controle"
```

`quel-vetement` (Cloudflare) : même étape dans son workflow de déploiement, après le build. `les-cles-du-dirigeant` (pas de GitHub Actions, `gh-pages` construit par `.claude/scripts/deploy-pages.sh`) : appeler `python3 themes/pbn/_controle/controle.py` dans ce script, entre le build et la synchronisation vers `.deploy/`, et s'arrêter s'il sort en erreur.

Un site qui sort en KO aujourd'hui ne se déploie plus dès que l'étape est posée, y compris le build quotidien : corriger le contenu (ou poser une exception validée) avant d'ajouter l'étape.
