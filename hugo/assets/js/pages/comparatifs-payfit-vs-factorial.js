// ====== MINI-OUTIL RAPIDE ======
    const qtAnswers = {};
    function qtAnswer(q, val) {
      qtAnswers[q] = val;
      document.getElementById('qtStep' + q).classList.remove('qt-active');
      if (q < 3) {
        document.getElementById('qtStep' + (q + 1)).classList.add('qt-active');
        document.getElementById('qtDot' + (q + 1)).classList.add('active');
      } else {
        document.getElementById('qtResult').classList.add('qt-active');
        showQtResult();
      }
    }
    function showQtResult() {
      const size = qtAnswers[1], need = qtAnswers[2], user = qtAnswers[3];
      let winner, reason;
      if (size === 'small' && user !== 'hr') {
        winner = 'PayFit';
        reason = 'Pour une structure de moins de 20 salariés sans RH dédié, PayFit est idéal : démarrage en quelques jours, paie 100% automatisée, interface intuitive même pour un non-expert.';
      } else if (size === 'large' || (size === 'mid' && need === 'sirh')) {
        winner = 'Factorial';
        reason = 'Pour votre taille et votre besoin, Factorial s\'impose : SIRH complet (congés, recrutement, formation, paie), multi-sites possible, application mobile soignée.';
      } else if (need === 'paie') {
        winner = 'PayFit';
        reason = 'Si la paie automatisée est votre priorité absolue, PayFit est idéal : 350+ conventions collectives, DSN native, mises à jour légales automatiques.';
      } else if (need === 'both' && size === 'mid') {
        winner = 'Factorial';
        reason = 'Entre 20 et 100 salariés avec un RH dédié, Factorial offre un excellent rapport paie + SIRH complet dans un seul outil, à un tarif compétitif.';
      } else if (user === 'compta') {
        winner = 'PayFit';
        reason = 'En collaboration avec un expert-comptable ou un cabinet paie, PayFit est plus adapté : interface simple, export comptable natif et bulletins faciles à contrôler.';
      } else {
        winner = 'Factorial';
        reason = 'Compte tenu de votre profil, Factorial offre un excellent équilibre entre SIRH complet et paie intégrée, avec un excellent rapport fonctionnalités/prix.';
      }
      document.getElementById('qtWinnerName').textContent = winner;
      document.getElementById('qtReason').textContent = reason;
    }
    function qtRestart() {
      Object.keys(qtAnswers).forEach(k => delete qtAnswers[k]);
      ['qtStep1','qtStep2','qtStep3','qtResult'].forEach(id => document.getElementById(id).classList.remove('qt-active'));
      ['qtDot2','qtDot3'].forEach(id => document.getElementById(id).classList.remove('active'));
      document.getElementById('qtStep1').classList.add('qt-active');
    }

    // ====== FAQ accordéon ======
    function toggleFaq(el) {
      const item = el.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    }

    // ====== TOC : lien actif au scroll ======
    (function() {
      const links = document.querySelectorAll('.toc a');
      const sections = [];

      links.forEach(link => {
        const id = link.getAttribute('href').replace('#', '');
        const el = document.getElementById(id);
        if (el) sections.push({ id, el, link });
      });

      function onScroll() {
        const scrollY = window.scrollY + 100;
        let current = sections[0];

        sections.forEach(s => {
          if (s.el.getBoundingClientRect().top + window.scrollY <= scrollY) {
            current = s;
          }
        });

        links.forEach(l => l.classList.remove('active'));
        if (current) current.link.classList.add('active');
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();
