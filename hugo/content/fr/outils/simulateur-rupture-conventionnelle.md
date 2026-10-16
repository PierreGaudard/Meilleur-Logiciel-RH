---
title: "Simulateur rupture conventionnelle 2026"
seoTitle: "Simulateur rupture conventionnelle 2026 : calcul gratuit"
description: "Calculez gratuitement votre indemnité de rupture conventionnelle 2026. Simulateur conforme au Code du travail (art. L1234-9). Ancienneté, salaire de référence, fiscalité."
lastmod: "2026-10-15T16:49:03+02:00"
css: "outils-simulateur-rupture-conventionnelle"
js:
  - "outils-simulateur-rupture-conventionnelle"
jsonldExtra:
  - "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"L'employeur peut-il refuser une rupture conventionnelle ?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Oui. La rupture conventionnelle repose sur le consentement mutuel du salarié et de l'employeur. Aucune des deux parties ne peut imposer une rupture conventionnelle à l'autre. L'employeur est libre de refuser sans avoir à justifier sa décision. En cas de refus, le salarié peut renouveler sa demande ultérieurement ou envisager une démission.\"}}, {\"@type\": \"Question\", \"name\": \"Peut-on négocier plus que le minimum légal ?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Oui, l'indemnité légale constitue un plancher. En pratique, il est courant de négocier une indemnité supra-légale, notamment si l'initiative vient de l'employeur. Les montants négociés atteignent souvent entre 1 et 3 mois de salaire supplémentaires selon le contexte et le rapport de force.\"}}, {\"@type\": \"Question\", \"name\": \"Quel est le délai de rétractation ?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Après la signature de la convention, chaque partie dispose d'un délai de rétractation de 15 jours calendaires. Ce délai commence le lendemain de la date de signature. Pendant cette période, le salarié comme l'employeur peut revenir sur sa décision sans avoir à motiver son choix.\"}}, {\"@type\": \"Question\", \"name\": \"La rupture conventionnelle ouvre-t-elle droit au chômage ?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Oui. Contrairement à la démission, la rupture conventionnelle ouvre droit à l'allocation d'aide au retour à l'emploi (ARE) versée par France Travail, sous réserve de remplir les conditions d'affiliation (avoir travaillé au moins 6 mois au cours des 24 derniers mois).\"}}, {\"@type\": \"Question\", \"name\": \"L'ancienneté inclut-elle les périodes de congé parental ?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"La période de congé parental d'éducation est prise en compte pour moitié dans le calcul de l'ancienneté du salarié, conformément à l'article L1225-54 du Code du travail. Par exemple, 2 ans de congé parental comptent pour 1 an d'ancienneté.\"}}]}"
  - "{\"@context\": \"https://schema.org\", \"@type\": \"WebApplication\", \"name\": \"Simulateur rupture conventionnelle 2026\", \"url\": \"https://meilleur-logiciel-rh.fr/outils/simulateur-rupture-conventionnelle.html\", \"applicationCategory\": \"FinanceApplication\", \"operatingSystem\": \"Web\", \"offers\": {\"@type\": \"Offer\", \"price\": \"0\", \"priceCurrency\": \"EUR\"}, \"description\": \"Calculez gratuitement votre indemnité de rupture conventionnelle 2026. Conforme au Code du travail (art. L1234-9 et R1234-2).\", \"inLanguage\": \"fr-FR\", \"publisher\": {\"@type\": \"Organization\", \"name\": \"MLRH\", \"url\": \"https://meilleur-logiciel-rh.fr\"}}"
---

Calculez gratuitement le montant minimum de votre indemnité de rupture conventionnelle. Conforme au Code du travail (art. L1234-9 et R1234-2).

<section class="calc-section">
<div class="calc-card">
<div class="calc-header">
<h2>Calculez votre indemnité</h2>
<p>Renseignez les informations ci-dessous pour obtenir une estimation précise</p>
</div>
<div class="calc-body">
<div class="calc-grid">
<div class="calc-field">
<label for="date-entree">Date d'entrée dans l'entreprise</label>
<input id="date-entree" required="" type="date"/>
</div>
<div class="calc-field">
<label for="date-rupture">Date de rupture envisagée</label>
<input id="date-rupture" required="" type="date"/>
</div>
<div class="calc-field">
<label for="salaire-12">Salaire brut mensuel moyen <span class="label-hint">(12 derniers mois)</span></label>
<div class="input-euro">
<input id="salaire-12" min="0" placeholder="Ex : 2800" required="" step="0.01" type="number"/>
</div>
</div>
<div class="calc-field">
<label for="salaire-3">Salaire brut mensuel moyen <span class="label-hint">(3 derniers mois, si plus favorable)</span></label>
<div class="input-euro">
<input id="salaire-3" min="0" placeholder="Ex : 3000" step="0.01" type="number"/>
</div>
</div>
<div class="calc-field full-width">
<label for="primes">Primes exceptionnelles perçues ces 12 derniers mois <span class="label-hint">(facultatif)</span></label>
<div class="input-euro">
<input id="primes" min="0" placeholder="Ex : 1500" step="0.01" type="number"/>
</div>
</div>
</div>
<div class="calc-btn-wrap">
<button class="calc-btn" id="btn-calculer" type="button">Calculer mon indemnité</button>
</div>
<div class="calc-results" id="results">
<div class="results-body" style="padding:28px">
<div style="background:var(--primary-light);border-radius:12px;padding:28px;text-align:center;margin-bottom:20px">
<div style="font-size:.85rem;font-weight:600;color:var(--primary-dark);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Indemnité de rupture conventionnelle</div>
<div id="res-indemnite" style="font-size:2.4rem;font-weight:900;color:var(--primary-dark)">--</div>
<div style="font-size:.85rem;color:var(--text-muted);margin-top:8px">montant minimum légal</div>
</div>
<div style="text-align:center;margin-bottom:20px">
<button class="calc-btn" id="btn-toggle-detail" onclick="toggleDetail()" style="background:var(--bg);color:var(--text);border:1px solid var(--border);font-size:.88rem;padding:10px 24px;font-weight:600" type="button">Voir le détail <svg fill="none" height="14" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-left:4px" viewbox="0 0 24 24" width="14"><path d="M6 9l6 6 6-6"></path></svg></button>
</div>
<div id="detail-section" style="display:none">
<div class="results-details">
<div class="result-row">
<span class="result-label">Ancienneté calculée</span>
<span class="result-value" id="res-anciennete">--</span>
</div>
<div class="result-row">
<span class="result-label">Salaire de référence retenu</span>
<span class="result-value" id="res-salaire-ref">--</span>
</div>
<div class="result-row">
<span class="result-label">Méthode de calcul retenue</span>
<span class="result-value" id="res-methode">--</span>
</div>
<div class="result-row">
<span class="result-label">Détail du calcul</span>
<span class="result-value" id="res-detail">--</span>
</div>
</div>
<div class="result-fiscal" id="res-fiscal">
<h4>Régime fiscal et social</h4>
<p id="res-fiscal-text"></p>
<p id="res-social-text"></p>
</div>
<div class="result-note">
<p>Ce simulateur calcule l'indemnité légale minimum. Votre convention collective peut prévoir un montant plus favorable. L'indemnité négociée entre les parties peut également être supérieure au minimum légal.</p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section class="seo-content">
<h2>Comment est calculée l'indemnité de rupture conventionnelle ?</h2>
<p>L'indemnité de rupture conventionnelle constitue une somme versée par l'employeur au salarié lors de la rupture d'un commun accord du contrat de travail à durée indéterminée (CDI). Son montant ne peut pas être inférieur à celui de l'indemnité légale de licenciement, tel que le prévoit l'article L1237-13 du Code du travail.</p>
<p>Le calcul repose sur deux paramètres fondamentaux : l'ancienneté du salarié dans l'entreprise et son salaire de référence. Contrairement à une idée reçue, la formule n'est pas arbitraire : elle est strictement encadrée par les articles L1234-9 et R1234-2 du Code du travail.</p>
<h3>La formule légale</h3>
<p>Depuis le 27 septembre 2017, l'indemnité légale de licenciement (qui sert de plancher à la rupture conventionnelle) se calcule comme suit :</p>
<ul>
<li><strong>1/4 de mois de salaire par année d'ancienneté</strong> pour les 10 premières années</li>
<li><strong>1/3 de mois de salaire par année d'ancienneté</strong> pour chaque année au-delà de 10 ans</li>
</ul>
<p>Les années incomplètes sont prises en compte au prorata du nombre de mois travaillés. Un salarié ayant 7 ans et 4 mois d'ancienneté verra ses 4 mois supplémentaires valorisés à hauteur de 4/12e d'année.</p>
<h3>Le salaire de référence</h3>
<p>Le salaire de référence correspond au montant le plus favorable pour le salarié entre deux modes de calcul :</p>
<ol>
<li><strong>La moyenne mensuelle des 12 derniers mois</strong> précédant la notification de la rupture. Ce calcul inclut toutes les primes et gratifications, y compris les primes exceptionnelles, les primes d'ancienneté et la part variable du salaire.</li>
<li><strong>La moyenne mensuelle des 3 derniers mois</strong> précédant la rupture. Dans ce cas, les primes annuelles ou exceptionnelles versées pendant cette période sont prises en compte au prorata (rapportées à une base de 3 mois sur 12). Par exemple, un treizième mois de 3 000 euros sera intégré à hauteur de 750 euros (3 000 x 3/12) dans le calcul sur 3 mois.</li>
</ol>
<p>L'employeur et le salarié doivent retenir la méthode la plus avantageuse. Dans la grande majorité des cas, c'est la méthode des 12 derniers mois qui prévaut, sauf lorsque le salarié a bénéficié d'augmentations récentes ou de primes significatives sur les derniers mois.</p>
<div class="info-box">
<p><strong>Attention :</strong> si votre convention collective prévoit une indemnité plus favorable que l'indemnité légale, c'est le montant conventionnel qui s'applique. Vérifiez toujours votre convention collective avant de négocier.</p>
</div>
<h2>Exemple concret de calcul</h2>
<p>Prenons le cas de Marie, salariée dans une PME depuis 7 ans et 4 mois, avec un salaire brut mensuel moyen de 2 800 euros sur les 12 derniers mois. Son salaire moyen sur les 3 derniers mois est de 2 900 euros (une prime de performance a été versée récemment). Elle a par ailleurs reçu une prime exceptionnelle de 1 200 euros au cours des 12 derniers mois.</p>
<h3>Étape 1 : déterminer le salaire de référence</h3>
<p><strong>Méthode 1 -- Moyenne des 12 derniers mois :</strong> le salaire de référence est de 2 800 euros (toutes primes incluses dans la moyenne).</p>
<p><strong>Méthode 2 -- Moyenne des 3 derniers mois :</strong> le salaire de base moyen est de 2 900 euros. Il faut y ajouter le prorata des primes annuelles : 1 200 euros x 3/12 = 300 euros, soit 2 900 + (300 / 3) = 3 000 euros. On divise les 300 euros par 3 mois car on les répartit sur la période de référence de 3 mois.</p>
<p>Le salaire de référence le plus favorable est donc celui de la méthode 2 : <strong>3 000 euros</strong>.</p>
<h3>Étape 2 : calculer l'ancienneté en années et mois</h3>
<p>Marie dispose de 7 ans et 4 mois d'ancienneté, soit 7 + 4/12 = <strong>7,333 années</strong>.</p>
<h3>Étape 3 : appliquer la formule</h3>
<p>Comme son ancienneté est inférieure à 10 ans, seul le taux de 1/4 s'applique :</p>
<p><strong>Indemnité = (1/4) x 3 000 x 7,333 = 5 500 euros</strong></p>
<p>Marie peut donc prétendre à une indemnité légale minimum de 5 500 euros brut. En pratique, elle pourra négocier un montant supérieur selon le contexte de la rupture et sa capacité de négociation.</p>
<h2>Tableau des indemnités selon l'ancienneté</h2>
<p>Le tableau ci-dessous présente le montant de l'indemnité légale de rupture conventionnelle pour un salaire de référence de 2 500 euros brut mensuel, selon l'ancienneté du salarié :</p>
<div class="seo-table-wrap">
<table class="seo-table">
<thead>
<tr>
<th>Ancienneté</th>
<th>Calcul</th>
<th>Indemnité légale minimum</th>
</tr>
</thead>
<tbody>
<tr>
<td>1 an</td>
<td>1/4 x 2 500 x 1</td>
<td><strong>625 euros</strong></td>
</tr>
<tr>
<td>2 ans</td>
<td>1/4 x 2 500 x 2</td>
<td><strong>1 250 euros</strong></td>
</tr>
<tr>
<td>3 ans</td>
<td>1/4 x 2 500 x 3</td>
<td><strong>1 875 euros</strong></td>
</tr>
<tr>
<td>5 ans</td>
<td>1/4 x 2 500 x 5</td>
<td><strong>3 125 euros</strong></td>
</tr>
<tr>
<td>7 ans</td>
<td>1/4 x 2 500 x 7</td>
<td><strong>4 375 euros</strong></td>
</tr>
<tr>
<td>10 ans</td>
<td>1/4 x 2 500 x 10</td>
<td><strong>6 250 euros</strong></td>
</tr>
<tr>
<td>15 ans</td>
<td>(1/4 x 2 500 x 10) + (1/3 x 2 500 x 5)</td>
<td><strong>10 417 euros</strong></td>
</tr>
<tr>
<td>20 ans</td>
<td>(1/4 x 2 500 x 10) + (1/3 x 2 500 x 10)</td>
<td><strong>14 583 euros</strong></td>
</tr>
</tbody>
</table>
</div>
<p>Ces montants correspondent à l'indemnité légale minimum. L'indemnité effectivement versée peut être supérieure si la convention collective du secteur prévoit un calcul plus avantageux ou si les parties négocient un montant supra-légal.</p>
<h2>Fiscalité de l'indemnité de rupture conventionnelle</h2>
<p>Le régime fiscal de l'indemnité de rupture conventionnelle est un sujet complexe qui mérite une attention particulière. En effet, selon le montant perçu et la situation du salarié, l'indemnité peut être totalement exonérée d'impôt sur le revenu ou partiellement soumise à imposition.</p>
<h3>Exonération d'impôt sur le revenu</h3>
<p>L'indemnité de rupture conventionnelle est exonérée d'impôt sur le revenu dans la limite du plus élevé des trois plafonds suivants :</p>
<ul>
<li>Le montant de l'indemnité légale ou conventionnelle de licenciement</li>
<li>Le double de la rémunération annuelle brute perçue au cours de l'année civile précédant la rupture</li>
<li>La moitié du montant total de l'indemnité versée</li>
</ul>
<p>En tout état de cause, la fraction exonérée ne peut excéder un plafond global fixé à <strong>6 fois le plafond annuel de la Sécurité sociale (PASS)</strong>. Pour 2026, ce plafond représente une somme significative qui couvre la très grande majorité des indemnités versées aux salariés.</p>
<p>En pratique, pour la plupart des salariés, l'indemnité de rupture conventionnelle est intégralement exonérée d'impôt sur le revenu lorsqu'elle ne dépasse pas le montant prévu par la loi ou la convention collective.</p>
<h3>Régime social : cotisations et CSG/CRDS</h3>
<p>Sur le plan des cotisations sociales, le traitement est le suivant :</p>
<ul>
<li><strong>La fraction exonérée d'impôt</strong> est également exonérée de cotisations de Sécurité sociale, dans la limite de 2 fois le PASS.</li>
<li><strong>La CSG et la CRDS</strong> sont dues sur la fraction de l'indemnité dépassant le montant de l'indemnité légale ou conventionnelle, avec un abattement possible.</li>
<li><strong>Au-delà de 2 fois le PASS</strong>, l'intégralité de l'indemnité est soumise à cotisations sociales dès le premier euro.</li>
</ul>
<p>Il est important de distinguer la situation du salarié qui ne remplit pas les conditions pour bénéficier d'une retraite à taux plein : dans ce cas, les exonérations décrites ci-dessus s'appliquent pleinement. En revanche, si le salarié est en droit de liquider sa pension de retraite, l'indemnité de rupture conventionnelle est intégralement soumise à cotisations sociales et à impôt sur le revenu.</p>
<div class="info-box">
<p><strong>Conseil :</strong> si votre indemnité négociée est significativement supérieure au minimum légal, faites-vous accompagner par un expert-comptable ou un avocat spécialisé pour optimiser le traitement fiscal de la somme perçue.</p>
</div>
<h2>Rupture conventionnelle : vos droits au chômage</h2>
<p>L'un des principaux avantages de la rupture conventionnelle, par rapport à une démission, réside dans l'ouverture des droits au chômage. En effet, la rupture conventionnelle est considérée comme une privation involontaire d'emploi par France Travail (anciennement Pôle emploi), ce qui permet au salarié de percevoir l'allocation d'aide au retour à l'emploi (ARE).</p>
<h3>Conditions d'ouverture des droits</h3>
<p>Pour bénéficier de l'ARE après une rupture conventionnelle, le salarié doit remplir les conditions suivantes :</p>
<ul>
<li><strong>Avoir travaillé au moins 6 mois</strong> (130 jours ou 910 heures) au cours des 24 derniers mois (36 mois pour les salariés de 53 ans et plus)</li>
<li>Être inscrit comme demandeur d'emploi auprès de France Travail dans les 12 mois suivant la fin du contrat</li>
<li>Être en recherche active d'emploi et résider en France</li>
<li>Ne pas avoir atteint l'âge légal de départ à la retraite avec le nombre de trimestres requis</li>
</ul>
<h3>Le délai de carence</h3>
<p>Le versement de l'ARE ne débute pas immédiatement après la rupture du contrat. Plusieurs délais s'appliquent :</p>
<ul>
<li><strong>Un délai d'attente de 7 jours</strong>, applicable à tous les demandeurs d'emploi</li>
<li><strong>Un différé d'indemnisation congé payé</strong>, correspondant aux jours de congés payés non pris et indemnisés lors du solde de tout compte</li>
<li><strong>Un différé spécifique</strong> lié à la fraction de l'indemnité de rupture conventionnelle dépassant le minimum légal. Ce différé est calculé en divisant le montant supra-légal par le salaire journalier de référence, dans la limite de 150 jours</li>
</ul>
<p>Concrètement, si votre indemnité de rupture conventionnelle se limite au montant légal, le différé spécifique est nul et vous commencerez à percevoir l'ARE au bout de 7 jours plus le différé congés payés. En revanche, si vous avez négocié une indemnité supra-légale importante, le début de l'indemnisation peut être reporté de plusieurs semaines, voire plusieurs mois.</p>
<h3>Le montant de l'allocation</h3>
<p>Le montant de l'ARE est calculé sur la base de votre salaire journalier de référence (SJR). La formule retenue par France Travail est la suivante :</p>
<ul>
<li>57 % du SJR, ou</li>
<li>40,4 % du SJR + une partie fixe (environ 12,95 euros par jour en 2026)</li>
</ul>
<p>France Travail retient le montant le plus favorable pour le demandeur d'emploi. L'allocation journalière ne peut pas être inférieure à un montant plancher (environ 31,97 euros par jour en 2026) ni dépasser 75 % du SJR.</p>
<p>La durée d'indemnisation dépend de votre âge et de votre durée d'affiliation. Pour les salariés de moins de 53 ans, la durée maximale est généralement de 18 mois. Elle est portée à 22,5 mois pour les 53-54 ans et à 27 mois pour les 55 ans et plus.</p>
<div class="faq-section">
<h2>Questions fréquentes sur la rupture conventionnelle</h2>
<details class="mlrh-faq-item"><summary class="mlrh-faq-question">L'employeur peut-il refuser une rupture conventionnelle ?</summary><div class="mlrh-faq-answer">
<p>Oui. La rupture conventionnelle repose sur le principe du consentement mutuel. Ni le salarié ni l'employeur ne peut imposer cette procédure à l'autre partie. L'employeur est donc parfaitement en droit de refuser une demande de rupture conventionnelle, et ce sans avoir à justifier sa décision. Si tel est le cas, le salarié peut renouveler sa demande après un certain délai, ou bien envisager d'autres solutions comme la démission ou une négociation de départ. En pratique, il est recommandé de préparer sa demande en mettant en avant les avantages mutuels de la rupture conventionnelle.</p>
</div></details>
<details class="mlrh-faq-item"><summary class="mlrh-faq-question">Peut-on négocier plus que le minimum légal ?</summary><div class="mlrh-faq-answer">
<p>Absolument. L'indemnité légale constitue un plancher en dessous duquel les parties ne peuvent pas descendre, mais rien n'empêche de négocier un montant supérieur. C'est même une pratique courante, en particulier lorsque l'initiative de la rupture vient de l'employeur. Les montants négociés varient considérablement selon le contexte : rapport de force, taille de l'entreprise, motif du départ, difficulté à recruter un remplaçant, etc. En moyenne, les indemnités supra-légales représentent entre 1 et 3 mois de salaire supplémentaires, mais certains salariés obtiennent des montants bien plus élevés. Pour maximiser vos chances, documentez votre valeur ajoutée, vos réalisations et le coût de votre remplacement pour l'entreprise.</p>
</div></details>
<details class="mlrh-faq-item"><summary class="mlrh-faq-question">Quel est le délai de rétractation ?</summary><div class="mlrh-faq-answer">
<p>Après la signature de la convention de rupture, chaque partie (salarié et employeur) dispose d'un délai de rétractation de 15 jours calendaires. Ce délai court à compter du lendemain de la date de signature du formulaire de rupture conventionnelle. Pendant cette période, l'une ou l'autre des parties peut revenir sur sa décision par simple lettre recommandée avec accusé de réception ou par lettre remise en main propre contre décharge, sans avoir à motiver cette rétractation. Une fois le délai expiré sans rétractation, la demande d'homologation peut être adressée à la DREETS (ex-DIRECCTE), qui dispose alors de 15 jours ouvrables pour valider ou refuser la convention.</p>
</div></details>
<details class="mlrh-faq-item"><summary class="mlrh-faq-question">La rupture conventionnelle ouvre-t-elle droit au chômage ?</summary><div class="mlrh-faq-answer">
<p>Oui, c'est l'un des avantages majeurs de la rupture conventionnelle par rapport à la démission. Le salarié qui quitte son emploi dans le cadre d'une rupture conventionnelle est considéré comme involontairement privé d'emploi et peut donc bénéficier de l'allocation d'aide au retour à l'emploi (ARE), sous réserve de remplir les conditions d'affiliation. Il faut notamment justifier d'au moins 6 mois de travail (130 jours ou 910 heures) au cours des 24 derniers mois. L'inscription auprès de France Travail doit être effectuée rapidement après la fin du contrat. Attention cependant au différé d'indemnisation qui peut retarder le début du versement des allocations, surtout si l'indemnité négociée est nettement supérieure au minimum légal.</p>
</div></details>
<details class="mlrh-faq-item"><summary class="mlrh-faq-question">L'ancienneté inclut-elle les périodes de congé parental ?</summary><div class="mlrh-faq-answer">
<p>La réponse est nuancée. Conformément à l'article L1225-54 du Code du travail, le congé parental d'éducation est pris en compte pour moitié dans le calcul de l'ancienneté du salarié. Concrètement, si vous avez bénéficié de 2 ans de congé parental, cette période compte pour 1 an d'ancienneté. En revanche, le congé de maternité ou de paternité est intégralement pris en compte dans le calcul de l'ancienneté (il est considéré comme du temps de travail effectif). Il en va de même pour les arrêts maladie d'origine professionnelle. Pour les arrêts maladie non professionnels, la réponse dépend de votre convention collective : certaines conventions prévoient une prise en compte totale ou partielle, d'autres non.</p>
</div></details>
</div>
</section>
