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
      var scores = { empowill: 0, lucca: 0, elevo: 0, factorial: 0, skillup: 0 };
      // Q1 : taille
      if (quizData.q1 === 'small') { scores.empowill += 3; scores.factorial += 2; scores.elevo += 1; scores.lucca += 1; }
      if (quizData.q1 === 'medium') { scores.empowill += 3; scores.elevo += 2; scores.lucca += 2; scores.skillup += 2; }
      if (quizData.q1 === 'large') { scores.empowill += 3; scores.skillup += 3; scores.elevo += 1; }
      // Q2 : priorite
      if (quizData.q2 === 'entretiens') { scores.empowill += 4; scores.elevo += 2; scores.lucca += 1; }
      if (quizData.q2 === 'sirh') { scores.lucca += 3; scores.factorial += 3; scores.empowill += 1; }
      if (quizData.q2 === 'formation') { scores.skillup += 4; scores.empowill += 2; }
      if (quizData.q2 === 'performance') { scores.elevo += 4; scores.empowill += 2; scores.lucca += 1; }
      // Q3 : secteur
      if (quizData.q3 === 'industrie') { scores.empowill += 4; scores.skillup += 1; }
      if (quizData.q3 === 'services') { scores.elevo += 2; scores.lucca += 2; scores.empowill += 1; scores.factorial += 1; }
      if (quizData.q3 === 'autre') { scores.empowill += 2; scores.lucca += 1; scores.factorial += 1; scores.skillup += 1; }
      // Q4 : budget
      if (quizData.q4 === 'low') { scores.empowill += 3; scores.elevo += 2; }
      if (quizData.q4 === 'mid') { scores.empowill += 2; scores.elevo += 2; scores.factorial += 2; scores.skillup += 2; }
      if (quizData.q4 === 'high') { scores.lucca += 2; scores.skillup += 1; scores.empowill += 1; }
      // Find winner
      var best = 'empowill';
      var max = 0;
      for (var k in scores) { if (scores[k] > max) { max = scores[k]; best = k; } }
      var recs = {
        empowill: { name: 'Empowill', text: 'Le spécialiste des entretiens avec la boucle entretiens-compétences-formation en natif. Idéal pour votre profil.' },
        lucca: { name: 'Lucca', text: 'Un SIRH modulaire complet avec un bon module entretiens. Parfait si vous voulez tout centraliser chez un seul éditeur.' },
        elevo: { name: 'Elevo', text: 'L\'outil de performance management avec feedback continu et entretiens 360. Idéal pour les cultures orientées performance.' },
        factorial: { name: 'Factorial', text: 'Un SIRH tout-en-un à prix fixe avec un module entretiens intégré. Bon choix si la paie et les congés sont aussi des priorités.' },
        skillup: { name: 'Skillup', text: 'Le spécialiste formation avec un volet entretiens intégré. Parfait si la formation est votre priorité principale.' }
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
