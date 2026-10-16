// === STATE ===
    const answers = { needs: [] };
    let currentStep = 1;
    const TOTAL = 8;

    // === NAVIGATION ===
    function goToStep(n, btn) {
      if (btn) {
        const val = btn.dataset.val;
        const stepAnswerKey = {1:'size',2:'current',3:'manager',5:'budget',6:'structure',7:'sector',8:'delay'};
        if (stepAnswerKey[currentStep]) answers[stepAnswerKey[currentStep]] = val;
        // mark selection
        btn.closest('.options-grid, .options-col').querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      }

      // step dots
      document.getElementById('psDot' + currentStep).className = 'ps-dot done';
      document.getElementById('step' + currentStep).classList.remove('active');

      currentStep = n;
      if (n <= TOTAL) {
        document.getElementById('step' + n).classList.add('active');
        document.getElementById('psDot' + n).className = 'ps-dot current';
        const pct = Math.round((n / TOTAL) * 100);
        document.getElementById('progressFill').style.width = pct + '%';
        document.getElementById('progressLabel').textContent = 'Question ' + n + ' sur ' + TOTAL;
        document.getElementById('progressPct').textContent = pct + '%';
        document.getElementById('progressWrap').scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }

    // Multi-select q4
    document.querySelectorAll('#needsGrid .option-btn.multi').forEach(btn => {
      btn.addEventListener('click', function() {
        this.classList.toggle('selected');
        const val = this.dataset.val;
        if (this.classList.contains('selected')) {
          if (!answers.needs.includes(val)) answers.needs.push(val);
        } else {
          answers.needs = answers.needs.filter(v => v !== val);
        }
      });
    });

    // === COMPUTE RESULT ===
    function computeResult(btn) {
      if (btn) {
        btn.closest('.options-col').querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers.delay = btn.dataset.val;
      }

      // Hide quiz, show progress
      document.getElementById('step8').classList.remove('active');
      document.getElementById('progressWrap').style.display = 'none';

      // Scoring
      const s = answers.size, cur = answers.current, mgr = answers.manager;
      const needs = answers.needs, budget = answers.budget;
      const struct = answers.structure, sector = answers.sector, delay = answers.delay;

      let rec = pickRec(s, cur, mgr, needs, budget, struct, sector, delay);
      renderResult(rec);
      document.getElementById('resultWrap').classList.add('visible');
      document.getElementById('resultWrap').scrollIntoView({behavior: 'smooth', block: 'start'});
    }

    function pickRec(size, cur, mgr, needs, budget, struct, sector, delay) {
      // Special cases
      var logos = {
        'PayFit': 'assets/images/payfit-logo.png',
        'Factorial': 'assets/images/factorial.png',
        'Lucca': 'assets/images/luca-logo.webp',
        'Silae': 'assets/images/silae-logo.png',
        'Kelio': 'assets/images/kelio-logo.webp',
        'Skello': 'assets/images/skello logo.png',
        'Nibelis': 'assets/images/nibelis-logo.webp',
        'Cegid': '',
        'BambooHR': ''
      };

      if (sector === 'chr') {
        return {
          name: 'Skello', color: '#15803d', bg: '#f0fdf4', logo: logos['Skello'],
          tagline: 'Pour la gestion des plannings en CHR et retail',
          desc: 'Skello est conçu spécifiquement pour les secteurs à horaires variables. Sa gestion des plannings, du pointage et des contrats courts est pensée pour la restauration, l\'hôtellerie et le commerce.',
          reasons: ['Planning drag & drop avec contraintes légales automatiques', 'Gestion des extras, CDD courts et heures sup', 'Conformité CCN CHR et retail intégrée', 'Application mobile pour les équipes terrain', 'Intégration paie via PayFit ou Silae'],
          cta: 'avis/',
          alts: [{name:'PayFit',desc:'Pour la paie',logo:logos['PayFit']},{name:'Factorial',desc:'Pour le SIRH',logo:logos['Factorial']},{name:'Kelio',desc:'Alternative planning',logo:logos['Kelio']}]
        };
      }
      if (struct === 'multi-ccn' || struct === 'multi-pays' || size === '200+') {
        return {
          name: 'Silae', color: '#7c3aed', bg: '#f5f3ff', logo: logos['Silae'],
          tagline: 'Pour la paie des structures complexes',
          desc: 'Silae est le moteur de paie le plus puissant du marché français. Il gère les conventions collectives multiples, les multi-établissements, les paies atypiques et s\'intègre aux outils SIRH du marché.',
          reasons: ['Gestion de 400+ conventions collectives', 'Multi-établissements et multi-sociétés natif', 'Utilisé par 30 000+ cabinets comptables en France', 'Reporting paie très avancé', 'Intégrations SIRH (Lucca, Factorial, Cegid)'],
          cta: 'comparatifs/',
          alts: [{name:'Nibelis',desc:'Alternative experte',logo:logos['Nibelis']},{name:'Lucca',desc:'Pour les grandes structures',logo:logos['Lucca']},{name:'PayFit',desc:'Si la structure se simplifie',logo:logos['PayFit']}]
        };
      }
      if ((size === '1-9' || size === '10-49') && mgr !== 'rh' && delay === 'urgent') {
        return {
          name: 'PayFit', color: '#15803d', bg: '#f0fdf4', logo: logos['PayFit'],
          tagline: 'La paie automatisée idéale pour TPE et startups',
          desc: 'PayFit est la solution la plus rapide à déployer pour une PME sans service RH. Mise en production en moins d\'une semaine, paie 100% automatisée, DSN native et interface ultra-simple.',
          reasons: ['Onboarding en moins d\'une semaine', 'Paie et DSN 100% automatisées', '350+ conventions collectives couvertes', 'Interface intuitive sans formation', 'Support francophone très réactif'],
          cta: 'comparatifs/payfit-vs-factorial.html',
          alts: [{name:'Factorial',desc:'Si vous avez un RH dédié',logo:logos['Factorial']},{name:'Silae',desc:'Pour les paies complexes',logo:logos['Silae']},{name:'Lucca',desc:'Pour un SIRH modulaire',logo:logos['Lucca']}]
        };
      }
      if (needs.includes('recrutement') || needs.includes('onboarding') || (size === '50-199' && mgr === 'rh')) {
        return {
          name: 'Factorial', color: '#FF5C35', bg: '#fff4f0', logo: logos['Factorial'],
          tagline: 'Le SIRH complet pour PME de 20 à 300 salariés',
          desc: 'Factorial couvre l\'intégralité de la chaîne RH : recrutement, onboarding, gestion des congés, suivi du temps, entretiens, formation et paie. Un seul outil pour votre DRH.',
          reasons: ['SIRH complet en un seul outil', 'Module recrutement avec pipeline natif', 'Gestion des entretiens et de la formation', 'Paie française intégrée (ou via Silae)', 'Application mobile soignée pour les collaborateurs'],
          cta: 'comparatifs/payfit-vs-factorial.html',
          alts: [{name:'Lucca',desc:'SIRH modulaire français',logo:logos['Lucca']},{name:'PayFit',desc:'Si la paie prime sur le SIRH',logo:logos['PayFit']},{name:'Silae',desc:'Alternative internationale',logo:logos['Silae']}]
        };
      }
      if (size === '50-199' && (struct === 'simple' || struct === 'multi-site')) {
        return {
          name: 'Lucca', color: '#0891b2', bg: '#ecfeff', logo: logos['Lucca'],
          tagline: 'Le SIRH modulaire français pour PME exigeantes',
          desc: 'Lucca propose des modules à la carte que vous activez selon vos besoins : Pagga (paie via Silae), Figgo (congés), Cleemy (frais), Elevo (entretiens). Idéal pour les PME françaises structurées.',
          reasons: ['Modules indépendants : payez ce que vous utilisez', 'Excellente expérience collaborateur', 'Intégration native avec Silae pour la paie', 'Made in France, support en français', 'Très bonne conformité droit du travail'],
          cta: 'comparatifs/',
          alts: [{name:'Factorial',desc:'Alternative tout-en-un',logo:logos['Factorial']},{name:'PayFit',desc:'Si vous privilégiez la paie',logo:logos['PayFit']},{name:'Silae',desc:'Pour les structures plus grandes',logo:logos['Silae']}]
        };
      }
      if (sector === 'sante' || needs.includes('temps') && size !== '1-9') {
        return {
          name: 'Kelio', color: '#0f766e', bg: '#f0fdfa', logo: logos['Kelio'],
          tagline: 'Pour la gestion des temps et des accès',
          desc: 'Kelio (ex-Bodet Software) est le spécialiste de la gestion des temps, des plannings et du contrôle d\'accès. Particulièrement apprécié dans la santé, l\'industrie et les collectivités.',
          reasons: ['Gestion des temps très poussée', 'Contrôle d\'accès intégrable', 'Adapté aux secteurs réglementés (santé, industrie)', 'Terminaux de pointage physiques disponibles', 'Interfaçage avec les principaux logiciels de paie'],
          cta: 'comparatifs/',
          alts: [{name:'PayFit',desc:'Pour la paie',logo:logos['PayFit']},{name:'Skello',desc:'Pour le planning',logo:logos['Skello']},{name:'Factorial',desc:'Pour le SIRH complet',logo:logos['Factorial']}]
        };
      }
      // Default
      return {
        name: 'PayFit', color: '#15803d', bg: '#f0fdf4', logo: logos['PayFit'],
        tagline: 'La paie automatisée idéale pour les PME françaises',
        desc: 'Pour la majorité des PME françaises, PayFit est un excellent point de départ : déploiement rapide, paie automatisée et interface accessible à tous, même sans expertise RH.',
        reasons: ['Démarrage en moins d\'une semaine', 'Paie et DSN automatisées', '350+ conventions collectives', 'Interface sans formation requise', 'Hébergement 100% France (ISO 27001)'],
        cta: 'comparatifs/payfit-vs-factorial.html',
        alts: [{name:'Factorial',desc:'Si vous avez un RH dédié',logo:logos['Factorial']},{name:'Silae',desc:'Pour une paie complexe',logo:logos['Silae']},{name:'Lucca',desc:'Pour un SIRH modulaire',logo:logos['Lucca']}]
      };
    }

    function renderResult(rec) {
      if (rec.logo) {
        document.getElementById('rLogo').innerHTML = '<img src="' + rec.logo + '" alt="' + rec.name + '">';
      } else {
        document.getElementById('rLogo').innerHTML = '<span style="font-size:2.2rem;font-weight:700">' + rec.name.charAt(0) + '</span>';
      }
      document.getElementById('rLogo').style.background = rec.bg;
      document.getElementById('rName').textContent = rec.name;
      document.getElementById('rName').style.color = rec.color;
      document.getElementById('rTagline').textContent = rec.tagline;
      document.getElementById('rDesc').textContent = rec.desc;
      document.getElementById('rWhyList').innerHTML = rec.reasons.map(r => '<li>' + r + '</li>').join('');
      document.getElementById('rCta').href = rec.cta;
      document.getElementById('rAlts').innerHTML = rec.alts.map(a =>
        '<div class="alt-card-sm">' +
        (a.logo ? '<img src="' + a.logo + '" alt="' + a.name + '">' : '') +
        '<div class="alt-info"><strong>' + a.name + '</strong><span>' + a.desc + '</span></div></div>'
      ).join('');
    }

    function restartQuiz() {
      answers.needs = [];
      ['size','current','manager','budget','structure','sector','delay'].forEach(k => delete answers[k]);
      document.getElementById('resultWrap').classList.remove('visible');
      document.getElementById('progressWrap').style.display = 'block';
      document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      for (let i = 1; i <= 8; i++) {
        const dot = document.getElementById('psDot' + i);
        if (dot) dot.className = 'ps-dot' + (i === 1 ? ' current' : '');
      }
      currentStep = 1;
      document.getElementById('step1').classList.add('active');
      document.getElementById('progressFill').style.width = '13%';
      document.getElementById('progressLabel').textContent = 'Question 1 sur 8';
      document.getElementById('progressPct').textContent = '13%';
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
