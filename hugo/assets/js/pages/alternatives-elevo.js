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
      var scores = { empowill: 0, javelo: 0, zest: 0, lucca: 0, factorial: 0 };
      // Q1 : besoin principal
      if (quizData.q1 === 'entretiens') { scores.empowill += 3; scores.javelo += 2; scores.lucca += 1; }
      if (quizData.q1 === 'performance') { scores.javelo += 3; scores.empowill += 2; scores.zest += 1; }
      if (quizData.q1 === 'engagement') { scores.zest += 3; scores.empowill += 1; scores.javelo += 1; }
      if (quizData.q1 === 'sirh') { scores.factorial += 3; scores.lucca += 3; }
      // Q2 : formation
      if (quizData.q2 === 'oui') { scores.empowill += 3; scores.lucca += 1; }
      if (quizData.q2 === 'un_peu') { scores.empowill += 2; scores.factorial += 1; }
      if (quizData.q2 === 'non') { scores.javelo += 2; scores.zest += 1; scores.factorial += 1; }
      // Q3 : taille
      if (quizData.q3 === 'small') { scores.javelo += 2; scores.factorial += 2; }
      if (quizData.q3 === 'medium') { scores.empowill += 2; scores.zest += 2; scores.lucca += 1; }
      if (quizData.q3 === 'large') { scores.empowill += 2; scores.lucca += 2; scores.zest += 1; }
      // Q4 : SIRH complet
      if (quizData.q4 === 'oui') { scores.factorial += 3; scores.lucca += 3; }
      if (quizData.q4 === 'non') { scores.empowill += 2; scores.javelo += 2; scores.zest += 1; }
      // Find winner
      var best = 'empowill';
      var max = 0;
      for (var k in scores) { if (scores[k] > max) { max = scores[k]; best = k; } }
      var recs = {
        empowill: { name: 'Empowill', text: 'Entretiens + formation. Idéal pour les PME qui veulent un outil complet sur le développement des talents avec une conformité légale rigoureuse.' },
        javelo: { name: 'Javelo', text: 'Feedback et entretiens à prix accessible. Parfait pour les PME qui veulent un outil simple, rapide à déployer et centré sur la performance.' },
        zest: { name: 'Zest', text: 'L\'engagement collaborateur au quotidien. Idéal si le climat social et le bien-être sont des priorités pour votre direction.' },
        lucca: { name: 'Lucca (Poplee)', text: 'Le talent management dans un SIRH complet. Parfait si vous voulez centraliser congés, frais, temps et entretiens dans un seul outil.' },
        factorial: { name: 'Factorial', text: 'Le SIRH tout-en-un. Idéal si les entretiens ne sont qu\'une brique parmi d\'autres et que vous cherchez à tout couvrir, paie incluse.' }
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
