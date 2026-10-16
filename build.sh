#!/bin/bash
# Construit le site Hugo (dossier hugo/) et recopie la sortie à la racine du dépôt.
# Pourquoi : GitHub Pages sert ce dépôt en build « legacy » depuis la racine de la branche main, et la source Pages ne
# peut être changée que par le propriétaire du dépôt. La racine contient donc le site construit, à ne jamais éditer à la main.
# Usage : ./build.sh   (Hugo 0.165.0 extended ; le workflow .github/workflows/hugo.yml fait la même chose à chaque push)
set -euo pipefail
cd "$(dirname "$0")"
OUT="$(mktemp -d)"
trap 'rm -rf "$OUT"' EXIT
hugo --source hugo --gc --minify --destination "$OUT" --logLevel warn
[ -f "$OUT/index.html" ] && [ -f "$OUT/sitemap.xml" ] && [ -f "$OUT/CNAME" ] || { echo "build incomplet, rien n'est recopié"; exit 1; }
# Recopie à la racine, en supprimant les pages qui n'existent plus. Ce qui n'est pas produit par Hugo est protégé.
rsync -a --delete \
  --exclude='/.git/' --exclude='/.github/' --exclude='/.claude/' --exclude='/hugo/' --exclude='/scripts/' \
  --exclude='/build.sh' --exclude='/CLAUDE.md' --exclude='/README.md' --exclude='/.gitignore' --exclude='.DS_Store' \
  "$OUT"/ ./
echo "site construit et recopié à la racine ($(find "$OUT" -name '*.html' | wc -l | tr -d ' ') pages HTML)"
