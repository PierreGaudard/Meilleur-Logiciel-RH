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
      const who = qtAnswers[1], size = qtAnswers[2], complexity = qtAnswers[3];
      let winner, reason;
      if (who === 'cabinet') {
        winner = 'Silae';
        reason = 'Votre paie est gérée par un cabinet comptable ou un prestataire externe. Silae est conçu pour les professionnels de la paie, avec 900+ conventions collectives et une forte productivité.';
      } else if (complexity === 'complex') {
        winner = 'Silae';
        reason = 'Avec une paie complexe (multi-conventions, BTP, HCR, spectacle...), Silae est particulièrement adapté. Son moteur de paie gère nativement les cas complexes.';
      } else if (who === 'self' && size === 'small') {
        winner = 'PayFit';
        reason = 'Pour une TPE sans expert paie dédié, PayFit est idéal : démarrage en quelques jours, paie 100% automatisée, interface intuitive même pour un non-expert. Pas besoin de passer par un cabinet.';
      } else if (who === 'self') {
        winner = 'PayFit';
        reason = 'Sans gestionnaire de paie dédié, PayFit est un choix adapté : interface simple, paie automatisée et support réactif. Silae s’adresse plutôt aux structures qui travaillent avec un partenaire externe.';
      } else if (who === 'hr' && size === 'large') {
        winner = 'Silae';
        reason = 'Avec plus de 100 salariés et un RH dédié, Silae offre la puissance et la scalabilité nécessaires. Un gestionnaire formé peut traiter 300 à 500 bulletins par mois.';
      } else if (who === 'hr' && complexity === 'medium') {
        winner = 'Silae';
        reason = 'Avec des spécificités sectorielles et un RH dédié, Silae est un investissement pertinent sur le long terme. Le paramétrage initial, réalisé par un partenaire certifié, offre une couverture fonctionnelle étendue.';
      } else {
        winner = 'PayFit';
        reason = 'Compte tenu de votre profil, PayFit offre un bon équilibre entre simplicité et couverture fonctionnelle. Si vos besoins évoluent vers plus de complexité, vous pourrez toujours migrer vers Silae.';
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
      function update() {
        let current = sections[0];
        sections.forEach(s => { if (s.el.getBoundingClientRect().top <= 120) current = s; });
        links.forEach(l => l.classList.remove('active'));
        if (current) current.link.classList.add('active');
      }
      window.addEventListener('scroll', update, { passive: true });
      update();
    })();

    // ====== Menu burger ======
    (function(){
      var burger = document.querySelector('.nav-burger');
      var nav = document.querySelector('.site-nav');
      if(!burger || !nav) return;
      burger.addEventListener('click', function(){
        var open = nav.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open);
      });
      document.addEventListener('click', function(e){
        if(!burger.contains(e.target) && !nav.contains(e.target)){
          nav.classList.remove('open');
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    })();
