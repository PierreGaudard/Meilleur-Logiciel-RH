(function() {
    // ==========================================
    // Simulateur cout d'un salarie - France 2026
    // Donnees URSSAF officielles
    // ==========================================

    var SMIC_MENSUEL = 1802; // SMIC brut mensuel 35h (11,88 EUR x 151,67h)
    var PASS_MENSUEL = 3864; // Plafond Securite sociale mensuel 2025

    // References DOM
    var brutInput = document.getElementById('salaire-brut');
    var statutSelect = document.getElementById('statut');
    var contratSelect = document.getElementById('contrat');
    var tailleSelect = document.getElementById('taille');
    var tauxATInput = document.getElementById('taux-at');
    var mutuelleInput = document.getElementById('mutuelle');
    var ticketsInput = document.getElementById('tickets');
    var transportInput = document.getElementById('transport');

    var resBrut = document.getElementById('res-brut');
    var resCotis = document.getElementById('res-cotis');
    var resCotisPct = document.getElementById('res-cotis-pct');
    var rowFillon = document.getElementById('row-fillon');
    var resFillon = document.getElementById('res-fillon');
    var resFillonPct = document.getElementById('res-fillon-pct');
    var resCotisNettes = document.getElementById('res-cotis-nettes');
    var resMutuelle = document.getElementById('res-mutuelle');
    var resTickets = document.getElementById('res-tickets');
    var resTransport = document.getElementById('res-transport');
    var rowPrecarite = document.getElementById('row-precarite');
    var resPrecarite = document.getElementById('res-precarite');
    var resTotalMensuel = document.getElementById('res-total-mensuel');
    var resTotalAnnuel = document.getElementById('res-total-annuel');
    var resRatio = document.getElementById('res-ratio');
    var breakdownBody = document.getElementById('breakdown-body');

    function formatMoney(n) {
      return Math.round(n).toLocaleString('fr-FR') + ' \u20AC';
    }

    function calculate() {
      var brut = parseFloat(brutInput.value) || 0;
      var resultsDiv = document.getElementById('calc-results');
      if (brut <= 0 || isNaN(brut)) {
        resultsDiv.style.display = 'none';
        return;
      }
      resultsDiv.style.display = '';

      var statut = statutSelect.value;
      var contrat = contratSelect.value;
      var taille = tailleSelect.value;
      var tauxAT = (parseFloat(tauxATInput.value) || 1.28) / 100;
      var mutuelle = parseFloat(mutuelleInput.value) || 0;
      var tickets = parseFloat(ticketsInput.value) || 0;
      var transport = parseFloat(transportInput.value) || 0;

      // Determiner taille pour les taux variables
      var isGrande = (taille === 'grande');
      var isPetite = (taille === 'petite');

      // Bases de calcul
      var baseT1 = Math.min(brut, PASS_MENSUEL);
      var baseT2 = Math.max(0, brut - PASS_MENSUEL);
      var base4PASS = Math.min(brut, PASS_MENSUEL * 4);

      // ---- Cotisations patronales detaillees ----
      var details = [];

      // Assurance maladie
      var tauxMaladie = (brut <= 2.5 * SMIC_MENSUEL) ? 0.07 : 0.13;
      var cotMaladie = brut * tauxMaladie;
      details.push({nom: 'Assurance maladie', taux: (tauxMaladie * 100).toFixed(2) + '%', base: brut, montant: cotMaladie});

      // Allocations familiales
      var tauxAF = (brut <= 3.5 * SMIC_MENSUEL) ? 0.0345 : 0.0525;
      var cotAF = brut * tauxAF;
      details.push({nom: 'Allocations familiales', taux: (tauxAF * 100).toFixed(2) + '%', base: brut, montant: cotAF});

      // Vieillesse plafonnee
      var cotVieillesseP = baseT1 * 0.0855;
      details.push({nom: 'Vieillesse plafonnée', taux: '8,55%', base: baseT1, montant: cotVieillesseP});

      // Vieillesse deplafonnee
      var cotVieillesseDP = brut * 0.0202;
      details.push({nom: 'Vieillesse déplafonnée', taux: '2,02%', base: brut, montant: cotVieillesseDP});

      // AT/MP
      var cotAT = brut * tauxAT;
      details.push({nom: 'Accidents du travail', taux: (tauxAT * 100).toFixed(2) + '%', base: brut, montant: cotAT});

      // Chomage
      var cotChomage = base4PASS * 0.0405;
      details.push({nom: 'Assurance chômage', taux: '4,05%', base: base4PASS, montant: cotChomage});

      // AGS
      var cotAGS = base4PASS * 0.0020;
      details.push({nom: 'AGS', taux: '0,20%', base: base4PASS, montant: cotAGS});

      // FNAL
      var tauxFNAL, baseFNAL;
      if (isGrande) {
        tauxFNAL = 0.0050;
        baseFNAL = brut;
      } else {
        tauxFNAL = 0.0010;
        baseFNAL = baseT1;
      }
      var cotFNAL = baseFNAL * tauxFNAL;
      details.push({nom: 'FNAL', taux: (tauxFNAL * 100).toFixed(2) + '%', base: baseFNAL, montant: cotFNAL});

      // CSA
      var cotCSA = brut * 0.003;
      details.push({nom: 'Solidarité autonomie (CSA)', taux: '0,30%', base: brut, montant: cotCSA});

      // Retraite complementaire T1
      var cotRetraiteT1 = baseT1 * 0.0472;
      details.push({nom: 'AGIRC-ARRCO T1', taux: '4,72%', base: baseT1, montant: cotRetraiteT1});

      // Retraite complementaire T2 (cadre ou si brut > PASS)
      var cotRetraiteT2 = 0;
      if (statut === 'cadre' || baseT2 > 0) {
        cotRetraiteT2 = baseT2 * 0.1295;
        if (cotRetraiteT2 > 0) {
          details.push({nom: 'AGIRC-ARRCO T2', taux: '12,95%', base: baseT2, montant: cotRetraiteT2});
        }
      }

      // CEG T1
      var cotCEG1 = baseT1 * 0.0129;
      details.push({nom: 'CEG tranche 1', taux: '1,29%', base: baseT1, montant: cotCEG1});

      // CEG T2
      var cotCEG2 = 0;
      if (statut === 'cadre' || baseT2 > 0) {
        cotCEG2 = baseT2 * 0.0162;
        if (cotCEG2 > 0) {
          details.push({nom: 'CEG tranche 2', taux: '1,62%', base: baseT2, montant: cotCEG2});
        }
      }

      // Formation
      var tauxFormation = isPetite ? 0.0055 : 0.01;
      var cotFormation = brut * tauxFormation;
      details.push({nom: 'Contribution formation', taux: (tauxFormation * 100).toFixed(2) + '%', base: brut, montant: cotFormation});

      // Taxe apprentissage
      var cotApprentissage = brut * 0.0068;
      details.push({nom: 'Taxe d\'apprentissage', taux: '0,68%', base: brut, montant: cotApprentissage});

      // Effort construction
      var cotConstruction = 0;
      if (isGrande) {
        cotConstruction = brut * 0.0045;
        details.push({nom: 'Effort construction', taux: '0,45%', base: brut, montant: cotConstruction});
      }

      // APEC (cadres uniquement)
      var cotAPEC = 0;
      if (statut === 'cadre') {
        cotAPEC = base4PASS * 0.00036;
        details.push({nom: 'APEC', taux: '0,036%', base: base4PASS, montant: cotAPEC});
      }

      // Total cotisations brutes
      var totalCotis = 0;
      for (var i = 0; i < details.length; i++) {
        totalCotis += details[i].montant;
      }

      // ---- Reduction Fillon ----
      var reductionFillon = 0;
      if (brut > 0 && brut < 1.6 * SMIC_MENSUEL && statut !== 'apprenti') {
        var T = isGrande ? 0.3246 : 0.3206;
        var coeff = (T / 0.6) * (1.6 * SMIC_MENSUEL / brut - 1);
        coeff = Math.max(0, Math.min(coeff, T));
        reductionFillon = coeff * brut;
      }

      // Apprenti : exoneration specifique
      if (statut === 'apprenti') {
        // Aide employeur et exonerations specifiques
        // Simplification : exoneration sur base SMIC
        var seuilApprentis = 0.79 * SMIC_MENSUEL;
        if (brut <= seuilApprentis) {
          reductionFillon = totalCotis * 0.80; // exoneration quasi-totale
        } else {
          reductionFillon = totalCotis * 0.50;
        }
      }

      var cotisNettes = totalCotis - reductionFillon;

      // Prime precarite CDD
      var precarite = 0;
      if (contrat === 'cdd') {
        precarite = brut * 0.10;
      }

      // Cout total
      var coutTotal = brut + cotisNettes + mutuelle + tickets + transport + precarite;
      var coutAnnuel = coutTotal * 12;
      var ratio = brut > 0 ? (coutTotal / brut) : 0;

      // ---- Afficher les resultats ----
      resBrut.textContent = formatMoney(brut);
      resCotisPct.textContent = brut > 0 ? (totalCotis / brut * 100).toFixed(1) + '%' : '-';
      resCotis.textContent = formatMoney(totalCotis);

      if (reductionFillon > 0) {
        rowFillon.style.display = '';
        resFillon.textContent = '- ' + formatMoney(reductionFillon);
        resFillonPct.textContent = brut > 0 ? '-' + (reductionFillon / brut * 100).toFixed(1) + '%' : '';
      } else {
        rowFillon.style.display = 'none';
      }

      resCotisNettes.textContent = formatMoney(cotisNettes);
      resMutuelle.textContent = formatMoney(mutuelle);
      resTickets.textContent = formatMoney(tickets);
      resTransport.textContent = formatMoney(transport);

      if (contrat === 'cdd') {
        rowPrecarite.style.display = '';
        resPrecarite.textContent = formatMoney(precarite);
      } else {
        rowPrecarite.style.display = 'none';
      }

      resTotalMensuel.textContent = formatMoney(coutTotal);
      resTotalAnnuel.textContent = formatMoney(coutAnnuel);
      resRatio.textContent = ratio.toFixed(2) + 'x le brut';

      // ---- Tableau detail ----
      var html = '';
      for (var j = 0; j < details.length; j++) {
        var d = details[j];
        html += '<tr><td>' + d.nom + '</td><td>' + d.taux + '</td><td>' + formatMoney(d.base) + '</td><td>' + formatMoney(d.montant) + '</td></tr>';
      }
      html += '<tr class="total-row"><td>Total cotisations brutes</td><td></td><td></td><td>' + formatMoney(totalCotis) + '</td></tr>';
      if (reductionFillon > 0) {
        html += '<tr style="color:#15803d;font-weight:600"><td>Réduction générale (Fillon)</td><td></td><td></td><td>- ' + formatMoney(reductionFillon) + '</td></tr>';
        html += '<tr class="total-row"><td>Cotisations nettes</td><td></td><td></td><td>' + formatMoney(cotisNettes) + '</td></tr>';
      }
      breakdownBody.innerHTML = html;
    }

    // Evenements
    var inputs = [brutInput, statutSelect, contratSelect, tailleSelect, tauxATInput, mutuelleInput, ticketsInput, transportInput];
    for (var k = 0; k < inputs.length; k++) {
      inputs[k].addEventListener('input', calculate);
      inputs[k].addEventListener('change', calculate);
    }

    // Calcul initial
    calculate();
  })();

  // Toggle breakdown
  function toggleBreakdown() {
    var wrap = document.getElementById('breakdown-wrap');
    wrap.classList.toggle('visible');
    var btn = document.getElementById('btn-detail');
    if (wrap.classList.contains('visible')) {
      btn.textContent = 'Masquer le détail des charges';
    } else {
      btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg> Voir le détail des charges patronales';
    }
  }

  // FAQ toggle
  function toggleFaq(el) {
    var item = el.closest('.faq-item');
    var isOpen = item.classList.contains('open');
    var allItems = document.querySelectorAll('.faq-item.open');
    for (var i = 0; i < allItems.length; i++) {
      allItems[i].classList.remove('open');
    }
    if (!isOpen) item.classList.add('open');
  }

  // Burger menu
  (function(){
    var burger = document.querySelector('.nav-burger');
    var nav = document.querySelector('.site-nav');
    if(!burger || !nav) return;
    burger.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function(e){
      if(!burger.contains(e.target) && !nav.contains(e.target)){
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  })();
