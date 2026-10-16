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
      var scores = { skello: 0, combo: 0, factorial: 0, lucca: 0, payfit: 0 };
      if (answers[1] === 'terrain') { scores.skello += 4; scores.combo += 2; }
      if (answers[1] === 'bureau') { scores.factorial += 3; scores.lucca += 3; scores.payfit += 1; }
      if (answers[1] === 'petit') { scores.combo += 4; scores.skello += 1; scores.payfit += 1; }
      if (answers[2] === 'planning') { scores.skello += 4; scores.combo += 3; }
      if (answers[2] === 'sirh') { scores.factorial += 4; scores.lucca += 3; }
      if (answers[2] === 'paie') { scores.payfit += 4; scores.factorial += 1; }
      if (answers[3] === 'low') { scores.combo += 3; scores.lucca += 1; }
      if (answers[3] === 'mid') { scores.skello += 2; scores.factorial += 2; scores.lucca += 2; }
      if (answers[3] === 'high') { scores.payfit += 2; scores.skello += 1; }

      var best = 'skello', bestScore = -1;
      for (var k in scores) { if (scores[k] > bestScore) { bestScore = scores[k]; best = k; } }

      var reco = {
        skello: { title: 'Skello est fait pour vous', text: 'Avec des equipes de terrain et un besoin de planning, Skello est le choix le plus aligne. Planning multi-sites, badgeuse mobile sans materiel et preparation de la paie dans le meme outil, des 6 euros par salarie et par mois.' },
        combo: { title: 'Combo est fait pour vous', text: 'Pour une petite structure ou un commerce de proximite avec un budget serre, Combo est ideal. Planning par rotation, pointeuse et app mobile claire, a partir de 3 euros par salarie.' },
        factorial: { title: 'Factorial est fait pour vous', text: 'Pour un besoin RH large dans une entreprise de bureau, Factorial centralise conges, documents, entretiens et paie dans une interface moderne, des 5 euros par salarie.' },
        lucca: { title: 'Lucca est fait pour vous', text: 'Pour une PME tertiaire qui veut composer son SIRH a la carte, Lucca et ses modules independants offrent une excellente experience utilisateur, entre 3 et 6 euros par module.' },
        payfit: { title: 'PayFit est fait pour vous', text: 'Si la paie est votre priorite, PayFit automatise la production des bulletins et la DSN, avec une prise en main rapide. Comptez entre 6 et 9 euros par salarie et par mois.' }
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
