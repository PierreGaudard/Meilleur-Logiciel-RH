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
        document.getElementById('q' + q).style.display = 'none';
        if (q < 3) {
          document.getElementById('q' + (q + 1)).style.display = 'block';
          for (var i = 0; i < progress.length; i++) {
            progress[i].style.background = (i <= q) ? 'var(--primary)' : '#e5e7eb';
          }
        } else {
          showResult();
        }
      });
    });

    function showResult() {
      var scores = { skello: 0, flatchr: 0, beetween: 0, cegid: 0, cookorico: 0 };
      if (answers[1] === 'indep') { scores.cookorico += 3; scores.skello += 2; }
      if (answers[1] === 'groupe') { scores.cegid += 3; scores.flatchr += 3; scores.skello += 1; }
      if (answers[1] === 'saison') { scores.beetween += 4; scores.skello += 2; }
      if (answers[2] === 'visibilite') { scores.flatchr += 4; scores.beetween += 1; }
      if (answers[2] === 'admin') { scores.skello += 4; }
      if (answers[2] === 'qualite') { scores.cookorico += 3; scores.beetween += 2; }
      if (answers[3] === 'low') { scores.cookorico += 2; scores.skello += 1; }
      if (answers[3] === 'mid') { scores.beetween += 2; scores.flatchr += 1; scores.skello += 1; }
      if (answers[3] === 'high') { scores.cegid += 3; scores.flatchr += 2; }

      var best = 'skello', bestScore = -1;
      for (var k in scores) { if (scores[k] > bestScore) { bestScore = scores[k]; best = k; } }

      var reco = {
        skello: { title: 'Skello est fait pour vous', text: 'Votre priorite est la chaine complete, de l\'annonce au premier shift. Le module Recrutement de Skello relie diffusion des annonces, suivi des candidatures, contrat, DPAE et planning sans ressaisie. Il est en cours de lancement : inscrivez-vous a la liste d\'attente, surtout si vos plannings tournent deja sur Skello.' },
        flatchr: { title: 'Flatchr est fait pour vous', text: 'Votre problème principal est la visibilite des annonces. Flatchr publie sur plus de 100 jobboards en un clic, avec une application mobile pour les managers et des reponses automatiques aux candidats. L\'abonnement se rentabilise avec un flux regulier de postes ouverts.' },
        beetween: { title: 'Beetween est fait pour vous', text: 'Avec une activite saisonniere, le vivier reutilisable de Beetween est votre meilleur allie : les bons profils de cette annee deviennent les premiers contactes de l\'annee prochaine. L\'autonomie laissee aux responsables de site colle au quotidien des PME multi-etablissements.' },
        cegid: { title: 'Cegid Digitalrecruiters est fait pour vous', text: 'Pour une chaine ou une franchise avec des volumes importants, Cegid Digitalrecruiters apporte le site carrieres a votre marque, les viviers segmentes et les campagnes de relance. Un projet grands comptes, a dimensionner avec l\'editeur.' },
        cookorico: { title: 'Cookorico est fait pour vous', text: 'Pour un etablissement independant qui recrute ponctuellement des profils cibles de salle ou de cuisine, une annonce Cookorico a l\'unite suffit souvent : audience 100 % CHR, paiement a l\'annonce, sans abonnement.' }
      };
      resultTitle.textContent = reco[best].title;
      resultText.textContent = reco[best].text;
      result.style.display = 'block';
      document.getElementById('quiz-progress').style.display = 'none';
    }

    document.getElementById('quiz-restart').addEventListener('click', function() {
      answers = {};
      result.style.display = 'none';
      steps.forEach(function(s) { s.style.display = 'none'; });
      document.getElementById('q1').style.display = 'block';
      document.getElementById('quiz-progress').style.display = 'flex';
      for (var i = 0; i < progress.length; i++) {
        progress[i].style.background = (i === 0) ? 'var(--primary)' : '#e5e7eb';
      }
    });
  })();
