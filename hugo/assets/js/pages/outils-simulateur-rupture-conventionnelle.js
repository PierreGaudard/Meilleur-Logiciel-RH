/* ====== Detail Toggle ====== */
  function toggleDetail() {
    var section = document.getElementById('detail-section');
    var btn = document.getElementById('btn-toggle-detail');
    if (section.style.display === 'none') {
      section.style.display = 'block';
      btn.innerHTML = 'Masquer le détail <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align:middle;margin-left:4px"><path d="M18 15l-6-6-6 6"/></svg>';
    } else {
      section.style.display = 'none';
      btn.innerHTML = 'Voir le détail <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align:middle;margin-left:4px"><path d="M6 9l6 6 6-6"/></svg>';
    }
  }

  /* ====== FAQ Toggle ====== */
  function toggleFaq(btn) {
    var item = btn.parentElement;
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(el) {
      el.classList.remove('open');
    });
    if (!wasOpen) {
      item.classList.add('open');
    }
  }

  /* ====== Burger Menu ====== */
  (function() {
    var burger = document.querySelector('.nav-burger');
    var nav = document.querySelector('.site-nav');
    if (!burger || !nav) return;
    burger.addEventListener('click', function() {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function(e) {
      if (!burger.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* ====== Calculator ====== */
  (function() {
    var btnCalculer = document.getElementById('btn-calculer');
    var resultsEl = document.getElementById('results');

    /* Input elements */
    var dateEntreeEl = document.getElementById('date-entree');
    var dateRuptureEl = document.getElementById('date-rupture');
    var salaire12El = document.getElementById('salaire-12');
    var salaire3El = document.getElementById('salaire-3');
    var primesEl = document.getElementById('primes');

    /* Result elements */
    var resIndemnite = document.getElementById('res-indemnite');
    var resAnciennete = document.getElementById('res-anciennete');
    var resSalaireRef = document.getElementById('res-salaire-ref');
    var resMethode = document.getElementById('res-methode');
    var resDetail = document.getElementById('res-detail');
    var resFiscalText = document.getElementById('res-fiscal-text');
    var resSocialText = document.getElementById('res-social-text');

    /* Set default dates */
    var today = new Date();
    dateRuptureEl.value = formatDate(today);

    /* Default entry date: 5 years ago */
    var fiveYearsAgo = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    dateEntreeEl.value = formatDate(fiveYearsAgo);

    function formatDate(d) {
      var y = d.getFullYear();
      var m = String(d.getMonth() + 1).padStart(2, '0');
      var day = String(d.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + day;
    }

    function formatMoney(n) {
      return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' \u20AC';
    }

    /**
     * Calculate anciennete in years and months precisely.
     * Returns { years, months, totalYears }
     */
    function calcAnciennete(dateEntree, dateRupture) {
      var years = dateRupture.getFullYear() - dateEntree.getFullYear();
      var months = dateRupture.getMonth() - dateEntree.getMonth();
      var days = dateRupture.getDate() - dateEntree.getDate();

      /* If the day hasn't been reached yet, subtract one month */
      if (days < 0) {
        months--;
      }

      /* If months are negative, subtract one year */
      if (months < 0) {
        years--;
        months += 12;
      }

      var totalYears = years + (months / 12);
      return { years: years, months: months, totalYears: totalYears };
    }

    /**
     * Calculate the legal indemnity.
     * Art. L1234-9 / R1234-2 Code du travail:
     * - 1/4 month salary per year for first 10 years
     * - 1/3 month salary per year beyond 10 years
     * Incomplete years prorated by month.
     */
    function calcIndemnite(salaireRef, totalYears) {
      var indemnite = 0;

      if (totalYears <= 10) {
        indemnite = (1 / 4) * salaireRef * totalYears;
      } else {
        /* First 10 years at 1/4 */
        indemnite = (1 / 4) * salaireRef * 10;
        /* Beyond 10 years at 1/3 */
        indemnite += (1 / 3) * salaireRef * (totalYears - 10);
      }

      return Math.round(indemnite * 100) / 100;
    }

    function doCalculation() {
      /* Validate inputs */
      var dateEntree = new Date(dateEntreeEl.value);
      var dateRupture = new Date(dateRuptureEl.value);
      var salaire12 = parseFloat(salaire12El.value);
      var salaire3 = parseFloat(salaire3El.value) || 0;
      var primes = parseFloat(primesEl.value) || 0;

      if (!dateEntreeEl.value || !dateRuptureEl.value) {
        alert('Veuillez renseigner les dates d\'entrée et de rupture.');
        return;
      }

      if (isNaN(salaire12) || salaire12 <= 0) {
        alert('Veuillez renseigner votre salaire brut mensuel moyen (12 derniers mois).');
        return;
      }

      if (dateEntree >= dateRupture) {
        alert('La date d\'entrée doit être antérieure à la date de rupture.');
        return;
      }

      /* Calculate anciennete */
      var anc = calcAnciennete(dateEntree, dateRupture);

      if (anc.totalYears < (8 / 12)) {
        alert('L\'ancienneté minimum requise pour une indemnité de rupture conventionnelle est de 8 mois.');
        return;
      }

      /* Determine salary reference */
      /* Method 1: average of last 12 months (already provided) */
      var ref12 = salaire12;

      /* Method 2: average of last 3 months + prorated annual primes */
      var ref3 = 0;
      var methode = '';
      if (salaire3 > 0) {
        /* Primes are prorated: primes * 3/12 = primes/4, then divided over 3 months */
        ref3 = salaire3 + (primes * (3 / 12)) / 3;
      }

      var salaireRef;
      if (ref3 > ref12 && ref3 > 0) {
        salaireRef = ref3;
        methode = 'Moyenne des 3 derniers mois (plus favorable)';
      } else {
        salaireRef = ref12;
        methode = 'Moyenne des 12 derniers mois';
      }

      /* Calculate indemnity */
      var indemnite = calcIndemnite(salaireRef, anc.totalYears);

      /* Build detail string */
      var detail = '';
      if (anc.totalYears <= 10) {
        detail = '1/4 x ' + formatMoney(salaireRef) + ' x ' + anc.totalYears.toFixed(3);
      } else {
        detail = '(1/4 x ' + formatMoney(salaireRef) + ' x 10) + (1/3 x ' + formatMoney(salaireRef) + ' x ' + (anc.totalYears - 10).toFixed(3) + ')';
      }

      /* Anciennete display */
      var ancDisplay = anc.years + ' an' + (anc.years > 1 ? 's' : '');
      if (anc.months > 0) {
        ancDisplay += ' et ' + anc.months + ' mois';
      }

      /* Fiscal regime */
      var remunerationAnnuelle = salaireRef * 12;
      var seuilDouble = remunerationAnnuelle * 2;
      var seuilMoitie = indemnite / 2;

      var fiscalText = '';
      if (indemnite <= seuilDouble && indemnite <= seuilMoitie * 2) {
        fiscalText = 'Régime fiscal : votre indemnité de ' + formatMoney(indemnite) + ' est inférieure au double de votre rémunération annuelle brute (' + formatMoney(seuilDouble) + '). Elle est donc exonérée d\'impôt sur le revenu si elle correspond au montant légal ou conventionnel.';
      } else {
        fiscalText = 'Régime fiscal : votre indemnité est exonérée d\'impôt sur le revenu dans la limite du montant légal ou conventionnel, du double de la rémunération annuelle brute (' + formatMoney(seuilDouble) + ') ou de la moitié de l\'indemnité versée. La fraction excédentaire est imposable.';
      }

      var socialText = 'Régime social : la fraction de l\'indemnité ne dépassant pas le montant légal est exonérée de cotisations de Sécurité sociale et de CSG/CRDS, dans la limite de 2 fois le plafond annuel de la Sécurité sociale (PASS). Au-delà, des cotisations s\'appliquent.';

      /* Display results */
      resIndemnite.textContent = formatMoney(indemnite);
      resAnciennete.textContent = ancDisplay;
      resSalaireRef.textContent = formatMoney(salaireRef);
      resMethode.textContent = methode;
      resDetail.textContent = detail;
      resFiscalText.textContent = fiscalText;
      resSocialText.textContent = socialText;

      resultsEl.classList.add('visible');
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    btnCalculer.addEventListener('click', doCalculation);

    /* Real-time calculation on input changes */
    var inputs = [dateEntreeEl, dateRuptureEl, salaire12El, salaire3El, primesEl];
    inputs.forEach(function(input) {
      input.addEventListener('input', function() {
        /* Only auto-calculate if minimum required fields are filled */
        if (dateEntreeEl.value && dateRuptureEl.value && salaire12El.value && parseFloat(salaire12El.value) > 0) {
          var d1 = new Date(dateEntreeEl.value);
          var d2 = new Date(dateRuptureEl.value);
          if (d1 < d2) {
            var anc = calcAnciennete(d1, d2);
            if (anc.totalYears >= (8 / 12)) {
              doCalculationSilent();
            }
          }
        }
      });
    });

    /**
     * Silent calculation (no alerts) for real-time updates
     */
    function doCalculationSilent() {
      var dateEntree = new Date(dateEntreeEl.value);
      var dateRupture = new Date(dateRuptureEl.value);
      var salaire12 = parseFloat(salaire12El.value);
      var salaire3 = parseFloat(salaire3El.value) || 0;
      var primes = parseFloat(primesEl.value) || 0;

      if (!dateEntreeEl.value || !dateRuptureEl.value || isNaN(salaire12) || salaire12 <= 0) return;
      if (dateEntree >= dateRupture) return;

      var anc = calcAnciennete(dateEntree, dateRupture);
      if (anc.totalYears < (8 / 12)) return;

      var ref12 = salaire12;
      var ref3 = 0;
      var methode = '';

      if (salaire3 > 0) {
        ref3 = salaire3 + (primes * (3 / 12)) / 3;
      }

      var salaireRef;
      if (ref3 > ref12 && ref3 > 0) {
        salaireRef = ref3;
        methode = 'Moyenne des 3 derniers mois (plus favorable)';
      } else {
        salaireRef = ref12;
        methode = 'Moyenne des 12 derniers mois';
      }

      var indemnite = calcIndemnite(salaireRef, anc.totalYears);

      var detail = '';
      if (anc.totalYears <= 10) {
        detail = '1/4 x ' + formatMoney(salaireRef) + ' x ' + anc.totalYears.toFixed(3);
      } else {
        detail = '(1/4 x ' + formatMoney(salaireRef) + ' x 10) + (1/3 x ' + formatMoney(salaireRef) + ' x ' + (anc.totalYears - 10).toFixed(3) + ')';
      }

      var ancDisplay = anc.years + ' an' + (anc.years > 1 ? 's' : '');
      if (anc.months > 0) {
        ancDisplay += ' et ' + anc.months + ' mois';
      }

      var remunerationAnnuelle = salaireRef * 12;
      var seuilDouble = remunerationAnnuelle * 2;

      var fiscalText = '';
      if (indemnite <= seuilDouble) {
        fiscalText = 'Régime fiscal : votre indemnité de ' + formatMoney(indemnite) + ' est inférieure au double de votre rémunération annuelle brute (' + formatMoney(seuilDouble) + '). Elle est donc exonérée d\'impôt sur le revenu si elle correspond au montant légal ou conventionnel.';
      } else {
        fiscalText = 'Régime fiscal : votre indemnité est exonérée d\'impôt sur le revenu dans la limite du montant légal ou conventionnel, du double de la rémunération annuelle brute (' + formatMoney(seuilDouble) + ') ou de la moitié de l\'indemnité versée. La fraction excédentaire est imposable.';
      }

      var socialText = 'Régime social : la fraction de l\'indemnité ne dépassant pas le montant légal est exonérée de cotisations de Sécurité sociale et de CSG/CRDS, dans la limite de 2 fois le plafond annuel de la Sécurité sociale (PASS). Au-delà, des cotisations s\'appliquent.';

      resIndemnite.textContent = formatMoney(indemnite);
      resAnciennete.textContent = ancDisplay;
      resSalaireRef.textContent = formatMoney(salaireRef);
      resMethode.textContent = methode;
      resDetail.textContent = detail;
      resFiscalText.textContent = fiscalText;
      resSocialText.textContent = socialText;

      resultsEl.classList.add('visible');
    }
  })();
