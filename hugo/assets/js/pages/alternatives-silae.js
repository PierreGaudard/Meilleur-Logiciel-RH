(function() {
        var radios = document.querySelectorAll('#quizCard input[type="radio"]');
        var btn = document.getElementById('quizSubmit');
        radios.forEach(function(r) {
          r.addEventListener('change', function() {
            var answered = document.querySelectorAll('#quizCard input[type="radio"]:checked');
            btn.disabled = answered.length < 4;
          });
        });
      })();

      function computeQuiz() {
        var q1 = document.querySelector('input[name="q1"]:checked');
        var q2 = document.querySelector('input[name="q2"]:checked');
        var q3 = document.querySelector('input[name="q3"]:checked');
        var q4 = document.querySelector('input[name="q4"]:checked');
        if (!q1 || !q2 || !q3 || !q4) return;

        var scores = { payfit: 0, sage: 0, cegid: 0, nibelis: 0, factorial: 0 };

        // Q1 : Taille
        if (q1.value === 'small') { scores.payfit += 4; scores.factorial += 2; scores.sage += 1; }
        if (q1.value === 'medium') { scores.factorial += 3; scores.sage += 3; scores.nibelis += 2; scores.cegid += 1; }
        if (q1.value === 'large') { scores.cegid += 4; scores.nibelis += 3; scores.sage += 2; }

        // Q2 : Complexite paie
        if (q2.value === 'simple') { scores.payfit += 4; scores.factorial += 3; }
        if (q2.value === 'medium') { scores.sage += 3; scores.factorial += 2; scores.nibelis += 2; scores.payfit += 1; }
        if (q2.value === 'complex') { scores.cegid += 4; scores.sage += 3; scores.nibelis += 3; }

        // Q3 : Besoin SIRH
        if (q3.value === 'paie') { scores.payfit += 3; scores.sage += 3; scores.nibelis += 2; }
        if (q3.value === 'basic') { scores.payfit += 2; scores.factorial += 3; scores.sage += 1; }
        if (q3.value === 'full') { scores.factorial += 5; scores.cegid += 3; }

        // Q4 : Budget
        if (q4.value === 'low') { scores.factorial += 4; scores.payfit += 3; }
        if (q4.value === 'mid') { scores.sage += 3; scores.cegid += 2; scores.factorial += 1; scores.payfit += 1; }
        if (q4.value === 'high') { scores.nibelis += 4; scores.cegid += 3; scores.sage += 1; }

        var best = 'payfit';
        var max = 0;
        for (var key in scores) {
          if (scores[key] > max) { max = scores[key]; best = key; }
        }

        var recos = {
          payfit: { name: 'PayFit', text: 'Votre profil correspond à une TPE/PME qui cherche la simplicité. PayFit vous permettra de produire vos bulletins de paie sans expertise, avec une mise en place en 1 à 2 semaines.' },
          sage: { name: 'Sage Paie', text: 'Sage Paie est la solution adaptée à votre structure. Son moteur de paie éprouvé et son écosystème complet vous apporteront robustesse et fiabilité sur le long terme.' },
          cegid: { name: 'Cegid HR Ultimate', text: 'Votre taille et vos besoins orientent vers Cegid. Sa plateforme HCM complète couvre paie, talents et reporting avancé pour les ETI et grands groupes.' },
          nibelis: { name: 'Nibelis', text: 'L\'externalisation paie correspond à votre situation. Nibelis vous libérera de la production paie interne avec un gestionnaire dédié et une responsabilité partagée sur la conformité.' },
          factorial: { name: 'Factorial', text: 'Factorial correspond bien à votre profil. Son SIRH complet avec paie intégrée vous offre un bon rapport fonctionnalités/prix.' }
        };

        document.getElementById('quizRecoName').textContent = recos[best].name;
        document.getElementById('quizRecoText').textContent = recos[best].text;
        document.getElementById('quizResult').style.display = 'block';
        document.getElementById('quizResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
