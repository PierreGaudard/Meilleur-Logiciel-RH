// Quiz interactif
  (function() {
    var answers = {};
    var steps = document.querySelectorAll('.quiz-step');
    var progress = document.querySelectorAll('.quiz-progress .dot');
    var result = document.getElementById('quiz-result');
    var resultTitle = document.getElementById('quiz-result-title');
    var resultText = document.getElementById('quiz-result-text');

    document.querySelectorAll('.quiz-opt').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var q = parseInt(this.getAttribute('data-q'));
        var v = this.getAttribute('data-v');
        answers[q] = v;

        // Hide current step
        document.getElementById('q' + q).classList.remove('active');

        if (q < 4) {
          // Show next step
          document.getElementById('q' + (q + 1)).classList.add('active');
          // Update progress
          for (var i = 0; i < progress.length; i++) {
            progress[i].classList.toggle('filled', i <= q);
          }
        } else {
          // Calculate result
          showResult();
        }
      });
    });

    function showResult() {
      var scores = { skello: 0, lucca: 0, payfit: 0, personio: 0, eurecia: 0, combo: 0 };

      // Q1: Organisation du travail
      if (answers[1] === 'terrain') { scores.skello += 4; scores.combo += 3; }
      if (answers[1] === 'bureau') { scores.lucca += 3; scores.eurecia += 2; scores.payfit += 2; scores.personio += 2; }
      if (answers[1] === 'mixte') { scores.skello += 3; scores.eurecia += 2; scores.lucca += 1; }

      // Q2: Besoin principal
      if (answers[2] === 'planning') { scores.skello += 5; scores.combo += 3; }
      if (answers[2] === 'paie') { scores.payfit += 5; scores.lucca += 1; }
      if (answers[2] === 'sirh') { scores.lucca += 3; scores.eurecia += 3; scores.personio += 2; }
      if (answers[2] === 'multi') { scores.personio += 6; }

      // Q3: Effectif
      if (answers[3] === 'small') { scores.combo += 3; scores.payfit += 2; scores.skello += 1; }
      if (answers[3] === 'medium') { scores.skello += 2; scores.lucca += 2; scores.eurecia += 1; scores.personio += 1; }
      if (answers[3] === 'large') { scores.eurecia += 3; scores.personio += 2; scores.skello += 1; }

      // Q4: Saisonnalite
      if (answers[4] === 'yes') { scores.skello += 3; scores.combo += 2; }
      if (answers[4] === 'no') { scores.lucca += 1; scores.eurecia += 1; scores.payfit += 1; }

      var best = 'skello';
      var bestScore = -1;
      for (var k in scores) {
        if (scores[k] > bestScore) { bestScore = scores[k]; best = k; }
      }

      var recommendations = {
        skello: { title: 'Skello est fait pour vous', text: 'Vos équipes travaillent en horaires variables : Skello construit le planning en contrôlant les règles de votre convention collective, enregistre les heures réelles par badgeuse et facture par établissement, de 59 à 129 euros par mois selon l\'offre.' },
        lucca: { title: 'Lucca est fait pour vous', text: 'Pour une PME de bureau, Lucca permet de ne payer que les modules utiles, de 2,24 à 3,97 euros HT par collaborateur et par mois. Commencez par les absences et les feuilles de temps.' },
        payfit: { title: 'PayFit est fait pour vous', text: 'Votre priorité est la paie : PayFit calcule les bulletins et envoie la DSN automatiquement, sans gestionnaire spécialisé. Le tarif se fixe sur devis.' },
        personio: { title: 'Personio est fait pour vous', text: 'Avec des salariés dans plusieurs pays, Personio réunit dossiers, absences et recrutement dans un seul outil, avec les règles de chaque pays. Le tarif se fixe sur devis.' },
        eurecia: { title: 'Eurecia est fait pour vous', text: 'Pour un SIRH complet chez un éditeur français, Eurecia couvre congés, temps, frais, entretiens et recrutement, dès 4,20 euros HT par collaborateur et par mois.' },
        combo: { title: 'Combo est fait pour vous', text: 'Pour un établissement unique au budget serré, Combo propose un planning simple dès 60 euros par mois et par établissement.' }
      };

      resultTitle.textContent = recommendations[best].title;
      resultText.textContent = recommendations[best].text;
      result.classList.add('active');
      document.querySelector('.quiz-progress').style.display = 'none';
    }

    document.getElementById('quiz-restart').addEventListener('click', function() {
      answers = {};
      result.classList.remove('active');
      steps.forEach(function(s) { s.classList.remove('active'); });
      document.getElementById('q1').classList.add('active');
      document.querySelector('.quiz-progress').style.display = 'flex';
      for (var i = 0; i < progress.length; i++) {
        progress[i].classList.toggle('filled', i === 0);
      }
    });
  })();
