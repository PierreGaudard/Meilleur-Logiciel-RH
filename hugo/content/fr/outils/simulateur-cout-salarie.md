---
title: "Simulateur coût d'un salarié 2026"
seoTitle: "Simulateur coût salarié 2026 : coût total employeur"
description: "Simulateur gratuit du coût total d'un salarié en France en 2026. Charges patronales, mutuelle, tickets restaurant, transport. Données URSSAF officielles."
lastmod: "2026-10-15T16:49:03+02:00"
css: "outils-simulateur-cout-salarie"
js:
  - "outils-simulateur-cout-salarie"
jsonldExtra:
  - "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"Quel est le coût réel d'un salarié pour l'employeur en France ?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"En France, le coût total d'un salarié pour l'employeur représente en moyenne 1,4 à 1,6 fois le salaire brut. Pour un salarié non-cadre au SMIC, grâce à la réduction Fillon, le ratio peut descendre autour de 1,1. Pour un cadre à 5 000 EUR brut, il monte à environ 1,45. Ce ratio inclut les cotisations patronales obligatoires (maladie, vieillesse, chômage, retraite complémentaire, AT/MP) mais pas les avantages facultatifs (mutuelle, tickets restaurant, transport).\"}}, {\"@type\": \"Question\", \"name\": \"Quelles sont les principales charges patronales en 2026 ?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Les charges patronales comprennent : l'assurance maladie (7% ou 13%), les allocations familiales (3,45% ou 5,25%), l'assurance vieillesse (8,55% plafonée + 2,02% déplafonée), les accidents du travail (taux variable, 1,28% en moyenne), l'assurance chômage (4,05%), l'AGS (0,20%), la retraite complémentaire AGIRC-ARRCO (4,72% T1 + 12,95% T2), la CEG (1,29% T1 + 1,62% T2), le FNAL (0,10% ou 0,50%), la CSA (0,30%), la taxe d'apprentissage (0,68%) et la contribution formation (0,55% ou 1%).\"}}, {\"@type\": \"Question\", \"name\": \"Comment fonctionne la réduction Fillon ?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"La réduction générale de cotisations patronales (ex-réduction Fillon) s'applique aux salaires inférieurs à 1,6 SMIC brut mensuel (soit environ 2 883 EUR en 2026). Elle réduit progressivement les charges patronales selon un coefficient calculé par la formule : C = (0,3206 / 0,6) x (1,6 x SMIC / salaire brut - 1). La réduction est maximale au SMIC (environ 560 EUR/mois de charges en moins) et devient nulle à 1,6 SMIC. Pour les entreprises de 50 salariés et plus, le coefficient maximal est de 0,3246.\"}}, {\"@type\": \"Question\", \"name\": \"Un CDD coûte-t-il plus cher qu'un CDI ?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Oui, un CDD coûte généralement plus cher qu'un CDI. Le salarié en CDD a droit à une indemnité de fin de contrat (prime de précarité) égale à 10% de la rémunération brute totale versée pendant le contrat. De plus, certains CDD d'usage sont soumis à une taxe forfaitaire de 10 EUR. En revanche, les cotisations patronales de base sont identiques entre CDD et CDI. Au total, un CDD représente un surcoût d'environ 10 à 15% par rapport à un CDI pour un même salaire brut.\"}}, {\"@type\": \"Question\", \"name\": \"La mutuelle d'entreprise est-elle obligatoire ?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Oui, depuis le 1er janvier 2016, tout employeur du secteur privé doit proposer une complémentaire santé collective à ses salariés. L'employeur doit financer au minimum 50% de la cotisation. Le panier de soins minimal est défini par la loi et comprend le remboursement du ticket modérateur, le forfait journalier hospitalier, les frais dentaires et optiques dans certaines limites. La part employeur de la mutuelle est exonérée de cotisations sociales dans la limite de certains plafonds, mais elle est soumise à la CSG-CRDS et au forfait social de 8%.\"}}]}"
  - "{\"@context\": \"https://schema.org\", \"@type\": \"WebApplication\", \"name\": \"Simulateur coût d'un salarié 2026\", \"url\": \"https://meilleur-logiciel-rh.fr/outils/simulateur-cout-salarie.html\", \"applicationCategory\": \"FinanceApplication\", \"operatingSystem\": \"Web\", \"offers\": {\"@type\": \"Offer\", \"price\": \"0\", \"priceCurrency\": \"EUR\"}, \"description\": \"Simulateur gratuit pour calculer le coût total d'un salarié en France en 2026. Charges patronales détaillées, réduction Fillon, avantages en nature.\", \"inLanguage\": \"fr-FR\", \"provider\": {\"@type\": \"Organization\", \"name\": \"MLRH\", \"url\": \"https://meilleur-logiciel-rh.fr\"}}"
---

Calculez le coût total réel d'un salarié pour votre entreprise. Charges patronales détaillées, réduction Fillon, mutuelle, tickets restaurant et transport. Données URSSAF officielles.

<section class="calc-section">
<div class="calc-card">
<div class="calc-header">
<div class="calc-header-title">Simulateur de coût employeur</div>
<div class="calc-header-sub">Saisissez les informations du poste, le calcul se met à jour automatiquement</div>
</div>
<div class="calc-body">
<div class="calc-grid">
<div class="calc-field">
<label for="salaire-brut">Salaire brut mensuel</label>
<div class="calc-input-wrap">
<input class="has-suffix" id="salaire-brut" min="0" placeholder="3 000" step="50" type="number" value=""/>
<span class="input-suffix">€</span>
</div>
</div>
<div class="calc-field">
<label for="statut">Statut du salarié</label>
<div class="calc-input-wrap">
<select id="statut">
<option value="non-cadre">Non-cadre</option>
<option value="cadre">Cadre</option>
<option value="apprenti">Apprenti</option>
</select>
</div>
</div>
<div class="calc-field">
<label for="contrat">Type de contrat</label>
<div class="calc-input-wrap">
<select id="contrat">
<option value="cdi">CDI</option>
<option value="cdd">CDD (prime de précarité 10%)</option>
</select>
</div>
</div>
<div class="calc-field">
<label for="taille">Taille de l'entreprise</label>
<div class="calc-input-wrap">
<select id="taille">
<option value="petite">Moins de 11 salariés</option>
<option value="moyenne">11 à 49 salariés</option>
<option value="grande">50 salariés et plus</option>
</select>
</div>
</div>
<div class="calc-field">
<label for="taux-at">Taux AT/MP <span class="field-hint">(accidents du travail)</span></label>
<div class="calc-input-wrap">
<input class="has-suffix" id="taux-at" max="10" min="0" placeholder="1.28" step="0.01" type="number" value=""/>
<span class="input-suffix">%</span>
</div>
</div>
<div class="calc-field">
<label for="mutuelle">Mutuelle part employeur <span class="field-hint">(mensuel)</span></label>
<div class="calc-input-wrap">
<input class="has-suffix" id="mutuelle" min="0" placeholder="50" step="5" type="number" value=""/>
<span class="input-suffix">€</span>
</div>
</div>
<div class="calc-field">
<label for="tickets">Tickets restaurant part employeur <span class="field-hint">(mensuel)</span></label>
<div class="calc-input-wrap">
<input class="has-suffix" id="tickets" min="0" placeholder="0" step="10" type="number" value=""/>
<span class="input-suffix">€</span>
</div>
</div>
<div class="calc-field">
<label for="transport">Remboursement transport <span class="field-hint">(mensuel)</span></label>
<div class="calc-input-wrap">
<input class="has-suffix" id="transport" min="0" placeholder="0" step="5" type="number" value=""/>
<span class="input-suffix">€</span>
</div>
</div>
</div>
<div class="calc-results" id="calc-results" style="display:none">
<div class="results-title">Résultat de la simulation</div>
<div style="background:var(--primary-light);border-radius:12px;padding:28px;text-align:center;margin-bottom:20px">
<div style="font-size:.85rem;font-weight:600;color:var(--primary-dark);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Coût total mensuel employeur</div>
<div id="res-total-mensuel" style="font-size:2.4rem;font-weight:900;color:var(--primary-dark)">-</div>
<div id="res-ratio" style="font-size:1rem;font-weight:700;color:var(--primary);margin-top:8px">-</div>
<div style="font-size:.82rem;color:var(--text-muted);margin-top:4px">Coût annuel : <span id="res-total-annuel">-</span></div>
</div>
<div style="text-align:center;margin-bottom:16px">
<button onclick="var d=document.getElementById('cout-detail');d.style.display=d.style.display==='none'?'block':'none';this.textContent=d.style.display==='none'?'Voir le détail des charges':'Masquer le détail'" style="background:none;border:1px solid var(--border);border-radius:8px;padding:10px 18px;font-size:.85rem;font-weight:600;color:var(--primary);cursor:pointer;font-family:inherit" type="button">Voir le détail des charges</button>
</div>
<div id="cout-detail" style="display:none">
<div class="result-lines">
<div class="result-line">
<span class="rl-label">Salaire brut mensuel</span>
<span class="rl-value" id="res-brut">-</span>
</div>
<div class="result-line deduction">
<span class="rl-label">Cotisations patronales <span class="rl-pct" id="res-cotis-pct">-</span></span>
<span class="rl-value" id="res-cotis">-</span>
</div>
<div class="result-line deduction" id="row-fillon" style="display:none">
<span class="rl-label">Réduction générale (Fillon) <span class="rl-pct" id="res-fillon-pct">-</span></span>
<span class="rl-value" id="res-fillon" style="color:#15803d">-</span>
</div>
<div class="result-line">
<span class="rl-label">Cotisations nettes employeur</span>
<span class="rl-value" id="res-cotis-nettes">-</span>
</div>
<div class="result-line">
<span class="rl-label">Mutuelle employeur</span>
<span class="rl-value" id="res-mutuelle">-</span>
</div>
<div class="result-line">
<span class="rl-label">Tickets restaurant</span>
<span class="rl-value" id="res-tickets">-</span>
</div>
<div class="result-line">
<span class="rl-label">Transport</span>
<span class="rl-value" id="res-transport">-</span>
</div>
<div class="result-line" id="row-precarite" style="display:none">
<span class="rl-label">Provision prime de précarité CDD <span class="rl-pct">10%</span></span>
<span class="rl-value" id="res-precarite">-</span>
</div>
</div>
<button class="breakdown-toggle" id="btn-detail" onclick="toggleBreakdown()" type="button">
<svg fill="none" height="16" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="16"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
Voir le détail des cotisations patronales
</button>
<div class="breakdown-table-wrap" id="breakdown-wrap">
<table class="breakdown-table">
<thead>
<tr>
<th>Cotisation</th>
<th>Taux</th>
<th>Base</th>
<th>Montant</th>
</tr>
</thead>
<tbody id="breakdown-body">
</tbody>
</table>
</div>
</div>
</div>
</div>
</div>
</section>

<section class="content-section">
<h2>Combien coûte réellement un salarié en France en 2026 ?</h2>
<p>Recruter un collaborateur représente un investissement majeur pour toute entreprise. Pourtant, beaucoup de dirigeants de PME et de responsables RH confondent encore le salaire brut avec le coût réel du salarié. En réalité, entre le montant inscrit sur le contrat de travail et la somme totale débitée chaque mois sur le compte de l'entreprise, la différence est considérable. En France, un salarié coûte en moyenne <strong>1,4 à 1,6 fois son salaire brut</strong>. Pour un salaire brut de 3 000 EUR, l'entreprise débourse ainsi entre 4 200 et 4 800 EUR par mois, tout compris.</p>
<p>Cette réalité s'explique par le système de protection sociale français, parmi les plus complets au monde. Les cotisations patronales financent l'assurance maladie, les retraites, le chômage, la formation professionnelle et la prévention des accidents du travail. À ces charges obligatoires s'ajoutent des dispositifs complémentaires comme la mutuelle d'entreprise, les tickets restaurant ou le remboursement du titre de transport. Comprendre la composition exacte de ce coût est indispensable pour établir un budget prévisionnel fiable, négocier en connaissance de cause et optimiser sa masse salariale dans le respect du cadre légal.</p>
<h2>Le détail des charges patronales en 2026</h2>
<p>Les cotisations patronales se décomposent en plusieurs families. Chacune finance un pilier spécifique de la protection sociale. Voici le tableau complet des taux applicables en 2026, basés sur les données officielles de l'URSSAF :</p>
<div class="compare-table-wrap">
<table class="compare-table">
<thead>
<tr>
<th>Cotisation</th>
<th>Taux employeur</th>
<th>Plafond / base</th>
</tr>
</thead>
<tbody>
<tr><td>Assurance maladie</td><td>7,00% ou 13,00%</td><td>Totalité du salaire. Taux réduit à 7% si brut ≤ 2,5 SMIC</td></tr>
<tr><td>Allocations familiales</td><td>3,45% ou 5,25%</td><td>Totalité du salaire. Taux réduit à 3,45% si brut ≤ 3,5 SMIC</td></tr>
<tr><td>Assurance vieillesse plafonnée</td><td>8,55%</td><td>Plafond : 1 PASS (3 864 EUR/mois en 2025)</td></tr>
<tr><td>Assurance vieillesse déplafonnée</td><td>2,02%</td><td>Totalité du salaire</td></tr>
<tr><td>Accidents du travail (AT/MP)</td><td>Variable (moy. 1,28%)</td><td>Totalité du salaire. Taux fixé par la CARSAT selon le secteur</td></tr>
<tr><td>Assurance chômage</td><td>4,05%</td><td>Plafond : 4 PASS (15 456 EUR/mois)</td></tr>
<tr><td>AGS (garantie des salaires)</td><td>0,20%</td><td>Plafond : 4 PASS</td></tr>
<tr><td>FNAL</td><td>0,10% ou 0,50%</td><td>0,10% ≤ 1 PASS (&lt; 50 sal.) / 0,50% totalité (≥ 50 sal.)</td></tr>
<tr><td>Contribution solidarité autonomie</td><td>0,30%</td><td>Totalité du salaire</td></tr>
<tr><td>Retraite AGIRC-ARRCO T1</td><td>4,72%</td><td>Jusqu'à 1 PASS</td></tr>
<tr><td>Retraite AGIRC-ARRCO T2</td><td>12,95%</td><td>De 1 PASS à 8 PASS (cadres principalement)</td></tr>
<tr><td>CEG tranche 1</td><td>1,29%</td><td>Jusqu'à 1 PASS</td></tr>
<tr><td>CEG tranche 2</td><td>1,62%</td><td>De 1 PASS à 8 PASS</td></tr>
<tr><td>Contribution formation</td><td>0,55% ou 1,00%</td><td>0,55% (&lt; 11 sal.) / 1% (≥ 11 sal.). Totalité du salaire</td></tr>
<tr><td>Taxe d'apprentissage</td><td>0,68%</td><td>Totalité du salaire</td></tr>
<tr><td>Effort construction (PEEC)</td><td>0,45%</td><td>Totalité du salaire. Uniquement ≥ 50 salariés</td></tr>
</tbody>
</table>
</div>
<div class="info-box">
<strong>Source :</strong> Ces taux sont issus des barèmes officiels publiés par l'URSSAF et applicables au 1er janvier 2026. Le taux AT/MP varie selon l'activité de l'entreprise et sa sinistralité. Le plafond annuel de la Sécurité sociale (PASS) pour 2025 est de 46 368 EUR, soit 3 864 EUR par mois.
</div>
<h2>La réduction générale de cotisations patronales (ex-Fillon)</h2>
<p>La réduction générale, communément appelée réduction Fillon, constitue le principal levier d'allègement du coût du travail en France. Elle vise à réduire le coût des emplois peu qualifiés en diminuant significativement les charges patronales sur les bas salaires.</p>
<h3>Comment ça fonctionne ?</h3>
<p>La réduction s'applique automatiquement à tout salarié dont la rémunération brute mensuelle ne dépasse pas <strong>1,6 fois le SMIC</strong>, soit environ 2 883 EUR brut par mois en 2026. Le montant de la réduction est calculé selon la formule suivante :</p>
<ul>
<li><strong>Coefficient C</strong> = (T / 0,6) x (1,6 x SMIC mensuel / salaire brut - 1)</li>
<li><strong>T</strong> = 0,3206 pour les entreprises de moins de 50 salariés, 0,3246 pour les autres</li>
<li><strong>Réduction mensuelle</strong> = C x salaire brut mensuel</li>
</ul>
<p>Concrètement, pour un salarié au SMIC (1 802 EUR brut), la réduction représente environ <strong>560 EUR par mois</strong>, soit une baisse massive du coût employeur. Pour un salaire de 2 200 EUR brut, la réduction tombe à environ 280 EUR par mois. Elle atteint zéro à 1,6 SMIC.</p>
<div class="compare-table-wrap">
<table class="compare-table">
<thead>
<tr>
<th>Salaire brut mensuel</th>
<th>Réduction Fillon</th>
<th>Charges patronales nettes</th>
<th>Coût total employeur</th>
<th>Ratio coût/brut</th>
</tr>
</thead>
<tbody>
<tr><td>1 802 EUR (SMIC)</td><td>-560 EUR</td><td>~210 EUR</td><td>~2 062 EUR</td><td>1,14x</td></tr>
<tr><td>2 200 EUR</td><td>-280 EUR</td><td>~630 EUR</td><td>~2 880 EUR</td><td>1,31x</td></tr>
<tr><td>2 600 EUR</td><td>-90 EUR</td><td>~990 EUR</td><td>~3 640 EUR</td><td>1,40x</td></tr>
<tr><td>2 883 EUR (1,6 SMIC)</td><td>0 EUR</td><td>~1 150 EUR</td><td>~4 083 EUR</td><td>1,42x</td></tr>
<tr><td>3 500 EUR</td><td>0 EUR</td><td>~1 470 EUR</td><td>~5 020 EUR</td><td>1,43x</td></tr>
<tr><td>5 000 EUR</td><td>0 EUR</td><td>~2 250 EUR</td><td>~7 300 EUR</td><td>1,46x</td></tr>
</tbody>
</table>
</div>
<h2>CDD vs CDI : l'impact sur le coût employeur</h2>
<p>Le choix entre un CDD et un CDI a un impact direct sur le budget RH de l'entreprise. Contrairement à une idée reçue, les cotisations patronales de base sont identiques pour les deux types de contrat. La différence vient principalement de la <strong>prime de précarité</strong>.</p>
<p>À la fin d'un CDD, le salarié reçoit une indemnité de fin de contrat égale à <strong>10% de la rémunération brute totale</strong> perçue pendant le contrat (ou 6% si un accord de branche le prévoit en contrepartie d'un accès renforcé à la formation). Cette prime est elle-même soumise aux cotisations sociales, ce qui génère un surcoût supplémentaire.</p>
<ul>
<li><strong>CDI à 3 000 EUR brut</strong> : coût employeur mensuel d'environ 4 350 EUR (ratio 1,45x)</li>
<li><strong>CDD à 3 000 EUR brut</strong> : coût employeur effectif d'environ 4 785 EUR par mois (ratio 1,60x) en intégrant la provision pour prime de précarité et les charges afférentes</li>
<li><strong>Surcoût du CDD</strong> : environ 10 à 15% de plus qu'un CDI pour le même poste</li>
</ul>
<div class="info-box">
<strong>Bon à savoir :</strong> Certains CDD ne donnent pas droit à la prime de précarité : les contrats saisonniers, les CDD conclus avec des étudiants pendant les vacances, les CDD qui se transforment en CDI et les contrats d'insertion (CUI). Pensez à vérifier la situation au cas par cas.
</div>
<h2>Les coûts annexes souvent oubliés</h2>
<p>Au-delà des cotisations patronales, plusieurs postes de dépense viennent alourdir la facture totale d'un salarié. Les ignorer conduit à sous-estimer le budget réel :</p>
<ul>
<li><strong>Mutuelle d'entreprise</strong> : obligatoire depuis 2016, l'employeur finance au minimum 50% de la cotisation. Comptez en moyenne 40 à 80 EUR par mois et par salarié selon la couverture choisie.</li>
<li><strong>Tickets restaurant</strong> : lorsqu'ils sont en place, la part employeur représente 50 à 60% de la valeur du titre. Pour des tickets à 10 EUR avec une participation à 60%, cela fait 132 EUR par mois (22 jours travaillés).</li>
<li><strong>Remboursement transport</strong> : l'employeur prend en charge 50% du titre de transport en commun (75% à Paris depuis 2024 pour certaines entreprises). Comptez 40 à 50 EUR par mois en moyenne.</li>
<li><strong>Indemnité télétravail</strong> : de plus en plus courante, elle est en général de 2,60 EUR par jour de télétravail, exonérée dans cette limite. Pour 2 jours de télétravail par semaine, cela représente environ 22 EUR par mois.</li>
<li><strong>Médecine du travail</strong> : l'adhésion à un service de santé au travail coûte entre 80 et 150 EUR par salarié et par an.</li>
<li><strong>Formation professionnelle</strong> : bien que la contribution obligatoire soit intégrée aux charges, les formations concrètes engagent un budget supplémentaire (coût pédagogique, absence du salarié).</li>
</ul>
<h2>Exemples concrets de coût total employeur</h2>
<p>Pour rendre ces chiffres plus parlants, voici trois exemples détaillés correspondant à des profils courants en PME :</p>
<h3>Exemple 1 : assistant administratif au SMIC en CDI</h3>
<div class="compare-table-wrap">
<table class="compare-table">
<thead>
<tr><th>Poste</th><th>Montant mensuel</th></tr>
</thead>
<tbody>
<tr><td>Salaire brut</td><td>1 802 EUR</td></tr>
<tr><td>Charges patronales brutes</td><td>~770 EUR</td></tr>
<tr><td>Réduction Fillon</td><td>-560 EUR</td></tr>
<tr><td>Mutuelle employeur</td><td>40 EUR</td></tr>
<tr><td>Tickets restaurant (60% de 9 EUR x 22j)</td><td>119 EUR</td></tr>
<tr><td>Transport (50% Navigo)</td><td>43 EUR</td></tr>
<tr><td><strong>Coût total mensuel</strong></td><td><strong>2 214 EUR</strong></td></tr>
<tr><td><strong>Coût total annuel</strong></td><td><strong>26 568 EUR</strong></td></tr>
</tbody>
</table>
</div>
<h3>Exemple 2 : commercial cadre à 3 500 EUR brut en CDI</h3>
<div class="compare-table-wrap">
<table class="compare-table">
<thead>
<tr><th>Poste</th><th>Montant mensuel</th></tr>
</thead>
<tbody>
<tr><td>Salaire brut</td><td>3 500 EUR</td></tr>
<tr><td>Charges patronales</td><td>~1 540 EUR</td></tr>
<tr><td>Réduction Fillon</td><td>0 EUR (brut &gt; 1,6 SMIC)</td></tr>
<tr><td>Mutuelle employeur</td><td>60 EUR</td></tr>
<tr><td>Tickets restaurant</td><td>132 EUR</td></tr>
<tr><td>Transport</td><td>43 EUR</td></tr>
<tr><td><strong>Coût total mensuel</strong></td><td><strong>5 275 EUR</strong></td></tr>
<tr><td><strong>Coût total annuel</strong></td><td><strong>63 300 EUR</strong></td></tr>
</tbody>
</table>
</div>
<h3>Exemple 3 : développeur cadre à 5 000 EUR brut en CDI</h3>
<div class="compare-table-wrap">
<table class="compare-table">
<thead>
<tr><th>Poste</th><th>Montant mensuel</th></tr>
</thead>
<tbody>
<tr><td>Salaire brut</td><td>5 000 EUR</td></tr>
<tr><td>Charges patronales</td><td>~2 310 EUR</td></tr>
<tr><td>Mutuelle employeur</td><td>70 EUR</td></tr>
<tr><td>Tickets restaurant</td><td>132 EUR</td></tr>
<tr><td>Transport</td><td>43 EUR</td></tr>
<tr><td><strong>Coût total mensuel</strong></td><td><strong>7 555 EUR</strong></td></tr>
<tr><td><strong>Coût total annuel</strong></td><td><strong>90 660 EUR</strong></td></tr>
</tbody>
</table>
</div>
<h2>Comment optimiser le coût d'un salarié légalement ?</h2>
<p>Réduire le coût du travail ne signifie pas rogner sur les salaires. Plusieurs leviers légaux permettent d'optimiser la masse salariale tout en préservant l'attractivité de votre entreprise :</p>
<ol>
<li><strong>Exploiter la réduction Fillon au maximum</strong> : pour les postes dont la rémunération est proche du SMIC, la réduction générale peut diviser les charges patronales par trois. Vérifiez que vos bulletins de paie appliquent bien cette réduction.</li>
<li><strong>Privilégier les avantages exonérés</strong> : les tickets restaurant (jusqu'à 7,18 EUR de part employeur exonéré), l'indemnité télétravail, le forfait mobilité durable (jusqu'à 700 EUR/an exonérés) sont autant de leviers pour augmenter le pouvoir d'achat sans charges supplémentaires.</li>
<li><strong>Mettre en place l'intéressement et la participation</strong> : exonérés de cotisations patronales (hors forfait social de 8% pour les entreprises de plus de 250 salariés), ces dispositifs permettent de partager les résultats sans alourdir la masse salariale fixe.</li>
<li><strong>Recourir à l'apprentissage</strong> : l'aide à l'embauche d'apprentis (6 000 EUR la première année) cumulée à des cotisations réduites rend ce contrat très compétitif pour former de futurs collaborateurs.</li>
<li><strong>Vérifier les aides à l'embauche en vigueur</strong> : certaines zones géographiques (ZRR, QPV) ou certains profils (travailleurs handicapés, seniors) ouvrent droit à des exonérations spécifiques. Consultez le site de l'URSSAF ou de France Travail pour les dispositifs actuels.</li>
</ol>
<div class="info-box">
<strong>Attention :</strong> Nos calculs sont basés sur les règles générales applicables en France métropolitaine. Votre situation exacte peut varier selon votre convention collective, vos accords d'entreprise et le taux AT/MP propre à votre activité. Pour un chiffrage précis et opposable, consultez votre expert-comptable ou votre gestionnaire de paie.
</div>
<h2>Questions fréquentes sur le coût d'un salarié</h2>
<div class="faq-list">
<details class="mlrh-faq-item"><summary class="mlrh-faq-question">Quel est le coût réel d'un salarié pour l'employeur en France ?</summary><div class="mlrh-faq-answer">
Le coût total d'un salarié représente en moyenne 1,4 à 1,6 fois son salaire brut. Pour un salarié au SMIC, grâce à la réduction Fillon, ce ratio peut descendre à 1,1. Pour un cadre gagnant 5 000 EUR brut, comptez environ 7 300 EUR par mois, soit un ratio de 1,46. À cela s'ajoutent les avantages éventuels (mutuelle, tickets restaurant, transport) qui alourdissent encore la facture. Le coût annuel total est obtenu en multipliant le coût mensuel par 12 (les congés payés sont déjà inclus dans le salaire brut).
</div></details>
<details class="mlrh-faq-item"><summary class="mlrh-faq-question">Quelles sont les charges patronales principales en 2026 ?</summary><div class="mlrh-faq-answer">
Les charges patronales comprennent l'assurance maladie (7% ou 13% selon le salaire), les allocations familiales (3,45% ou 5,25%), l'assurance vieillesse (8,55% plafonnée + 2,02% déplafonnée), les accidents du travail (taux variable), l'assurance chômage (4,05%), la retraite complémentaire AGIRC-ARRCO (4,72% T1 + 12,95% T2), le FNAL (0,10% ou 0,50%), la CSA (0,30%), la taxe d'apprentissage (0,68%) et la contribution formation (0,55% ou 1%). Au total, elles représentent entre 25% et 45% du salaire brut selon le niveau de rémunération et le statut.
</div></details>
<details class="mlrh-faq-item"><summary class="mlrh-faq-question">Comment fonctionne la réduction Fillon en 2026 ?</summary><div class="mlrh-faq-answer">
La réduction générale (ex-Fillon) allège les charges patronales pour les salaires inférieurs à 1,6 SMIC brut mensuel (environ 2 883 EUR). Le coefficient de réduction est calculé par la formule : C = (T / 0,6) x (1,6 x SMIC mensuel / salaire brut - 1), où T vaut 0,3206 (&lt; 50 salariés) ou 0,3246 (&gt;= 50 salariés). La réduction est maximale au SMIC (environ 560 EUR/mois) et diminue linéairement jusqu'à s'annuler à 1,6 SMIC. Elle s'applique automatiquement et doit figurer sur le bulletin de paie.
</div></details>
<details class="mlrh-faq-item"><summary class="mlrh-faq-question">Un CDD coûte-t-il plus cher qu'un CDI pour l'employeur ?</summary><div class="mlrh-faq-answer">
Oui, le CDD est plus coûteux en raison de la prime de précarité de 10% versée au salarié à la fin du contrat (sauf exceptions). Cette prime est elle-même soumise aux cotisations sociales. Le surcoût total d'un CDD par rapport à un CDI est d'environ 10 à 15%. En revanche, les cotisations patronales de base sont strictement identiques entre CDD et CDI, et le CDD offre l'avantage de la flexibilité pour les besoins temporaires.
</div></details>
<details class="mlrh-faq-item"><summary class="mlrh-faq-question">La mutuelle d'entreprise est-elle obligatoire ?</summary><div class="mlrh-faq-answer">
Oui, depuis le 1er janvier 2016, tout employeur du secteur privé doit proposer une complémentaire santé à l'ensemble de ses salariés. L'employeur doit financer au minimum 50% de la cotisation. Le contrat doit respecter un panier de soins minimal défini par la loi. La part patronale de la mutuelle est déductible de l'assiette de l'impôt sur les sociétés et bénéficie d'une exonération partielle de cotisations sociales, ce qui en fait un avantage fiscalement avantageux pour l'entreprise.
</div></details>
</div>
<div class="cta-box">
<h3>Optimisez la gestion de votre masse salariale</h3>
<p>Trouvez le logiciel de paie adapté à votre PME en 2 minutes.</p>
<div class="cta-buttons">
<a class="btn btn-orange" href="/trouver-mon-logiciel.html">Trouver mon logiciel</a>
<a class="btn btn-secondary" href="/outils/" style="background:rgba(255,255,255,.1);color:white;border-color:rgba(255,255,255,.3)">Tous nos outils RH</a>
</div>
</div>
</section>
