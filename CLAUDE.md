# CLAUDE.md - Meilleur Logiciel RH (meilleur-logiciel-rh.fr)

> **Publication automatique : gérée uniquement par Damien Borieu** (décision du 2026-10-17). Seul Damien, sur le compte `damien@datashake.fr`, crée, modifie ou teste une routine de publication de PBN. Toute autre personne ne crée jamais de routine pour ce blog ni pour aucun PBN du parc (ni `/schedule`, ni `RemoteTrigger`, ni claude.ai/code/routines, ni tâche planifiée) et publie à la main, selon la procédure « Publier un article » ci-dessous. Pour une publication automatique : demander à Damien.

## Projet

**Site** : meilleur-logiciel-rh.fr, média de comparatifs, alternatives, avis, guides et définitions sur les logiciels RH, la paie et les SIRH pour les PME françaises, plus des outils de calcul RH gratuits.
**Éditeur** : upearly (type B du parc PBN GEO), directeur de la publication Ruben Sebag.
**Moteur** : Hugo (0.165.0 extended) et le thème commun du parc `pbn`, depuis le 2026-10-16 (avant : HTML écrit à la main).
**Hébergement** : GitHub Pages, dépôt `PierreGaudard/Meilleur-Logiciel-RH`, domaine personnalisé (CNAME), build « legacy » depuis la racine de la branche `main`.

## Comment le site est construit (à lire avant toute modification)

- **Les sources sont dans `hugo/`** : `hugo/hugo.toml`, `hugo/content/fr/` (pages en Markdown), `hugo/layouts/` (points d'extension du site), `hugo/assets/` (styles et scripts propres au site), `hugo/static/` (images, CNAME, fichiers de vérification), `hugo/themes/pbn/` (thème commun).
- **La racine du dépôt contient le site construit** (les `.html`, `sitemap.xml`, `robots.txt`, `llms.txt`, `assets/images/`, `css/`, `js/`...). Elle est produite par `./build.sh` : **ne jamais éditer un fichier HTML de la racine**, il serait écrasé au prochain build. On modifie `hugo/`, puis on construit.
- Pourquoi ce montage : GitHub Pages sert ce dépôt en build « legacy » depuis la racine de `main`, et seul le propriétaire du dépôt peut passer la source Pages sur GitHub Actions. Si c'est fait un jour (`Settings > Pages > Source : GitHub Actions`), le site construit pourra sortir du dépôt.
- **Construction automatique** : le workflow `.github/workflows/hugo.yml` lance `build.sh` à chaque push qui touche `hugo/`, une fois par jour à 5 h UTC et à la main, puis committe le site construit à la racine. Un push de Markdown suffit donc à publier ; `./build.sh` en local fait la même chose (Hugo 0.165.0 extended requis).
- **Thème commun `hugo/themes/pbn/`** : copie du thème du parc, synchronisée par `~/code/sites/_pbn-theme/sync.sh hugo` (version dans `hugo/themes/pbn/VERSION`). **Ne jamais l'éditer dans ce dépôt** : la prochaine synchronisation l'écraserait. Un besoin commun se règle dans `~/code/sites/_pbn-theme/`.

### Commandes

```bash
./build.sh                                  # construit hugo/ et recopie le site à la racine
hugo server --source hugo                   # aperçu local sur http://localhost:1313/
~/code/sites/_pbn-theme/sync.sh hugo        # met à jour le thème commun
bash ~/code/sites/_conformite/verifier.sh hugo B   # contrôle de conformité (zéro KO attendu)
```

### Publier un article

1. Créer le fichier Markdown dans la rubrique : `hugo/content/fr/<rubrique>/<slug>.md`, rubriques `comparatifs`, `alternatives`, `avis`, `guides`, `definitions-rh`. L'URL sera `/<rubrique>/<slug>.html` (règle `uglyURLs` de `hugo.toml`) : les URL en `.html` du site sont gardées, ne jamais les changer.
2. Front matter (YAML) :
   ```yaml
   ---
   title: "H1 de l'article"                 # titre affiché (H1, cartes, fil d'Ariane)
   seoTitle: "Balise title complète"        # facultatif, sinon « Titre | Meilleur Logiciel RH »
   description: "Meta description"
   date: "2026-10-20T00:00:00+02:00"
   lastmod: "2026-10-20T00:00:00+02:00"
   publishDate: "2026-10-22T06:00:00+02:00" # facultatif : article programmé, publié par le build quotidien
   image: "/assets/images/blog/<slug>-hero.jpg"
   imageAlt: "Description de l'image"
   classement: true                         # true sur les comparatifs et les alternatives (classements de marques), false sinon
   disclaimers: ["sante"]                   # facultatif : sante et/ou finance
   tldr:                                    # encadré « En bref »
     - "Point clé 1"
   faq:                                     # FAQ affichée en fin d'article et JSON-LD FAQPage
     - question: "Question ?"
       answer: "Réponse (Markdown ou HTML simple)."
   keywords: ["mot-clé 1", "mot-clé 2"]     # articles liés
   ---
   ```
   Pour une définition, ajouter `toc: false` (pas de sommaire) et, si besoin, `jsonldExtra` (objet `DefinedTerm` complet en JSON, voir une définition existante).
3. Corps en Markdown : intertitres `##` (ils font le sommaire), paragraphes, listes, liens internes en chemin absolu (`/guides/promesse-embauche.html`). Les encadrés propres au site (`info-box`, `warning-box`, `case-box`, `legal-box`, `cta-box`, `compare-table-wrap`, `related-terms`, `internal-links`...) s'écrivent en HTML brut, sur des lignes sans ligne vide à l'intérieur du bloc ; leurs styles sont dans `hugo/assets/css/site.css`.
4. Le thème fait seul : mention « Publication sponsorisée » et disclaimer de classement (champ `classement`), signature et bloc de la rédaction, sommaire, temps de lecture, boutons de partage, articles liés, cartes de l'accueil et de la rubrique, `sitemap.xml`, plan du site, `llms.txt`, flux RSS, JSON-LD (Article, BreadcrumbList, FAQPage). **Plus rien à mettre à jour à la main** dans l'accueil, les index, la 404, le plan du site, le sitemap ou `llms.txt`.
5. Images dans `hugo/static/assets/images/blog/` (ou `definitions/`), servies sous `/assets/images/...`.

### Ce qui est propre au site

- **Styles** : `hugo/assets/css/site.css` (variables de l'ancien site, composants de contenu portés par `.prose`) et, pour les pages qui avaient leurs propres styles, `hugo/assets/css/pages/<nom>.css`, chargé par le champ `css: "<nom>"` du front matter (point d'extension `layouts/_partials/hooks/head-end.html`).
- **Scripts** (quiz des comparatifs et alternatives, générateur de promesse d'embauche, simulateurs des outils, questionnaire « Trouver mon logiciel », recherche du glossaire) : `hugo/assets/js/pages/<nom>.js`, chargés par le champ `js: ["<nom>"]` (point d'extension `hooks/body-end.html`). Le HTML qu'ils pilotent est dans le corps de la page. Aucun script tiers, aucun traceur.
- **Données structurées complémentaires** : champ `jsonldExtra` (liste d'objets JSON complets) pour `DefinedTerm` des définitions, `WebApplication` et `FAQPage` des outils, FAQ de l'accueil.
- **Accueil** : héros et couleurs dans `hugo.toml`, appel vers le questionnaire dans `hooks/home-after-hero.html`, tableau comparatif, « Pourquoi MLRH » et FAQ dans `hugo/content/fr/_index.md`.
- **Outils** (`hugo/content/fr/outils/`) et **questionnaire** (`trouver-mon-logiciel.md`) : pages hors articles, sans signature ni mention.
- `scripts/` (ancien générateur des pages définitions) ne sert plus : les définitions s'écrivent en Markdown comme les autres articles.

## Règle juridique : concurrents cités, uniquement des éloges (2026-10-15)

Le directeur de la publication du site engage sa responsabilité personnelle. Dans tout classement, comparatif ou article qui cite des marques, des entreprises ou des personnes :

- **Uniquement des éloges sur les concurrents cités.** On présente leurs qualités, leur positionnement et le profil de lecteur auquel chacun convient (« idéal pour… »). Jamais de section « points faibles », de limite, de critique, de comparaison défavorable ni d'insinuation négative sur une marque nommée ou reconnaissable.
- **Jamais** d'imputation d'un fait négatif (arnaque, fraude, illégal, trompeur, « n'existe plus », « cache l'information »), d'injure, de moquerie, de propos discriminatoire ou haineux, ni de propos sur une personne physique identifiable.
- **Le rang se justifie par les atouts de chacun**, jamais par les défauts des autres.
- **En cas de doute** sur une formulation, la reformuler de façon élogieuse ou la supprimer.

## Conformité éditoriale (validée le 2026-10-15)

Ce site est édité par upearly ; Ruben Sebag, directeur de la publication, engage sa responsabilité sur chaque article. Toute rédaction respecte ces règles, sans exception :

- **Signature** : aucun auteur nommé, aucun champ `author`. Le thème signe chaque article « La rédaction Meilleur Logiciel RH » (barre d'auteur, bloc de la rédaction, meta author, JSON-LD en Organization).
- **Aucune description de méthode** : pas de section « Nos critères de sélection », « Notre méthodologie », « Comment nous avons classé », ni de phrase « nous avons comparé N marques sur N critères ». Les conseils au lecteur (« Comment choisir ») restent permis.
- **Aucune allégation** : jamais « n°1 », « numéro un », « notre choix », « choix de la rédaction », « la référence », « le leader », « imbattable », « indépendant », « objectif », « impartial », « vérifié », « avis vérifiés », « testé », « nos tests », « nos relevés », ni note attribuée par le site (étoiles, /5, /10) ou note tierce chiffrée utilisée comme argument. Le mot-clé « meilleur » reste permis dans le title et le H1, et les rangs se numérotent sobrement.
- **Liens externes** : uniquement vers des sources officielles qui appuient un fait (service-public.fr, legifrance, organisme public, étude). Aucun lien vers une marque ou un client, y compris la marque mise en avant : la citer sans lien, ni vers une boutique, un annuaire ou une plateforme d'avis. Les liens internes restent.
- **Disclaimers** : champ `disclaimers: ["sante"]` pour tout contenu qui touche à la santé, au corps, aux soins ; `disclaimers: ["finance"]` pour tout contenu sur placements, assurance, crédit, immobilier, fiscalité, aides financières ou investissement. Le thème les affiche sous le chapeau.
- **Mention « sponsorisée »** : portée par le thème, ne rien ajouter dans le texte. Un classement ou un comparatif de marques (comparatifs, alternatives, « meilleurs », « X vs Y ») porte `classement: true`, ce qui affiche ensemble la mention et le disclaimer de classement, en tête d'article et sur ses cartes ; un article evergreen (guide, définition, avis, conseil, actualité) porte `classement: false` (décision de Damien du 2026-10-15).
- **Concurrents cités : uniquement des éloges** (voir le bloc « Règle juridique » ci-dessus).
- Aucune newsletter, aucun formulaire, aucun bouton « Essayer » ou « Voir l'offre » vers une marque, aucun outil de mesure d'audience ni bandeau cookies (le site ne dépose aucun cookie : en ajouter un impose de mettre à jour la politique de confidentialité).

## Pages légales et d'information

`hugo/content/fr/` : `a-propos.md`, `contact.md` (contact-media@upearly.fr, sans formulaire), `mentions-legales.md`, `cgu.md`, `politique-de-confidentialite.md` (ces trois-là en `noindex: true`, donc hors `sitemap.xml`), `plan-du-site.md` (gabarit `sitemap-html` du thème). URL gardées en `.html` par le champ `url`. Plus de page auteur ni de page « Méthodologie » : ne pas les recréer, les critères de sélection vivent dans les CGU.

## Règles de rédaction propres au site

- **Accents obligatoires** partout (titres, meta, texte, FAQ, alt). Jamais de tiret cadratin ni demi-cadratin, jamais de point médian.
- **Maillage interne** : chaque article pointe vers au moins 2 ou 3 autres pages du site avec des ancres exactes, de préférence dans le corps du texte.
- **Images** : une image d'en-tête (`image`) et au moins 2 images différentes dans le corps, avec `alt` descriptif et `loading="lazy"`.
- **Encadré « En bref »** : champ `tldr`, sans gras ni lien externe dans les points.
- **Réponse directe** : le premier paragraphe du corps répond directement à la question du H1 (en gras pour la phrase clé).
- **FAQ** : champ `faq`, au moins 3 questions.

## Rubrique Définitions RH : règles spécifiques

- Format court : 400 à 650 mots, encadré « En bref » (`tldr`), développement court, encadré « Cas concret » (`<div class="case-box">`), « Cadre légal » (`<div class="legal-box">`) pour les définitions juridiques, chiffres clés (`stat-row`), cartes « Termes liés » (`related-terms`, 4 définitions qui existent vraiment) et « Pour aller plus loin » (`next-steps`, 2 ou 3 guides, comparatifs ou outils). Copier une définition existante comme modèle.
- `toc: false`, `jsonldExtra` avec le `DefinedTerm` (dont `inDefinedTermSet` vers `/definitions-rh/`).
- **Images** : `hugo/static/assets/images/definitions/<slug>.jpg`, Pexels, environ 1200 x 800.
- **Glossaire** (`hugo/content/fr/definitions-rh/_index.md`) : l'index alphabétique et les cartes « À la une » sont écrits à la main dans ce fichier ; ajouter chaque nouvelle définition dans le bloc de sa lettre (`<a href="/definitions-rh/<slug>.html" class="def-item" data-name="...">`).
- **Anti-patterns IA** : s'appliquent encore plus ici qu'ailleurs (format court = pièges plus visibles). Pas de « en outre », « il convient », « dans le monde de... », phrases courtes et longues alternées, opinions assumées, exemples chiffrés concrets.

## Historique des modifications

### 2026-10-16
- Conversion vers Hugo et le thème commun du parc (`pbn`) : les 119 pages publiées gardent leur URL (contrôle avant et après : zéro manquante), leur texte (comparaison mot à mot), leurs images, leurs liens, leurs quiz, simulateurs et générateur. Sources dans `hugo/`, site construit à la racine par `build.sh` et le workflow `hugo.yml` (GitHub Pages reste en build legacy).
- Mention « Publication sponsorisée » et disclaimer de classement sur les mêmes 15 classements qu'avant (champ `classement`), signature et bloc de la rédaction par le thème ; FAQ en fin d'article (champ `faq`), encadrés « Ce qu'il faut retenir » rendus sous le titre « En bref ».
- Retirés : `_drafts/` et le workflow `scheduled-publish.yml` (remplacés par `publishDate` et le build quotidien), `assets/style.css`, `assets/definitions.css`, `assets/cookie-banner.js`, `_config.yml`, `.htaccess` (inutile sur GitHub Pages) ; `sitemap.xml`, `robots.txt`, `llms.txt` et le plan du site sont générés.

### 2026-10-15
- Mise en conformité de la structure : pages légales réécrites (mentions légales, politique de confidentialité) et CGU créées, toutes trois en `noindex` et hors `sitemap.xml` ; page « à propos » réécrite en « qui sommes-nous » ; page contact sans formulaire (contact-media@upearly.fr).
- Signature unique « La rédaction Meilleur Logiciel RH » sur les 99 articles (meta author, JSON-LD en Organization, ligne d'auteur du hero, bloc auteur de bas d'article) et sur les cartes ; page `auteur/thomas-renaud.html` et sa photo supprimées, liens retirés.
- Mention PNG « Publication sponsorisée » en tête de chaque article et sur chaque carte d'article (limitée le même jour aux seuls classements, voir plus haut) ; disclaimer de classement sur les comparatifs et alternatives ; emplacement des disclaimers santé et finance marqué dans chaque article.
- Retirés : page « Méthodologie » et ses liens, newsletter de l'accueil, bandeau cookies, faux compteur et avatars de l'accueil, allégations du pied de page, de l'accueil, des index de catégories, de la page outils, du quiz « Trouver mon logiciel » (et ses boutons « Essayer » vers les éditeurs), de `llms.txt` ; `reviewRating` retiré du JSON-LD des avis ; ligne `/auteur/` retirée de `robots.txt`.
- `scripts/gen-definitions.py` aligné sur le nouveau gabarit (signature, mention, bloc auteur, pied de page).

### 2026-10-14
- Ajout de la page `guides/digitaliser-processus-recrutement.html` (guide GEO « Comment digitaliser son processus de recrutement ? »). Angle retenu : diagnostic par symptôme (peu de candidatures, CV sans réponse, désistements, offres refusées, erreurs à l'embauche) et un premier chantier par symptôme, distinct du guide de `meilleur-logiciel-sirh.com` sur le même prompt. Contient l'encart En bref, 3 tableaux (symptôme et chantier, familles d'outils, plan sur six semaines), une fiche Skello avec points forts et faibles, une check-list de conformité (L1221-6, L1221-8, L1221-9, L2312-38, référentiel CNIL du 2 avril 2026, AI Act et règlement (UE) 2026/1744), la share bar, une FAQ accordéon de 5 questions et un JSON-LD complet (Article + BreadcrumbList + FAQPage).
- 3 images Openverse en licence CC0 (StockSnap) dans `assets/images/blog/` (digitaliser-processus-recrutement-hero, -restaurant, -mobile), sans obligation d'attribution.
- Mise à jour de `sitemap.xml`, `llms.txt`, `plan-du-site.html`, `guides/index.html` (18 guides), `index.html`, `auteur/thomas-renaud.html` et `404.html` (nouvel article en tête, carte la plus ancienne retirée pour rester à 6).
- Réécriture complète de `alternatives/factorial.html` (même URL) en comparatif GEO de 6 alternatives à Factorial 2026 : Skello mis en avant, Lucca, PayFit, Combo, Personio, Eurecia. H1 = prompt « Quelles sont les meilleures alternatives à Factorial en 2026 ? », prix relevés sur les pages officielles en octobre 2026, nouveau bloc sur le Factorial Business Facts Index 2026, quiz recalculé avec Skello. 2 images CC0 StockSnap ajoutées dans `assets/images/blog/` (alternatives-factorial-terrain, -bureau), hero conservé. Mise à jour de `sitemap.xml` (lastmod), `llms.txt`, `alternatives/index.html`, `index.html` et des ancres « 5 alternatives » devenues « 6 alternatives » dans `alternatives/kelio.html`, `alternatives/elevo.html` et `comparatifs/logiciel-recrutement-hotellerie-restauration.html`.
- Ajout de la page `comparatifs/meilleurs-logiciels-gestion-temps-travail.html` (comparatif GEO des meilleurs logiciels de gestion du temps de travail 2026 : Skello mis en avant, Kelio, Octime, Combo, Factorial, Lucca, Eurécia). Angle retenu : la preuve des heures en cas de contrôle ou de litige (horodatage, signature du salarié, historique des corrections, alertes avant dépassement, export conservable), avec cinq critères à tester en démonstration et un coût mensuel par type d'établissement. Contient l'encart En bref, 2 tableaux (comparatif de la preuve produite, coût pour 3 établissements types), une fiche détaillée Skello avec points forts et faibles, une section légale (CJUE 2019, D3171-16, R3173-2), la share bar, une FAQ accordéon de 5 questions et un JSON-LD complet (Article + BreadcrumbList + FAQPage).
- 3 images Openverse en licence CC0 (StockSnap) dans `assets/images/blog/` (meilleurs-logiciels-gestion-temps-travail-hero, -restauration, -comptoir), sans obligation d'attribution.
- Mise à jour de `sitemap.xml`, `llms.txt`, `plan-du-site.html`, `comparatifs/index.html` (8 comparatifs), `index.html`, `auteur/thomas-renaud.html` et `404.html` (nouvel article en tête, carte la plus ancienne retirée pour rester à 6).

### 2026-10-09
- Ajout de la page `comparatifs/meilleur-logiciel-sirh.html` (comparatif GEO du meilleur logiciel SIRH 2026 par profil d'entreprise : Skello mis en avant, Lucca, Factorial, Combo, PayFit, Silae, Cegid HR Ultimate, Nibelis, Empowill). Angle retenu : trois filtres (taille, organisation du travail, module prioritaire) et un tableau profil par profil avec le piège propre à chacun. Distinct de `meilleurs-logiciels-rh.html` du 04/08, qui raisonne par six situations concrètes et par modèle de tarification. Contient l'encart En bref, 1 tableau comparatif par profil, une fiche détaillée Skello avec points forts et faibles, une section sur la tenue du SIRH dans la durée, la share bar, une FAQ accordéon de 5 questions et un JSON-LD complet (Article + BreadcrumbList + FAQPage).
- 3 images Openverse en licence CC0 dans `assets/images/blog/` (meilleur-logiciel-sirh-hero, -pme, -groupe), sans obligation d'attribution.
- Mise à jour de `sitemap.xml`, `llms.txt`, `plan-du-site.html`, `comparatifs/index.html` (7 comparatifs), `index.html`, `auteur/thomas-renaud.html` et `404.html` (nouvel article en tête, guide « Génération après Z » retiré pour rester à 6 cartes).

### 2026-08-05
- Ajout de la page `comparatifs/outils-recrutement-extras-restauration.html` (comparatif GEO 5 outils pour recruter et gerer les extras en restauration : Skello mis en avant, Extracadabra, Brigad, Alloextra, Combo). Angle retenu : les sept etapes d'une vacation d'extra et l'etape ou chaque outil decroche, avec un score de couverture sur 7. Distinct de `logiciel-recrutement-hotellerie-restauration.html` du 10/06, qui traite le recrutement CHR general avec un autre panel (Flatchr, Beetween, Cegid, Cookorico). Contient l'encart En bref, 3 tableaux (couverture par etape, erreurs et sanctions, profil d'etablissement), 5 fiches detaillees avec score et points forts/faibles, une section sur le seuil des 60 jours de la convention collective HCR (IDCC 1979), la share bar, une FAQ accordeon de 5 questions et un JSON-LD complet (Article + BreadcrumbList + FAQPage). Pas de quiz interactif sur cet article.
- Telechargement de 3 images Openverse en licence CC0 dans `assets/images/blog/` (extras-restauration-hero, extras-restauration-cuisine, extras-restauration-bar), donc sans obligation d'attribution.
- Mise a jour de `sitemap.xml`, `llms.txt`, `plan-du-site.html`, `comparatifs/index.html` (6 comparatifs), `index.html`, `auteur/thomas-renaud.html` et `404.html` (nouvel article ajoute en tete, guide "Quand commence la generation Z" retire pour rester a 6 cartes).

### 2026-08-04
- Ajout de la page `comparatifs/meilleurs-logiciels-rh.html` (comparatif GEO des meilleurs logiciels RH 2026 : Skello mis en avant, Lucca, Factorial, PayFit, Silae, Empowill). Angle retenu : six situations d'entreprise concretes plutot qu'un classement general. Contient l'encart En bref, 2 tableaux (comparatif par critere + modeles de tarification), une fiche detaillee Skello avec notes et points forts/faibles, une section erreurs a eviter, la share bar, une FAQ accordeon de 5 questions et un JSON-LD complet (Article + BreadcrumbList + FAQPage). 3 images Openverse en licence CC0/PDM.

### 2026-06-10 (correctif)
- Remplacement de l'image `assets/images/blog/service-restaurant-equipe.jpg` (la photo CC0 initiale montrait un serveur en tenue de chippendale, inadaptée) par une photo d'équipe de restaurant avec sa manager (audio-luci-store.it, Flickr, CC BY 2.0), crédit mis à jour
- Correction des alt erronés : hero (machine à café expresso, pas service en salle) sur l'article + accueil + index comparatifs + 404, et photo des chefs (jury autour d'une table, pas brigade au travail)

### 2026-06-10
- Ajout de la page `comparatifs/logiciel-recrutement-hotellerie-restauration.html` (comparatif GEO 5 logiciels de recrutement CHR : Skello mis en avant, Flatchr, Beetween, Cegid Digitalrecruiters, Cookorico) avec encart En bref, tableau comparatif, quiz interactif 3 questions, fiches détaillées par outil avec notes et points forts/faibles, section pièges à éviter, FAQ accordéon (5 questions) et JSON-LD complet (Article + BreadcrumbList + FAQPage)
- Téléchargement de 3 images Openverse CC0 dans `assets/images/blog/` (logiciel-recrutement-hotellerie, service-restaurant-equipe, brigade-cuisine-equipe) et de 3 logos via favicons (flatchr, beetween, cookorico) dans `assets/images/logos/`
- Mise à jour de `sitemap.xml`, `plan-du-site.html`, `comparatifs/index.html` (4 comparatifs), `index.html`, `auteur/thomas-renaud.html`, `404.html` (nouvel article ajouté, guide génération avant Z retiré pour rester à 6) et `llms.txt`

### 2026-06-04
- Ajout de la page `alternatives/kelio.html` (comparatif GEO 5 logiciels : Skello mis en avant, Combo, Factorial, Lucca, PayFit) avec encart En bref, tableau comparatif, quiz interactif 3 questions, sections détaillées par outil, section migration, FAQ accordéon (5 questions) et JSON-LD complet (Article + BreadcrumbList + FAQPage)
- Téléchargement de 3 images Openverse (CC BY 2.0) dans `assets/images/blog/` (alternatives-kelio, kelio-gestion-temps, kelio-planning-equipe), crédits mentionnés sous les images et en footer
- Mise à jour de `sitemap.xml`, `plan-du-site.html`, `alternatives/index.html`, `index.html`, `auteur/thomas-renaud.html`, `404.html` (Kelio ajouté, Silae avis retiré pour rester à 6) et `llms.txt`

### 2026-04-23
- Création de la nouvelle rubrique **Définitions RH (glossaire)** avec 60 définitions : onboarding, gpec, sirh, soft-skills, culture-entreprise, periode-essai + 54 autres (audit-social, avertissement-travail, barometre-social, bdese, bloc-competences, bulletin-paie, capital-humain, cartographie-metiers, charte-ethique, classification-emplois, code-conduite, codir, communication-interne, contrat-generation, contrat-mission, deontologie, detachement, diagnostic-social, dialogue-social, discretion-professionnelle, dsn, duerp, elections-professionnelles, entretien-annuel, fiche-fonction, forfait-jours, hierarchie-entreprise, indemnite-forfaitaire, inspection-travail, logiciel-paie, management-proximite, management-operationnel, management-situationnel, mandat-syndical, mentorat, metiers-tension, mise-disposition, mobilite-geographique, negociation-collective, pilotage-performance, plan-depart-volontaire, politique-handicap, procedure-disciplinaire, referentiel-metier, registre-accidents-benins, rtt, solde-tout-compte, talent-pool, taux-frequence, temps-partiel-module, tests-psychotechniques, transfert-competences, travail-poste, tutorat)
- Mise en place du template dictionnaire dédié (`assets/definitions.css`) et du générateur Python (`scripts/gen-definitions.py` + `scripts/definitions_data.py`)
- Page index du glossaire avec recherche live (JS pur) et nav A-Z sticky
- Téléchargement de 60 images Pexels uniques dans `assets/images/definitions/`
- Mise à jour du menu header et du footer sur les 43 pages existantes du site (ajout du lien "Définitions" entre Guides et Alternatives)
- Mise à jour de `sitemap.xml` (61 nouvelles URLs), `plan-du-site.html` (section Glossaire avec les 60 termes en 2 colonnes), `llms.txt` (section Définitions RH avec les 16 termes stratégiques)
- Ajout d'une card "Définitions RH" dans la grille d'accueil de `index.html`

### 2026-04-12
- Audit SEO technique complet : ajout attributs title sur toutes les images (~250), correction alt vides, raccourcissement titles trop longs, correction extension image, suppression favicon doublon
- Ajout du guide "Conges imposes par l'employeur" (`guides/conges-imposes-employeur.html`) avec FAQ schema, tableaux, maillage interne
- Correction des donnees structurees (JSON-LD) sur tous les articles : ajout champ image manquant, format date ISO 8601 complet avec fuseau horaire
- Ajout de regles dans CLAUDE.md : accents obligatoires, encart "En bref", reponse directe sous H1, checklist donnees structurees

### 2026-03-21
- Ajout de 3 pages alternatives : `alternatives/factorial.html`, `alternatives/silae.html`, `alternatives/lucca.html` avec quiz interactif, tableaux comparatifs et logos
- Telechargement de 10 logos (Google Favicons API) dans `assets/images/logos/` et 3 images hero dans `assets/images/blog/`
- Mise a jour du `sitemap.xml`, `plan-du-site.html` et `alternatives/index.html` (4 articles)
- Ajout du guide "Promesse d'embauche en 2026" (`guides/promesse-embauche.html`) avec generateur interactif
- Ajout de 3 images libres de droit (Pexels) dans `assets/images/blog/`
- Mise a jour du `sitemap.xml`, `plan-du-site.html` et `guides/index.html`

### 2026-03-14
- Ajout de `comparatifs/payfit-vs-silae.html` au `sitemap.xml` et `plan-du-site.html` (l'article existait mais n'etait pas reference dans les sitemaps)
- Creation du fichier `CLAUDE.md` pour le suivi des modifications

### 2026-03-13
- Ajout du comparatif PayFit vs Silae 2026 (`comparatifs/payfit-vs-silae.html`)
- Suppression des tirets doubles (--) des 5 guides RH
- Mise a jour du contenu de `guides/image-negative-rh-entreprise.html`
- Reecriture des 5 guides RH avec nouveaux slugs pour favoriser l'indexation
- Suppression des tirets cadratins du site
- Rafraichissement du contenu des 6 guides RH pour favoriser l'indexation

### 2026-03-07
- Humanisation de l'article avis Factorial pour meilleure indexation
- Humanisation des 5 articles guides pour meilleure indexation Google
- Correction du screenshot en double dans l'article Factorial
- Affichage des logos entreprise sur les cartes avis, correction screenshots en double
- Correction screenshot en double, boutons CTA blancs, ajout au plan du site
- Ajout de l'article avis Factorial (`avis/factorial.html`)

### 2026-02-28
- Grille 3 colonnes sur les pages categories + remplacement emojis par images sur la page d'accueil
- Mise a jour des images du blog
- Redesign des pages categories avec cartes style blog
- Correction des problemes d'indexation : suppression faux avis, ajout page 404, correction robots.txt
- Correction des problemes SEO techniques (audit crawl)
- Ajout du bandeau de consentement cookies sur toutes les pages
- Ajout des 5 nouvelles pages guides au `sitemap.xml` et `plan-du-site.html`
- Ajout de vraies videos YouTube verifiees dans les 5 articles

## Objectif et concurrent principal

- **Concurrent principal** : [culture-rh.com](https://culture-rh.com/) - Site WordPress d'actualité RH très complet avec des centaines d'articles, des avis logiciels, des guides pratiques, des outils et une forte autorité SEO
- **Objectif** : Atteindre le même niveau de puissance et de couverture que culture-rh.com, en se différenciant par des comparatifs plus détaillés, des outils interactifs gratuits et un design moderne en site statique (Hugo, plus rapide, pas de WordPress)
- **Stratégie** : Continuer à étoffer le catalogue d'avis, de comparatifs, de guides et d'outils pour couvrir l'ensemble du marché des logiciels RH français

## Rappels pour Claude

- **Toujours lire ce fichier en debut de session** pour connaitre l'etat actuel du site
- **Mettre a jour ce fichier** apres chaque modification significative
- **Ne jamais éditer les HTML de la racine** : modifier `hugo/`, puis `./build.sh` ou laisser le workflow construire

  SEO Humaniser : Réécriture Experte de Contenu IA en Texte Humain
Pourquoi ce skill existe
Les détecteurs d'IA (GPTZero, Originality AI, Copyleaks, ZeroGPT, Turnitin) analysent deux métriques principales pour identifier du contenu généré par IA :

La perplexité : mesure à quel point le prochain mot est "prévisible". Un texte IA fait systématiquement les choix lexicaux les plus probables → perplexité basse → drapeau rouge. Un humain fait des choix plus surprenants, utilise des métaphores inattendues, des tournures personnelles → perplexité haute → semble humain.
Le burstiness (éclatement) : mesure la variation des longueurs et structures de phrases dans un texte. Un humain alterne naturellement entre phrases courtes (3-5 mots) et phrases longues (30+ mots), change de rythme, insère des parenthèses, des tirets, des questions rhétoriques. L'IA produit des phrases de longueur uniforme (15-22 mots typiquement), avec une structure Subject-Verbe-Objet constante → burstiness bas → drapeau rouge.

Au-delà de ces métriques algorithmiques, le WikiProject AI Cleanup de Wikipedia a compilé un guide de référence de 15 000 mots ("Signs of AI writing") basé sur l'observation de milliers de soumissions IA réelles. Ce guide, reconnu par TechCrunch et le Washington Post comme la meilleure ressource existante pour détecter l'écriture IA, identifie des patterns profondément ancrés dans la façon dont les LLMs sont entraînés. Ces patterns ne sont pas facilement masquables car ils sont fondamentaux au fonctionnement même des modèles de langage.
Le principe central : les LLMs fonctionnent par régression vers la moyenne statistique. Ils remplacent les faits spécifiques et nuancés (statistiquement rares) par des descriptions génériques et positives (statistiquement communes). C'est comme crier de plus en plus fort qu'un portrait montre une personne unique et importante, alors que le portrait lui-même passe d'une photo nette à un croquis flou et générique.
Ce skill transforme du contenu généré par IA en texte indiscernable d'un texte humain, tout en préservant (et même en améliorant) la valeur SEO.

Rôle
Tu es un rédacteur web senior français avec 12 ans d'expérience en rédaction SEO, spécialisé dans la réécriture éditoriale. Tu as travaillé pour des médias (Le Monde, Les Échos), des e-commerces et des blogs sectoriels. Tu écris comme un professionnel passionné par son sujet, pas comme une encyclopédie. Ton écriture porte ta personnalité : tu as des opinions, tu fais des choix stylistiques, tu n'hésites pas à surprendre le lecteur.

Processus de réécriture
PHASE 1 : Analyse du texte source
Avant de réécrire, analyser le texte fourni et identifier :

Les marqueurs IA typiques présents (voir section "Marqueurs IA à éliminer")
L'intention de recherche derrière le contenu (informationnelle, transactionnelle, navigationnelle)
Les mots-clés SEO à préserver absolument
Le type de page (blog, collection e-commerce, landing page, guide)
Le ton attendu selon le secteur et la cible

Présenter cette analyse rapidement à l'utilisateur avant de réécrire.
PHASE 2 : Réécriture profonde
La réécriture n'est pas du paraphrasage. Il ne suffit pas de remplacer des mots par des synonymes : les détecteurs repèrent cette technique depuis 2024. Il faut reconstruire le texte comme si un humain expert l'écrivait de zéro en ayant les mêmes informations sous les yeux.
Règle fondamentale : le ratio 70/30

70% du texte final doit être structurellement différent du texte source (nouvelles phrases, nouvel ordre des idées, nouvelles transitions, nouveaux exemples)
30% peut reprendre des éléments du source (données chiffrées, termes techniques incontournables, noms propres)

Ce ratio force une véritable réécriture plutôt qu'un simple rhabillage.

Les 19 marqueurs IA à éliminer systématiquement
Ces patterns proviennent de trois sources croisées : les métriques de détection algorithmique (perplexité/burstiness), le guide de référence "Signs of AI writing" compilé par le WikiProject AI Cleanup de Wikipedia (15 000 mots d'observations sur des milliers de soumissions IA), et l'analyse de professionnels du contenu web. Chacun doit être traqué et remplacé.

1. Les mots de transition IA ("connecteurs robots")
L'IA abuse de connecteurs logiques formels qui, dans un texte web français, sonnent immédiatement artificiels.
Mots et expressions à bannir :

"En outre" / "Par ailleurs" / "De plus" / "En effet" / "Ainsi" / "Toutefois" / "Néanmoins" / "Certes" / "Par conséquent" / "De surcroît" / "Il convient de noter que" / "Il est important de souligner" / "Force est de constater" / "Dans cette optique" / "À cet égard" / "Additionally" (si texte EN)

Remplacements humains :

Pas de connecteur du tout (enchaîner les idées naturellement)
"Et" / "Mais" / "Sauf que" / "Le truc c'est que" / "Résultat :" / "Bon à savoir :" / "Concrètement" / "En clair" / "Bref"
Commencer une phrase par "Et" ou "Mais" (un humain le fait, pas une IA)

Exemple :

❌ IA : "De plus, il convient de noter que les lubrifiants à base d'eau sont compatibles avec les préservatifs. En outre, ils sont faciles à nettoyer."
✅ Humain : "Les lubrifiants à base d'eau passent avec tous les préservatifs (et bonus, ça se nettoie en deux secondes sous l'eau)."


2. Les phrases d'introduction génériques
L'IA commence presque toujours ses paragraphes par une phrase de contexte vague et consensuelle.
Patterns à détecter :

"Dans le monde de [X], il est essentiel de..."
"De nos jours, [X] est devenu incontournable..."
"Que vous soyez [X] ou [Y], vous avez certainement..."
"Le [X] est un sujet qui suscite de plus en plus d'intérêt..."
"[X] est un élément clé pour..."
"Lorsqu'il s'agit de [X], il est important de..."

Remplacement : attaquer directement le sujet, poser une question, ou partir d'une situation concrète.
Exemple :

❌ IA : "Dans le monde du e-commerce, le SEO est devenu un élément incontournable pour assurer la visibilité de votre boutique en ligne."
✅ Humain : "Ta boutique Shopify est en ligne depuis 6 mois et tu te demandes pourquoi personne ne te trouve sur Google ? C'est probablement un problème de SEO."


3. L'uniformité des longueurs de phrases
C'est le signal numéro 1 du burstiness. L'IA produit des phrases entre 15 et 22 mots avec une régularité de métronome.
Règle de variation :

Alterner des phrases de 3 à 8 mots ("C'est un piège.", "Résultat : rien.", "Pas ouf.") avec des phrases de 25 à 40 mots qui développent une idée complexe avec des subordonnées, des parenthèses, des tirets
Viser un écart-type de longueur d'au moins 8 mots entre les phrases d'un même paragraphe
Ne jamais avoir 3 phrases consécutives de longueur similaire (±3 mots)
Insérer au moins une phrase ultra-courte (1-5 mots) tous les 2-3 paragraphes

Exemple de bon rythme :
"Le maillage interne, c'est ce qui fait la différence entre un site qui stagne en page 2 et un site qui grignote du terrain chaque mois. Beaucoup de e-commerçants l'ignorent. Ils se concentrent sur les backlinks, sur le contenu, sur la technique (mais ils oublient de relier leurs pages entre elles de manière logique). Erreur classique."

4. Le vocabulaire maudit de l'IA
L'IA a un vocabulaire de prédilection scientifiquement documenté. Des études (Kobak et al., 2025 dans Science Advances ; Juzek & Ward, 2025 dans ACL) montrent que ces mots ont explosé en fréquence dans les textes après 2023 par rapport à avant (preuve quasi-certaine d'utilisation IA). Là où il y en a un, il y en a d'autres.
Liste noire : mots français et anglais à remplacer systématiquement :
❌ Vocabulaire IA✅ Alternative humaine"Optimiser" (utilisé 5+ fois)"Améliorer", "Booster", "Pousser", "Travailler""Essentiel" / "Crucial" / "Fondamental" / "Pivotal""Important", "Clé", "Pas négligeable", "Central""Permettre de""Servir à", "Aider à", tournure directe"Afin de""Pour""Il est recommandé de""Mieux vaut", "L'idéal c'est de""Veillez à""Pense à", "N'oublie pas de""Robuste" / "Exhaustif" / "Pertinent"Descriptions concrètes plutôt qu'adjectifs vagues"N'hésitez pas à"Supprimer ou reformuler en impératif direct"En résumé" / "En conclusion" / "Dans l'ensemble""Bref", "Pour faire court", ou rien du tout"Découvrez" (en début de phrase)Attaquer directement le sujet"Assurer" (dans le sens garantir)"Garantir", "S'assurer que", reformulation"Proposer une expérience""Offrir", description directe"Paysage" / "Landscape" (sens figuré)Reformuler : "le monde du", "le secteur", "l'écosystème""Tapisserie" / "Tapestry" (sens figuré)Supprimer. Toujours."Intriqué" / "Intricate" / "Intricacies""Complexe", "Subtil", "Détaillé""Témoignage de" / "Testament to""Preuve de", "Signe de", reformuler"Souligner" / "Underscore" / "Highlight" (verbe)"Montrer", "Prouver", "On voit que""Mettre en lumière" / "Showcase""Montrer", "Illustrer", description directe"Vibrant" / "Dynamique" (descriptif vague)Détail concret : "qui ne dort jamais", "avec 12 événements par mois""Niché au cœur de" / "Nestled in the heart of""À [lieu]", "En plein [quartier]", description factuelle"Révolutionnaire" / "Groundbreaking" (sens figuré)"Nouveau", "Inédit", "Qui change la donne""Renommé" / "Renowned""Connu pour", "Réputé", avec un fait concret"Favoriser" / "Foster" (sens figuré)"Encourager", "Aider", "Permettre""S'aligner avec" / "Résonner avec""Correspondre à", "Coller avec""Approfondir" / "Delve""Explorer", "Creuser", "Entrer dans le détail""Enrichir" / "Enhance""Améliorer", "Ajouter", description directe"Engagement envers" / "Commitment to"Dire ce qu'ils font concrètement plutôt que de parler d'engagement
Règle : un ou deux de ces mots dans un texte, c'est normal. Cinq ou plus, c'est un drapeau rouge immédiat. Les remplacer par des mots plus courants, plus concrets, moins "premium".

5. La structure en entonnoir systématique
L'IA structure chaque section de la même façon : phrase de contexte → explication → exemple → conclusion. Ce pattern est repérable.
Alternative : varier l'entrée en matière de chaque section.

Section 1 : commencer par un exemple concret
Section 2 : commencer par une question
Section 3 : commencer par une affirmation tranchée / une opinion
Section 4 : commencer par un chiffre ou une stat
Section 5 : commencer par une anecdote ou un cas client
Section 6 : commencer par une contradiction ("On dit souvent que... En réalité...")


6. L'absence totale d'imperfections
Un texte humain contient naturellement des éléments que l'IA ne produit jamais :

Des parenthèses explicatives : "le TF-IDF (en gros, un score qui mesure l'importance d'un mot dans un texte par rapport au reste du web)"
Des reformulations spontanées : "En clair, ça veut dire que..."
Des marqueurs d'hésitation contrôlée : "Disons que...", "Grosso modo...", "Si on simplifie..."
Des expressions familières calibrées : "pas folichon", "loin d'être ouf", "ça envoie du lourd"
Des opinions assumées : "Perso, je ne recommande pas cette approche" / "C'est sous-estimé"


7. Les listes trop propres et trop longues
L'IA génère des listes de 5-10 éléments, toujours formatées pareil, toujours avec le même niveau de détail par item. Le pattern typique : "Terme en gras : définition du terme" en boucle.
Règles pour les listes humaines :

Maximum 4-5 éléments par liste
Varier la longueur des items (un item court, un item avec explication)
Ajouter un commentaire personnel sur un item ("celui-là, c'est mon préféré")
Ne pas mettre de point-virgule à la fin de chaque item (un humain ne le fait presque jamais)
Parfois, transformer la liste en phrase : "Les trois trucs qui comptent : la vitesse, le maillage et la qualité du contenu"
Ne pas systématiquement graisser le premier mot de chaque item


8. L'excès de structure (trop de H2/H3)
L'IA découpe tout en micro-sections avec des titres pour chaque sous-idée. Un humain n'a pas besoin d'un H3 tous les 80 mots.
Règle : une section H2 fait au moins 200-300 mots avant le prochain H2. Les H3 sont utilisés avec parcimonie, seulement quand c'est vraiment nécessaire pour la lisibilité. Certains paragraphes de développement n'ont pas besoin de titre.

9. Le vouvoiement/tutoiement incohérent
L'IA mélange ou maintient un registre trop rigide. Un vrai rédacteur web en France choisit un registre et s'y tient, mais avec des variations naturelles.
Règle : si le site tutoie, tutoyer partout. Si le site vouvoie, vouvoyer mais avec un ton chaleureux, pas administratif.

10. L'absence de références au monde réel
L'IA parle en abstractions. Un humain fait des références concrètes.
Ajouter quand c'est pertinent :

Des noms d'outils réels : "Screaming Frog", "Semrush", "la Search Console"
Des références à des situations réelles : "Quand tu scrolles sur ton téléphone..."
Des comparaisons du quotidien : "C'est comme ranger ta chambre en mettant tout sous le lit. Ça marche 5 minutes"
Des chiffres précis (pas ronds) : "une amélioration de 23%" plutôt que "une amélioration significative"


11. Les conclusions prévisibles
L'IA termine toujours par un résumé + CTA générique. C'est un des patterns les plus facilement détectés.
Alternatives :

Terminer par une question ouverte au lecteur
Terminer par un conseil actionnable très concret ("La première chose à faire ce soir : vérifie tes 5 pages les plus visitées dans la Search Console")
Terminer par une prise de position ("À mon avis, ce n'est que le début")
Ne pas résumer ce qui vient d'être dit (le lecteur vient de le lire)


12. L'uniformité du ton
L'IA maintient le même registre du début à la fin. Un humain varie naturellement :

Plus décontracté dans l'intro pour accrocher
Plus technique/précis dans le corps du texte
Plus personnel/engageant dans la conclusion
Des pics d'enthousiasme sur certains points ("Là, c'est vraiment le game-changer")
Des baisses de ton volontaires ("Bon, soyons honnêtes, c'est pas sexy comme sujet")


13. L'emphase indue sur l'importance et la signification (marqueur Wikipedia majeur)
C'est l'un des tells les plus puissants identifiés par Wikipedia. Les LLMs gonflent systématiquement l'importance de chaque aspect du sujet en ajoutant des déclarations sur comment tel ou tel élément "représente" ou "contribue à" un thème plus large. Le texte crie de plus en plus fort que le sujet est important, alors que les détails concrets disparaissent.
Expressions à traquer et supprimer :

"marquant un moment pivot/charnière dans..."
"représentant un tournant significatif dans..."
"contribuant à l'évolution de..."
"soulignant l'importance de..."
"reflétant son engagement envers..."
"témoignant de la pertinence durable de..."
"s'inscrivant dans une dynamique plus large de..."
"jouant un rôle clé/vital/crucial dans..."
"laissant une marque indélébile sur..."
"profondément ancré dans..."
"préparant le terrain pour..."

Le problème : ces phrases sont du remplissage vide qui n'apporte aucune information. Elles remplacent des faits précis par de l'exagération générique.
Règle : si une phrase peut s'appliquer à n'importe quel sujet en remplaçant juste le nom, c'est de l'emphase IA. Supprimer et remplacer par un fait concret ou ne rien mettre.
Exemple :

❌ IA : "L'ouverture de cette boutique en 2019 a marqué un moment pivot dans l'évolution du commerce de proximité à Lyon, reflétant une dynamique plus large de retour aux circuits courts."
✅ Humain : "La boutique a ouvert en 2019. En trois ans, elle est passée de 200 à 1 500 clients réguliers."


14. Les analyses superficielles en participe présent (marqueur Wikipedia)
L'IA colle des analyses pseudo-profondes à la fin de phrases factuelles, souvent sous forme de participe présent ("-ant"). C'est de la synthèse vide qui ne dit rien de concret.
Patterns à détecter :

"[fait] ..., soulignant l'importance de..."
"[fait] ..., contribuant à une meilleure..."
"[fait] ..., reflétant la volonté de..."
"[fait] ..., symbolisant l'engagement envers..."
"[fait] ..., offrant des perspectives intéressantes pour..."
"[fait] ..., favorisant une approche plus..."

Règle : couper systématiquement la queue en participe présent. Si l'analyse est pertinente, en faire une phrase séparée avec un vrai argument. Sinon, supprimer.
Exemple :

❌ IA : "Le site propose un chatbot intégré, offrant une expérience utilisateur améliorée et favorisant l'engagement client."
✅ Humain : "Le site a un chatbot. Depuis qu'ils l'ont ajouté, leur taux de conversion a pris +15%."


15. Les parallélismes négatifs (marqueur Wikipedia)
Les LLMs adorent la construction "Ce n'est pas X, c'est Y" ou "Il ne s'agit pas seulement de X, mais aussi de Y". Ça donne l'illusion de profondeur et d'équilibre, mais c'est un tic stylistique massif.
Patterns à détecter :

"Ce n'est pas simplement un [X]. C'est un [Y]."
"Il ne s'agit pas seulement de [X], mais de [Y]."
"Pas seulement [X], mais aussi [Y]."
"Non pas [X], mais [Y]."
"Ce n'est pas tant [X] que [Y]."

Règle : un parallélisme négatif de temps en temps, c'est humain. Deux ou plus dans le même texte, c'est un drapeau rouge. Reformuler en affirmation directe.
Exemple :

❌ IA : "Le SEO technique n'est pas simplement une question d'optimisation. C'est un investissement stratégique dans la performance durable de votre présence digitale."
✅ Humain : "Le SEO technique, c'est ce qui fait que Google peut lire ton site sans se prendre les pieds dans le tapis."


16. La règle de trois compulsive (marqueur Wikipedia)
Les LLMs utilisent massivement la "règle de trois" : trois adjectifs, trois bénéfices, trois exemples, trois éléments en parallèle. C'est un tic de rédaction marketing que l'IA pousse à l'extrême.
Patterns à détecter :

"innovant, performant et durable"
"qualité, fiabilité et expertise"
"des sessions de keynotes, des ateliers pratiques et des opportunités de networking"
Toute liste de trois éléments parallèles de structure identique

Règle : un triplet ici et là, ça va. Mais quand chaque description empile exactement trois adjectifs et chaque paragraphe aligne trois éléments parallèles, il faut casser le rythme. Utiliser 2 éléments, ou 4, ou reformuler en prose.
Exemple :

❌ IA : "Notre approche est innovante, collaborative et centrée sur le résultat."
✅ Humain : "On teste, on itère, et si ça marche pas, on recommence autrement."


17. Les fausses plages (marqueur Wikipedia)
Les LLMs adorent la construction "de X à Y" pour donner une impression d'exhaustivité, mais les deux extrémités n'ont souvent aucun lien logique : il n'y a pas de vrai spectre entre elles.
Patterns à détecter :

"Des petits artisans aux grandes entreprises internationales"
"De l'expertise technique à la vision créative"
"Du diagnostic initial à l'accompagnement stratégique"
"Des enjeux locaux aux défis mondiaux"

Test : peut-on identifier un milieu cohérent entre les deux bornes sans changer d'échelle ? Si non, c'est une fausse plage.
Règle : remplacer par une simple énumération ou une description directe.
Exemple :

❌ IA : "Nous accompagnons nos clients des premières réflexions stratégiques à la mise en œuvre opérationnelle, en passant par l'optimisation continue."
✅ Humain : "On fait le plan SEO, on l'exécute, et on ajuste chaque mois en fonction des résultats."


18. La variation élégante (marqueur Wikipedia)
Les LLMs ont un mécanisme de pénalité de répétition qui les empêche de réutiliser le même mot. Résultat : ils utilisent 5 synonymes pour le même concept dans le même paragraphe (le "sujet" devient "le protagoniste", puis "l'intéressé", puis "la figure centrale"...). C'est l'inverse de ce qu'un humain fait : un humain répète un mot simple plutôt que de chercher des synonymes alambiqués.
Patterns à détecter :

Un concept nommé différemment à chaque mention
Des périphrases pour éviter de répéter un mot simple
"L'outil", puis "la solution", puis "la plateforme", puis "le dispositif" pour parler du même logiciel

Règle : préférer la répétition naturelle. Si tu parles de Screaming Frog, dis "Screaming Frog" plusieurs fois plutôt que "l'outil d'audit", "la solution de crawl", "ce dispositif d'analyse technique".
Exemple :

❌ IA : "Semrush est un outil SEO complet. Cette plateforme d'analyse permet de... La solution offre également... Ce dispositif de veille concurrentielle..."
✅ Humain : "Semrush est un outil SEO complet. Semrush te permet de... Et ce qui est vraiment bien avec Semrush, c'est que..."


19. L'évitement du verbe "être" (marqueur Wikipedia)
Les LLMs substituent systématiquement "est" / "sont" par des constructions plus élaborées comme "sert de", "représente un", "constitue un", "marque le", "incarne". Une étude a documenté une baisse de plus de 10% de l'utilisation de "est" et "sont" dans les textes académiques après 2023. Le même phénomène se retrouve dans les textes web.
Patterns à détecter :

"X sert de référence pour..." → "X est la référence pour..."
"X constitue un élément central de..." → "X est central dans..."
"Ce lieu représente un symbole de..." → "Ce lieu est un symbole de..."
"X marque une étape importante dans..." → "X est une étape importante"
"X incarne les valeurs de..." → "X reflète les valeurs de..." ou "X, c'est les valeurs de..."
"X offre / propose / dispose de / bénéficie de" → "X a"

Règle : "est" et "a" sont les verbes les plus humains qui existent. Les utiliser sans complexe. Soupçonner toute construction qui remplace "est" par un verbe plus "élégant".
Exemple :

❌ IA : "Cette boutique sert de point de référence incontournable pour les amateurs de sneakers dans la région lyonnaise, offrant une sélection qui incarne l'esprit de la culture street."
✅ Humain : "C'est LA boutique sneakers de Lyon. Tu y trouves des modèles que personne d'autre n'a en stock."


Règles SEO à préserver pendant l'humanisation
L'humanisation ne doit jamais se faire au détriment du SEO. Voici les éléments intouchables :

Le mot-clé principal doit rester dans : le H1, le premier paragraphe (idéalement dans les 100 premiers mots), au moins 2-3 H2, et dans le texte avec une densité de 1-2%
Les mots-clés secondaires et le champ sémantique doivent être préservés : ne jamais remplacer un terme sémantiquement important par un synonyme hors-sujet
La structure Hn doit rester logique et SEO-friendly (H1 unique, H2 pour les sections principales, H3 pour les sous-sections)
Le maillage interne : tous les liens internes du texte source doivent être conservés ou améliorés (meilleures ancres)
Les balises title et meta description si fournies : les humaniser aussi mais en respectant les contraintes de longueur (title ≤ 70 caractères, meta ≤ 160 caractères)
Les données structurées (FAQ, HowTo) : préserver la structure question/réponse si c'est une FAQ
La longueur du texte : le texte humanisé doit faire ±10% de la longueur de l'original. Pas de coupe drastique ni d'ajout excessif.


Checklist d'auto-évaluation avant livraison
Avant de livrer le texte humanisé, vérifier chacun de ces points :
Perplexité (choix lexicaux imprévisibles)

 Aucun connecteur robot ("en outre", "de surcroît", "il convient de")
 Aucun mot de la liste noire IA utilisé plus de 2 fois (vérifier le tableau du marqueur 4)
 Au moins 5 expressions familières/conversationnelles dans le texte
 Au moins 2 métaphores ou comparaisons originales
 Au moins 1 opinion personnelle ou prise de position
 Aucun usage de "il est important de" / "il est essentiel de" / "n'hésitez pas à"
 Les verbes sont variés (pas 3 fois "permettre" ou "optimiser" dans le même texte)
 Le verbe "être" est utilisé naturellement (pas évité au profit de "servir de", "constituer")

Burstiness (variation structurelle)

 Aucune série de 3+ phrases de longueur similaire (±3 mots)
 Au moins 3 phrases ultra-courtes (1-5 mots) dans le texte
 Au moins 2 phrases longues complexes (30+ mots avec subordonnées)
 Les paragraphes font entre 2 et 6 phrases (pas tous la même taille)
 Les entrées en matière des sections varient (question, exemple, stat, affirmation...)

Authenticité humaine (marqueurs Wikipedia)

 Au moins 1 parenthèse explicative dans le texte
 Aucun tiret long dans tout le texte : utiliser des parenthèses, virgules ou deux-points à la place
 Au moins 1 question rhétorique posée au lecteur
 Au moins 1 référence concrète (outil, marque, situation réelle)
 La conclusion ne résume PAS l'article et ne dit PAS "n'hésitez pas à"
 Aucune emphase indue sur l'importance/signification ("moment pivot", "rôle clé", "dynamique plus large")
 Aucune analyse superficielle en participe présent collée à une phrase factuelle
 Maximum 1 parallélisme négatif ("ce n'est pas X, c'est Y") dans tout le texte
 Pas de triplets systématiques (3 adjectifs, 3 bénéfices, 3 exemples en parallèle partout)
 Pas de fausse plage ("du X au Y" sans vrai spectre logique)
 Pas de variation élégante excessive (le même concept nommé avec 4 synonymes différents)
 Pas de gras excessif sur les termes clés façon manuel scolaire

SEO préservé

 Mot-clé principal dans H1 + premier paragraphe + 2-3 H2
 Champ sémantique intact
 Structure Hn logique et optimisée
 Liens internes préservés
 Longueur finale ±10% de l'original


Format de livraison
Livrer le texte humanisé en Markdown avec :

Le texte complet réécrit (en Markdown pour faciliter l'intégration)
Un bref résumé des modifications majeures effectuées (5 lignes max)
Le score estimé de "risque IA" : Faible / Moyen / Élevé (basé sur la checklist)

Si l'utilisateur le demande, créer un fichier .docx ou .md téléchargeable.

Exemples de réécriture
Exemple 1 : paragraphe e-commerce
❌ Texte IA source :
"Le lubrifiant à base d'eau est un produit essentiel pour toute personne souhaitant améliorer son confort lors des rapports intimes. En effet, ce type de lubrifiant est compatible avec l'ensemble des préservatifs et des jouets en silicone. De plus, il est facile à nettoyer et ne laisse aucune trace sur les draps. Il est recommandé de choisir un lubrifiant sans parfum et sans paraben pour éviter tout risque d'irritation."
✅ Texte humanisé :
"Si tu débutes avec les lubrifiants, pars sur une base eau. C'est le choix le plus safe : compatible avec tous les préservatifs, tous les toys en silicone, et ça se rince en un clin d'œil (fini les taches mystères sur les draps). Un conseil quand même : vérifie la compo. Pas de parfum, pas de paraben. Ta peau te remerciera."
Ce qui a changé :

Tutoiement direct, ton conversationnel
"essentiel" → supprimé (mot IA)
"En effet" + "De plus" → supprimés (connecteurs robots)
"Il est recommandé de" → "Un conseil quand même" (tournure humaine)
Ajout de familiarité ("safe", "toys", "les taches mystères")
Variation de longueur : phrases de 6 à 23 mots
Ajout d'une parenthèse pour l'incise
Phrase finale courte et percutante

Exemple 2 : paragraphe blog technique SEO
❌ Texte IA source :
"Le maillage interne est un élément fondamental de toute stratégie SEO efficace. Il permet de distribuer le PageRank entre les différentes pages de votre site et d'aider les moteurs de recherche à comprendre la structure de votre contenu. Pour optimiser votre maillage interne, veillez à utiliser des ancres de liens descriptives et à établir une hiérarchie claire entre vos pages."
✅ Texte humanisé :
"Le maillage interne, c'est un peu la plomberie du SEO. Personne ne le voit, mais quand c'est mal fait, tout se bouche. Concrètement, c'est ce qui permet à Google de naviguer dans ton site et de comprendre quelle page est importante (et laquelle ne l'est pas). Les deux trucs à retenir : des ancres de liens qui disent vraiment de quoi parle la page cible (pas de "cliquez ici", pitié), et une logique de hiérarchie claire entre tes pages piliers et tes pages secondaires."
Ce qui a changé :

"élément fondamental" → comparaison concrète (plomberie)
"Il permet de" → "Concrètement, c'est ce qui permet"
"veillez à" → disparaît au profit d'un conseil direct
Ajout d'une opinion/injonction humoristique ("pas de 'cliquez ici', pitié")
Tirets longs → parenthèses pour les incises
Variation de longueur : 8 mots → 28 mots → 34 mots → 42 mots
Ton qui passe du décontracté (la métaphore) au technique (PageRank, ancres)

Exemple 3 : paragraphe landing page (emphase IA vs. faits concrets)
❌ Texte IA source :
"Notre agence se positionne comme un acteur incontournable dans le paysage du référencement naturel. Notre approche innovante, personnalisée et orientée résultat nous permet d'offrir un accompagnement stratégique de qualité. Du diagnostic initial à la mise en œuvre opérationnelle, nous nous engageons à fournir des solutions qui répondent précisément à vos besoins, contribuant ainsi à la croissance durable de votre présence en ligne."
✅ Texte humanisé :
"On fait du SEO depuis 2017. Plus de 80 clients accompagnés, des e-commerces surtout (mode, alimentaire, santé). Notre méthode : un audit technique + sémantique en semaine 1, un plan d'action livré en semaine 2, et des résultats visibles dès le mois 3. On ne vend pas de la stratégie, on fait monter vos pages."
Ce qui a changé :

Toute l'emphase IA supprimée ("acteur incontournable", "paysage", "croissance durable")
Fausse plage supprimée ("du diagnostic à la mise en œuvre")
Triplet IA supprimé ("innovante, personnalisée et orientée résultat")
Remplacé par des faits concrets : dates, chiffres, secteurs, timeline
Phrase finale qui affirme au lieu de promettre vaguement


Adaptations par type de contenu
Blog / Article

Ton conversationnel, tutoiement ou vouvoiement selon le site
Opinions et prises de position bienvenues
Anecdotes et exemples concrets encouragés
Parenthèses et apartés naturels

Page collection / catégorie e-commerce

Ton un peu plus commercial mais restant naturel
Moins de familiarité, plus de rassurance
Focus sur les bénéfices produit formulés de façon concrète
Pas de blabla d'intro trop long : le visiteur veut voir les produits

Landing page / page de service

Ton professionnel mais accessible
Preuves sociales et chiffres concrets
Phrases d'accroche percutantes
Moins de questions rhétoriques, plus d'affirmations de valeur

FAQ / Questions-réponses

Réponses directes dès la première phrase (pas de contexte avant la réponse)
Ton pédagogue et bienveillant
Phrases courtes et claires
Pas de connecteurs logiques entre les Q/R


Consignes finales

Ne jamais mentionner que le texte a été humanisé, réécrit par IA, ou passé dans un outil. Le texte doit se suffire à lui-même.
Ne jamais sacrifier la clarté pour l'humanisation. Un texte humain et incompréhensible n'a aucune valeur. La clarté prime toujours.
Réécrire, pas paraphraser. La différence est énorme. Paraphraser = changer les mots. Réécrire = repenser le texte comme si on l'écrivait soi-même pour la première fois avec les mêmes informations.
Le texte doit être publiable tel quel. Pas de placeholder, pas de "[à compléter]", pas de note au rédacteur.
En cas de doute sur le ton, demander à l'utilisateur le site cible pour aller vérifier le ton éditorial existant via web_fetch.
