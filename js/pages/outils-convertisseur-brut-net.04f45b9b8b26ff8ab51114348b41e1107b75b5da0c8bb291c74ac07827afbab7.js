(function() {
    // ======================================
    // Convertisseur brut/net - France 2026
    // ======================================

    // DOM refs
    var brutInput     = document.getElementById('salaire-brut');
    var statutSelect  = document.getElementById('statut');
    var tempsSelect   = document.getElementById('temps-travail');
    var partialWrap   = document.getElementById('partial-hours-wrap');
    var partialInput  = document.getElementById('heures-partiel');
    var heuresSupInput= document.getElementById('heures-sup');
    var tauxPasSelect = document.getElementById('taux-pas');
    var btnCalculer   = document.getElementById('btn-calculer');
    var resultsDiv    = document.getElementById('calc-results');

    // Result refs
    var resBrut       = document.getElementById('res-brut');
    var resCotisPct   = document.getElementById('res-cotis-pct');
    var resCotis      = document.getElementById('res-cotis');
    var resNetAvant   = document.getElementById('res-net-avant');
    var resPas        = document.getElementById('res-pas');
    var resNetApres   = document.getElementById('res-net-apres');
    var resNetAnnuel  = document.getElementById('res-net-annuel');
    var resEmpPct     = document.getElementById('res-emp-pct');
    var resCoutEmp    = document.getElementById('res-cout-employeur');

    // Taux de cotisations salariales 2026 (estimations basees sur les taux officiels)
    var TAUX = {
      'non-cadre': 0.22,
      'cadre': 0.25,
      'public': 0.17,
      'apprenti': 0,
      'stage': 0
    };

    // Taux patronaux (pour cout employeur)
    var TAUX_PATRONAL = {
      'non-cadre': 0.42,
      'cadre': 0.45,
      'public': 0.75,
      'apprenti': 0.30,
      'stage': 0
    };

    // Seuils
    var SMIC_BRUT_MENSUEL = 1802;
    var SEUIL_APPRENTI = Math.round(SMIC_BRUT_MENSUEL * 0.79);  // ~1424
    var SEUIL_STAGE = 660; // gratification mensuelle exoneree

    // Taux horaire moyen pour heures sup (base 151.67h/mois)
    var HEURES_BASE_MENSUEL = 151.67;
    var MAJORATION_HS = 1.25; // 25% de majoration
    var EXONERATION_HS_COTIS = 0.1131; // 11.31%

    function formatMoney(n) {
      if (isNaN(n) || n === null) return '-';
      var s = Math.round(n).toString();
      var result = '';
      var count = 0;
      for (var i = s.length - 1; i >= 0; i--) {
        if (s[i] === '-') { result = '-' + result; continue; }
        if (count > 0 && count % 3 === 0) result = ' ' + result;
        result = s[i] + result;
        count++;
      }
      return result + ' \u20AC';
    }

    function calculate() {
      var brut = parseFloat(brutInput.value) || 0;
      var statut = statutSelect.value;
      var temps = tempsSelect.value;
      var heuresPartiel = parseFloat(partialInput.value) || 28;
      var heuresSup = parseFloat(heuresSupInput.value) || 0;
      var tauxPas = parseFloat(tauxPasSelect.value) / 100;

      if (brut <= 0) {
        resultsDiv.classList.remove('visible');
        return;
      }

      // Ajuster pour temps partiel
      var coeffTemps = 1;
      if (temps === 'partiel' && heuresPartiel > 0 && heuresPartiel < 35) {
        coeffTemps = heuresPartiel / 35;
      }

      // Brut effectif (le brut saisi represente deja le brut du temps choisi)
      var brutEffectif = brut;

      // Calcul heures sup : brut horaire * majoration * nb heures
      var brutHoraire = brutEffectif / (HEURES_BASE_MENSUEL * coeffTemps);
      var brutHS = heuresSup * brutHoraire * MAJORATION_HS;

      // Total brut
      var totalBrut = brutEffectif + brutHS;

      // Cotisations selon statut
      var tauxCotis = TAUX[statut] || 0.22;
      var tauxPatronal = TAUX_PATRONAL[statut] || 0.42;

      // Cas speciaux
      var cotisationsBase = 0;
      var cotisationsHS = 0;

      if (statut === 'apprenti') {
        // Exoneration totale sous 79% SMIC
        if (brutEffectif <= SEUIL_APPRENTI) {
          cotisationsBase = 0;
          tauxCotis = 0;
        } else {
          // Au-dessus du seuil, cotisations normales sur la difference
          cotisationsBase = (brutEffectif - SEUIL_APPRENTI) * TAUX['non-cadre'];
          tauxCotis = cotisationsBase / brutEffectif;
        }
      } else if (statut === 'stage') {
        // Gratification exoneree sous le seuil
        if (brutEffectif <= SEUIL_STAGE) {
          cotisationsBase = 0;
          tauxCotis = 0;
        } else {
          cotisationsBase = (brutEffectif - SEUIL_STAGE) * TAUX['non-cadre'];
          tauxCotis = cotisationsBase / brutEffectif;
        }
      } else {
        cotisationsBase = brutEffectif * tauxCotis;
      }

      // Cotisations sur heures sup : exoneration de 11.31%
      if (heuresSup > 0 && brutHS > 0) {
        var tauxEffectifHS = Math.max(0, tauxCotis - EXONERATION_HS_COTIS);
        cotisationsHS = brutHS * tauxEffectifHS;
      }

      var totalCotisations = cotisationsBase + cotisationsHS;
      var tauxEffectifTotal = totalBrut > 0 ? totalCotisations / totalBrut : 0;

      // Net avant impot
      var netAvantImpot = totalBrut - totalCotisations;

      // PAS
      var montantPAS = netAvantImpot * tauxPas;

      // Net apres impot
      var netApresImpot = netAvantImpot - montantPAS;

      // Annuel
      var netAnnuel = netAvantImpot * 12;

      // Cout employeur
      var coutEmployeur = totalBrut * (1 + tauxPatronal);

      // Afficher les resultats
      resultsDiv.classList.add('visible');

      resBrut.textContent = formatMoney(totalBrut);
      resCotisPct.textContent = (tauxEffectifTotal * 100).toFixed(1) + ' %';
      resCotis.textContent = '- ' + formatMoney(totalCotisations);
      resNetAvant.textContent = formatMoney(netAvantImpot);
      resPas.textContent = tauxPas > 0 ? '- ' + formatMoney(montantPAS) : '0 \u20AC';
      resNetApres.textContent = formatMoney(netApresImpot);
      resNetAnnuel.textContent = formatMoney(netAnnuel);
      resEmpPct.textContent = '+' + Math.round(tauxPatronal * 100) + ' % charges';
      resCoutEmp.textContent = formatMoney(coutEmployeur) + ' / mois';
    }

    // Show/hide partial hours
    tempsSelect.addEventListener('change', function() {
      if (tempsSelect.value === 'partiel') {
        partialWrap.classList.add('visible');
      } else {
        partialWrap.classList.remove('visible');
      }
      calculate();
    });

    // Real-time calculation on any input change
    brutInput.addEventListener('input', calculate);
    statutSelect.addEventListener('change', calculate);
    partialInput.addEventListener('input', calculate);
    heuresSupInput.addEventListener('input', calculate);
    tauxPasSelect.addEventListener('change', calculate);
    btnCalculer.addEventListener('click', calculate);

    // Don't auto-calculate on load - wait for user input
    // calculate();
  })();

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
