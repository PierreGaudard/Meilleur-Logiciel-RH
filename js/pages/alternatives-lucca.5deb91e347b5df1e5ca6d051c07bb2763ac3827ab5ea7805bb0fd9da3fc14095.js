// Quiz logic
    var quizData = { q1: '', q2: '', q3: '', q4: '' };
    function quizAnswer(step, val) {
      quizData['q' + step] = val;
      document.getElementById('qp' + step).classList.add('done');
      document.getElementById('quiz-q' + step).classList.remove('active');
      if (step < 4) {
        document.getElementById('quiz-q' + (step + 1)).classList.add('active');
      } else {
        computeQuiz();
      }
    }
    function computeQuiz() {
      var scores = { factorial: 0, payfit: 0, personio: 0, eurecia: 0, silae: 0 };
      // Q1 : taille
      if (quizData.q1 === 'small') { scores.payfit += 3; scores.factorial += 2; scores.eurecia += 1; }
      if (quizData.q1 === 'medium') { scores.factorial += 3; scores.eurecia += 2; scores.personio += 2; scores.silae += 1; }
      if (quizData.q1 === 'large') { scores.personio += 3; scores.eurecia += 2; scores.silae += 2; scores.factorial += 1; }
      // Q2 : modules actuels
      if (quizData.q2 === 'basic') { scores.payfit += 2; scores.factorial += 1; }
      if (quizData.q2 === 'mid') { scores.factorial += 2; scores.eurecia += 2; scores.payfit += 1; }
      if (quizData.q2 === 'full') { scores.factorial += 3; scores.personio += 2; scores.eurecia += 2; }
      // Q3 : priorite paie
      if (quizData.q3 === 'payroll') { scores.payfit += 3; scores.silae += 3; scores.factorial += 1; }
      if (quizData.q3 === 'sirh') { scores.factorial += 3; scores.personio += 2; scores.eurecia += 2; }
      if (quizData.q3 === 'both') { scores.factorial += 3; scores.eurecia += 2; scores.payfit += 1; scores.silae += 1; }
      // Q4 : budget
      if (quizData.q4 === 'low') { scores.factorial += 3; scores.eurecia += 2; }
      if (quizData.q4 === 'mid') { scores.factorial += 2; scores.payfit += 2; scores.personio += 2; scores.eurecia += 2; }
      if (quizData.q4 === 'high') { scores.personio += 2; scores.silae += 2; scores.eurecia += 1; }
      // Find winner
      var best = 'factorial';
      var max = 0;
      for (var k in scores) { if (scores[k] > max) { max = scores[k]; best = k; } }
      var recs = {
        factorial: { name: 'Factorial', text: 'Un SIRH tout-en-un pour votre profil. Prix prévisible, paie intégrée et déploiement rapide.' },
        payfit: { name: 'PayFit', text: 'La paie simplifiée au maximum. Idéal pour les petites structures qui veulent un outil rapide à déployer et sans expertise requise.' },
        personio: { name: 'Personio', text: 'Le SIRH européen avec un ATS avancé et du multi-pays natif. Parfait si vous avez des équipes internationales.' },
        eurecia: { name: 'Eurecia', text: 'Un éditeur français indépendant avec un module QVT. Bon rapport qualité-prix pour les PME structurées.' },
        silae: { name: 'Silae (+ SIRH tiers)', text: 'Un moteur de paie expert. À coupler avec un SIRH comme Factorial pour une couverture complète.' }
      };
      document.getElementById('quiz-result-name').textContent = 'Recommandation : ' + recs[best].name;
      document.getElementById('quiz-result-text').textContent = recs[best].text;
      document.getElementById('quiz-result').classList.add('active');
    }
    function quizRestart() {
      quizData = { q1: '', q2: '', q3: '', q4: '' };
      for (var i = 1; i <= 4; i++) {
        document.getElementById('qp' + i).classList.remove('done');
        document.getElementById('quiz-q' + i).classList.remove('active');
      }
      document.getElementById('quiz-q1').classList.add('active');
      document.getElementById('quiz-result').classList.remove('active');
    }
