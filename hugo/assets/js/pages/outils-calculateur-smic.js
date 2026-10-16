(function() {
    var SMIC_HORAIRE = 11.88;
    var TAUX_COTISATIONS_SMIC = 0.205; // ~20.5% cotisations salariales non-cadre SMIC
    var TAUX_COTISATIONS_HS = 0.092;   // cotisations reduites sur HS (CSG/CRDS uniquement, exoneration ~11.31%)

    var inputHeures = document.getElementById('heures-semaine');
    var inputHS = document.getElementById('heures-sup');
    var selectMajoration = document.getElementById('majoration-sup');

    var resHoraire = document.getElementById('res-horaire');
    var resMensuelBrut = document.getElementById('res-mensuel-brut');
    var resHSBrut = document.getElementById('res-hs-brut');
    var resTotalBrut = document.getElementById('res-total-brut');
    var resCotisations = document.getElementById('res-cotisations');
    var resMensuelNet = document.getElementById('res-mensuel-net');
    var resAnnuelBrut = document.getElementById('res-annuel-brut');
    var resAnnuelNet = document.getElementById('res-annuel-net');

    function formatMoney(n) {
      var parts = n.toFixed(2).split('.');
      var intPart = parts[0];
      var decPart = parts[1];
      var formatted = '';
      var count = 0;
      for (var i = intPart.length - 1; i >= 0; i--) {
        if (count > 0 && count % 3 === 0 && intPart[i] !== '-') {
          formatted = '\u00a0' + formatted;
        }
        formatted = intPart[i] + formatted;
        count++;
      }
      return formatted + ',' + decPart + ' \u20ac';
    }

    function calculate() {
      document.getElementById('smic-results').style.display = 'grid';
      var heures = parseFloat(inputHeures.value) || 35;
      var hsSemaine = parseFloat(inputHS.value) || 0;
      var majorationType = selectMajoration.value;

      // Clamp values
      if (heures < 1) heures = 1;
      if (heures > 48) heures = 48;
      if (hsSemaine < 0) hsSemaine = 0;
      if (heures + hsSemaine > 48) hsSemaine = 48 - heures;

      // Monthly base hours (mensualisation)
      var heuresMensuelles = heures * 52 / 12;

      // Base monthly gross
      var mensuelBrut = SMIC_HORAIRE * heuresMensuelles;

      // Calculate HS monthly amount
      var hsMensuelBrut = 0;
      if (hsSemaine > 0) {
        var hsMensuelles = hsSemaine * 52 / 12;

        if (majorationType === 'legal') {
          // 25% for first 8 hours (h36-h43), 50% beyond
          var hs25 = Math.min(hsSemaine, 8);
          var hs50 = Math.max(0, hsSemaine - 8);
          var hs25Mensuel = hs25 * 52 / 12;
          var hs50Mensuel = hs50 * 52 / 12;
          hsMensuelBrut = (SMIC_HORAIRE * 1.25 * hs25Mensuel) + (SMIC_HORAIRE * 1.50 * hs50Mensuel);
        } else if (majorationType === '25') {
          hsMensuelBrut = SMIC_HORAIRE * 1.25 * hsMensuelles;
        } else if (majorationType === '50') {
          hsMensuelBrut = SMIC_HORAIRE * 1.50 * hsMensuelles;
        }
      }

      // Total gross
      var totalBrut = mensuelBrut + hsMensuelBrut;

      // Cotisations: base salary at full rate, HS at reduced rate
      var cotisationsBase = mensuelBrut * TAUX_COTISATIONS_SMIC;
      var cotisationsHS = hsMensuelBrut * TAUX_COTISATIONS_HS;
      var totalCotisations = cotisationsBase + cotisationsHS;

      // Net
      var mensuelNet = totalBrut - totalCotisations;

      // Annual
      var annuelBrut = totalBrut * 12;
      var annuelNet = mensuelNet * 12;

      // Display results
      resHoraire.textContent = formatMoney(SMIC_HORAIRE);
      resMensuelBrut.textContent = formatMoney(mensuelBrut);
      resHSBrut.textContent = formatMoney(hsMensuelBrut);
      resTotalBrut.textContent = formatMoney(totalBrut);
      resCotisations.textContent = '- ' + formatMoney(totalCotisations);
      resMensuelNet.textContent = formatMoney(mensuelNet);
      resAnnuelBrut.textContent = formatMoney(annuelBrut);
      resAnnuelNet.textContent = formatMoney(annuelNet);
    }

    inputHeures.addEventListener('input', calculate);
    inputHS.addEventListener('input', calculate);
    selectMajoration.addEventListener('change', calculate);

    // No initial calculation - results appear only when user enters values
  })();
