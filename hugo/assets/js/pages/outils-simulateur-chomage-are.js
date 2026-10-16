(function() {
    var ageInput = document.getElementById('calc-age');
    var salaireInput = document.getElementById('calc-salaire');
    var motifSelect = document.getElementById('calc-motif');
    var dureeSelect = document.getElementById('calc-duree');
    var submitBtn = document.getElementById('calc-submit');
    var resultsDiv = document.getElementById('calc-results');

    function formatEur(n) {
      return n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?![\d,]))/g, ' ') + ' EUR';
    }

    function calculate() {
      var age = parseInt(ageInput.value);
      var salaireBrut = parseFloat(salaireInput.value);
      var motif = motifSelect.value;
      var dureeMois = parseInt(dureeSelect.value);

      // Validation
      if (!age || age < 16 || age > 67) return;
      if (!salaireBrut || salaireBrut <= 0) return;
      if (!motif) return;
      if (dureeMois < 6) return;

      // SJR = (salaire brut mensuel x 12) / 365
      var sjr = (salaireBrut * 12) / 365;

      // ARE journaliere brute : le plus favorable des deux
      var formule1 = sjr * 0.404 + 13.18;
      var formule2 = sjr * 0.57;
      var areJourBrut = Math.max(formule1, formule2);

      // Minimum 31.97 EUR/jour
      areJourBrut = Math.max(areJourBrut, 31.97);

      // Maximum 75% du SJR
      var plafond = sjr * 0.75;
      areJourBrut = Math.min(areJourBrut, plafond);

      // Securite : au moins le minimum
      areJourBrut = Math.max(areJourBrut, 31.97);

      // Cotisation retraite complementaire ~3%
      var areJourNet = areJourBrut * 0.97;

      // Allocation mensuelle nette (30 jours)
      var areMensuelNet = areJourNet * 30;

      // Duree d'indemnisation
      var dureeJoursTravailles = dureeMois * 30.4; // approx jours calendaires
      var dureeMaxJours;
      if (age < 53) {
        dureeMaxJours = Math.min(dureeJoursTravailles, 548); // 18 mois
      } else if (age <= 54) {
        dureeMaxJours = Math.min(dureeJoursTravailles, 685); // 22.5 mois
      } else {
        dureeMaxJours = Math.min(dureeJoursTravailles, 822); // 27 mois
      }
      dureeMaxJours = Math.round(dureeMaxJours);

      var dureeMoisResult = Math.round(dureeMaxJours / 30.4 * 10) / 10;

      // Differe : 7 jours carence + estimation differe conges payes (~10 jours)
      var differeJours = 7 + 10; // 7 jours incompressibles + estimation CP

      // Pourcentage salaire net maintenu
      // Salaire net estime = brut * 0.78 (approximation)
      var salaireNet = salaireBrut * 0.78;
      var pourcentMaintenu = Math.round((areMensuelNet / salaireNet) * 100);
      pourcentMaintenu = Math.min(pourcentMaintenu, 100);

      // Degressivite
      var degressivite = (salaireBrut > 4915 && age < 57);

      // Display results
      resultsDiv.classList.add('visible');
      document.getElementById('res-sjr').textContent = formatEur(sjr);
      document.getElementById('res-are-brut').textContent = formatEur(areJourBrut);
      document.getElementById('res-are-net').textContent = formatEur(areJourNet);
      document.getElementById('res-mensuel').textContent = formatEur(areMensuelNet);
      document.getElementById('res-duree').textContent = dureeMaxJours + ' jours (' + dureeMoisResult + ' mois)';
      document.getElementById('res-carence').textContent = 'Environ ' + differeJours + ' jours';
      document.getElementById('res-pourcent').textContent = pourcentMaintenu + '%';
      document.getElementById('res-bar').style.width = pourcentMaintenu + '%';

      // Degressivite warning
      var warning = document.getElementById('degres-warning');
      if (degressivite) {
        warning.classList.add('visible');
      } else {
        warning.classList.remove('visible');
      }

      // Scroll to results
      resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Button click
    submitBtn.addEventListener('click', calculate);

    // Real-time update on input change
    [ageInput, salaireInput, motifSelect, dureeSelect].forEach(function(el) {
      el.addEventListener('input', function() {
        // Only auto-calculate if all fields are filled
        if (ageInput.value && salaireInput.value && motifSelect.value && dureeSelect.value) {
          calculate();
        }
      });
      el.addEventListener('change', function() {
        if (ageInput.value && salaireInput.value && motifSelect.value && dureeSelect.value) {
          calculate();
        }
      });
    });

    // Radio buttons
    document.querySelectorAll('input[name="calc-already"]').forEach(function(r) {
      r.addEventListener('change', function() {
        if (ageInput.value && salaireInput.value && motifSelect.value && dureeSelect.value) {
          calculate();
        }
      });
    });
  })();
