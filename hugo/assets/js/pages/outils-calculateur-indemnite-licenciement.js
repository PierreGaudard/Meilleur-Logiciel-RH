// Populate year selects
    (function(){
      var currentYear = new Date().getFullYear();
      var selects = ['entree-annee', 'licenciement-annee'];
      for(var s = 0; s < selects.length; s++){
        var sel = document.getElementById(selects[s]);
        for(var y = currentYear; y >= currentYear - 50; y--){
          var opt = document.createElement('option');
          opt.value = y;
          opt.textContent = y;
          sel.appendChild(opt);
        }
      }
    })();

    // FAQ toggle
    function toggleFaq(btn){
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      var allItems = document.querySelectorAll('.faq-item.open');
      for(var i = 0; i < allItems.length; i++){
        allItems[i].classList.remove('open');
      }
      if(!wasOpen) item.classList.add('open');
    }

    // Real-time calculation
    var inputs = document.querySelectorAll('#entree-mois, #entree-annee, #licenciement-mois, #licenciement-annee, #type-licenciement, #salaire-12, #salaire-3, #primes');
    for(var i = 0; i < inputs.length; i++){
      inputs[i].addEventListener('input', tryCalculate);
      inputs[i].addEventListener('change', tryCalculate);
    }

    function tryCalculate(){
      var entreeMois = document.getElementById('entree-mois').value;
      var entreeAnnee = document.getElementById('entree-annee').value;
      var licMois = document.getElementById('licenciement-mois').value;
      var licAnnee = document.getElementById('licenciement-annee').value;
      var salaire12 = document.getElementById('salaire-12').value;
      var salaire3 = document.getElementById('salaire-3').value;

      if(entreeMois && entreeAnnee && licMois && licAnnee && (salaire12 || salaire3)){
        calculer();
      }
    }

    function calculer(){
      var errorEl = document.getElementById('result-error');
      var panel = document.getElementById('results-panel');
      errorEl.classList.remove('visible');
      panel.classList.remove('visible');

      // Get values
      var entreeMois = parseInt(document.getElementById('entree-mois').value);
      var entreeAnnee = parseInt(document.getElementById('entree-annee').value);
      var licMois = parseInt(document.getElementById('licenciement-mois').value);
      var licAnnee = parseInt(document.getElementById('licenciement-annee').value);
      var type = document.getElementById('type-licenciement').value;
      var salaire12 = parseFloat(document.getElementById('salaire-12').value) || 0;
      var salaire3 = parseFloat(document.getElementById('salaire-3').value) || 0;
      var primes = parseFloat(document.getElementById('primes').value) || 0;

      // Validation
      if(!entreeMois || !entreeAnnee || !licMois || !licAnnee){
        showError("Veuillez renseigner les dates d'entrée et de licenciement.");
        return;
      }
      if(salaire12 <= 0 && salaire3 <= 0){
        showError("Veuillez renseigner au moins un salaire brut mensuel moyen.");
        return;
      }

      // Calculate seniority in months
      var totalMoisEntree = entreeAnnee * 12 + entreeMois;
      var totalMoisLic = licAnnee * 12 + licMois;
      var diffMois = totalMoisLic - totalMoisEntree;

      if(diffMois < 0){
        showError("La date de licenciement doit être postérieure à la date d'entrée dans l'entreprise.");
        return;
      }

      if(diffMois < 8){
        showError("L'ancienneté minimale requise est de 8 mois ininterrompus (article L1234-9 du Code du travail). Avec " + diffMois + " mois d'ancienneté, le salarié n'a pas droit à l'indemnité légale de licenciement.");
        return;
      }

      // Anciennete in years (with fractional months)
      var annees = Math.floor(diffMois / 12);
      var moisRestants = diffMois % 12;
      var ancienneteDecimale = annees + (moisRestants / 12);

      // Reference salary: most favorable
      // Method 1: 1/12 of 12 months gross = monthly average
      var methode1 = salaire12;

      // Method 2: 1/3 of 3 last months (with prorated annual bonuses)
      var methode2 = salaire3 + (primes / 12);

      var salaireRef;
      var methodeRetenue;

      if(salaire12 > 0 && salaire3 > 0){
        if(methode1 >= methode2){
          salaireRef = methode1;
          methodeRetenue = "Moyenne 12 derniers mois";
        } else {
          salaireRef = methode2;
          methodeRetenue = "Moyenne 3 derniers mois + primes proratisées";
        }
      } else if(salaire12 > 0){
        salaireRef = methode1;
        methodeRetenue = "Moyenne 12 derniers mois";
      } else {
        salaireRef = methode2;
        methodeRetenue = "Moyenne 3 derniers mois + primes proratisées";
      }

      // Indemnity calculation
      var indemnite = 0;
      if(ancienneteDecimale <= 10){
        indemnite = salaireRef * (1/4) * ancienneteDecimale;
      } else {
        indemnite = (salaireRef * (1/4) * 10) + (salaireRef * (1/3) * (ancienneteDecimale - 10));
      }

      // Double for professional incapacity
      var doublée = false;
      if(type === 'inaptitude-pro'){
        indemnite = indemnite * 2;
        doublée = true;
      }

      // Round to 2 decimals
      indemnite = Math.round(indemnite * 100) / 100;
      salaireRef = Math.round(salaireRef * 100) / 100;

      // Display
      var ancienneteTexte = annees + ' an' + (annees > 1 ? 's' : '');
      if(moisRestants > 0){
        ancienneteTexte += ' et ' + moisRestants + ' mois';
      }

      document.getElementById('res-anciennete').textContent = ancienneteTexte;
      document.getElementById('res-salaire').textContent = formatMontant(salaireRef) + ' (' + methodeRetenue + ')';
      document.getElementById('res-indemnite').textContent = formatMontant(indemnite);

      // Build note
      var note = '';
      if(doublée){
        note += '<strong>Indemnité doublée :</strong> conformément à l\'article L1226-14 du Code du travail, l\'indemnité de licenciement pour inaptitude d\'origine professionnelle est égale au double de l\'indemnité légale. Le montant affiché tient compte de ce doublement.<br><br>';
      }
      if(type === 'economique'){
        note += '<strong>Licenciement économique :</strong> le montant affiché correspond à l\'indemnité légale minimale. Des indemnités complémentaires (supra-légales) peuvent s\'ajouter dans le cadre d\'un plan de sauvegarde de l\'emploi (PSE) ou d\'une négociation individuelle.<br><br>';
      }
      note += '<strong>Régime fiscal et social :</strong> l\'indemnité légale de licenciement est exonérée d\'impôt sur le revenu et de cotisations sociales dans les limites prévues par la loi (6 fois le PASS pour l\'IR, 2 fois le PASS pour les cotisations). Ce montant est un minimum légal. Vérifiez votre convention collective : l\'indemnité conventionnelle peut être plus favorable.';

      document.getElementById('res-note').innerHTML = note;
      panel.classList.add('visible');
      panel.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }

    function showError(msg){
      var errorEl = document.getElementById('result-error');
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
      document.getElementById('results-panel').classList.remove('visible');
    }

    function formatMontant(n){
      return n.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' \u20AC';
    }
