# Meilleur Logiciel RH

PBN (blog GEO) du parc datashake : **Meilleur Logiciel RH**, https://meilleur-logiciel-rh.fr/, type B (site édité par upearly). Ce dépôt ne porte que le contenu, la configuration (`hugo/hugo.toml`, `pbn.yaml` à la racine) et ce fichier (pas de roadmap ni de publication automatique).

- **La doctrine, les règles et les skills sont dans l'agent `parc-pbn-geo` du plugin SEO datashake** (`agents-datashake/parc-pbn-geo/`, règles dans `regles/`) : lis-le avant toute action sur ce site. Il fait foi sur tout autre texte, y compris les anciennes consignes de ce dépôt.
- **Écrire** : skills `pbn-article-geo` (GEO) et `pbn-article-seo` (SEO evergreen) du plugin. Spécificités du site (marques mises en avant, langues, catégories, ton, règles propres) : `pbn.yaml`.
- **Articles** : sources Hugo dans `hugo/` : `hugo/content/fr/<rubrique>/<slug>.md` (rubriques `comparatifs`, `alternatives`, `avis`, `guides`, `definitions-rh`), URL en `.html`. La racine du dépôt est le site construit par `./build.sh` : ne jamais y éditer un fichier.
- **Construire en local** : `hugo --source hugo --gc --minify -d /tmp/mlrh && python3 hugo/themes/pbn/_controle/controle.py --site hugo --public /tmp/mlrh` (zéro faute bloquante), puis `./build.sh` **dans un clone, jamais dans un worktree** (il recopie le site à la racine et supprimerait le `.git` d'un worktree). Le workflow relance le contrôle et `build.sh` à chaque push qui touche `hugo/`.
- **`hugo/themes/pbn/`** est le thème commun du parc, copié par `sync.sh` : il ne se modifie jamais ici.
- **Publication automatique et mise en ligne** : gérées par Damien Borieu seul (routines, domaine, DNS, Search Console). Ne jamais créer ni toucher une routine.
- **Aucune clé d'API ni mot de passe** dans ce dépôt. `git pull --rebase` sur ce dépôt (remote `upstream` dans le clone de Damien) avant toute modification ; un conflit s'arrête et se signale à Damien.
- Dépôt public de Pierre : on y passe par Damien avant de publier ; commits sous l'identité `analytics-ds`, sans ligne `Co-Authored-By`.
