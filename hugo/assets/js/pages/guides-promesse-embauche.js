// ====== GENERATEUR DE PROMESSE ======
    function genererPromesse() {
      var type = document.getElementById('typeDoc').value;
      var typeContrat = document.getElementById('typeContrat').value;
      var nomEmployeur = document.getElementById('nomEmployeur').value || '[Nom de l\'entreprise]';
      var adresseEmployeur = document.getElementById('adresseEmployeur').value || '[Adresse de l\'entreprise]';
      var siret = document.getElementById('siret').value || '[SIRET]';
      var signataire = document.getElementById('signataire').value || '[Nom et qualité du signataire]';
      var nomCandidat = document.getElementById('nomCandidat').value || '[Nom du candidat]';
      var adresseCandidat = document.getElementById('adresseCandidat').value || '[Adresse du candidat]';
      var intitulePoste = document.getElementById('intitulePoste').value || '[Intitulé du poste]';
      var salaire = document.getElementById('salaire').value || '[Rémunération]';
      var dateDebut = document.getElementById('dateDebut').value;
      var lieuTravail = document.getElementById('lieuTravail').value || '[Lieu de travail]';
      var periodEssai = document.getElementById('periodEssai').value || '[Durée de la période d\'essai]';
      var convention = document.getElementById('convention').value || '[Convention collective]';
      var delaiReponse = document.getElementById('delaiReponse').value || '10';
      var avantages = document.getElementById('avantages').value;

      if (dateDebut) {
        var parts = dateDebut.split('-');
        dateDebut = parts[2] + '/' + parts[1] + '/' + parts[0];
      } else {
        dateDebut = '[Date de prise de fonction]';
      }

      var today = new Date();
      var dateJour = today.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

      var texte = '';

      if (type === 'promesse') {
        texte += nomEmployeur + '\n';
        texte += adresseEmployeur + '\n';
        texte += 'SIRET : ' + siret + '\n\n';
        texte += 'À l\'attention de ' + nomCandidat + '\n';
        texte += adresseCandidat + '\n\n';
        texte += 'Fait le ' + dateJour + '\n\n';
        texte += 'Objet : Promesse unilatérale de contrat de travail\n\n';
        texte += 'Madame, Monsieur,\n\n';
        texte += 'À la suite de nos entretiens, nous avons le plaisir de vous confirmer notre engagement ferme de vous recruter aux conditions suivantes :\n\n';
        texte += 'Par la présente, ' + nomEmployeur + ', représentée par ' + signataire + ', s\'engage irrévocablement à vous embaucher selon les modalités ci-après :\n\n';
        texte += '- Poste : ' + intitulePoste + '\n';
        texte += '- Type de contrat : ' + typeContrat + '\n';
        texte += '- Rémunération brute annuelle : ' + salaire + '\n';
        if (avantages) texte += '- Avantages : ' + avantages + '\n';
        texte += '- Date de prise de fonction : ' + dateDebut + '\n';
        texte += '- Lieu de travail : ' + lieuTravail + '\n';
        texte += '- Période d\'essai : ' + periodEssai + '\n';
        texte += '- Convention collective applicable : ' + convention + '\n\n';
        texte += 'Cette promesse vous est consentie pour une durée de ' + delaiReponse + ' jours à compter de sa réception. Vous disposez de ce délai pour nous faire part de votre acceptation. Passé ce délai, la présente promesse sera caduque.\n\n';
        texte += 'En cas d\'acceptation de votre part, le contrat de travail sera considéré comme définitivement formé aux conditions ci-dessus mentionnées.\n\n';
        texte += 'Nous vous prions d\'agréer, Madame, Monsieur, l\'expression de nos salutations distinguées.\n\n\n';
        texte += signataire + '\n';
        texte += nomEmployeur;
      } else {
        texte += nomEmployeur + '\n';
        texte += adresseEmployeur + '\n';
        texte += 'SIRET : ' + siret + '\n\n';
        texte += 'À l\'attention de ' + nomCandidat + '\n';
        texte += adresseCandidat + '\n\n';
        texte += 'Fait le ' + dateJour + '\n\n';
        texte += 'Objet : Offre de contrat de travail\n\n';
        texte += 'Madame, Monsieur,\n\n';
        texte += 'À la suite de nos entretiens, nous avons le plaisir de vous proposer de rejoindre ' + nomEmployeur + ' aux conditions suivantes :\n\n';
        texte += '- Poste : ' + intitulePoste + '\n';
        texte += '- Type de contrat : ' + typeContrat + '\n';
        texte += '- Rémunération brute annuelle : ' + salaire + '\n';
        if (avantages) texte += '- Avantages : ' + avantages + '\n';
        texte += '- Date de prise de fonction envisagée : ' + dateDebut + '\n';
        texte += '- Lieu de travail : ' + lieuTravail + '\n';
        texte += '- Période d\'essai : ' + periodEssai + '\n';
        texte += '- Convention collective applicable : ' + convention + '\n\n';
        texte += 'Cette offre est valable pour une durée de ' + delaiReponse + ' jours à compter de sa réception. Nous vous invitons à nous faire part de votre décision dans ce délai.\n\n';
        texte += 'En cas d\'acceptation, un contrat de travail reprenant l\'ensemble de ces conditions vous sera adressé pour signature.\n\n';
        texte += 'Nous vous prions d\'agréer, Madame, Monsieur, l\'expression de nos salutations distinguées.\n\n\n';
        texte += signataire + '\n';
        texte += nomEmployeur;
      }

      document.getElementById('previewContent').textContent = texte;
      document.getElementById('previewZone').style.display = 'block';
      document.getElementById('previewZone').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function copierTexte() {
      var texte = document.getElementById('previewContent').textContent;
      navigator.clipboard.writeText(texte).then(function() {
        var el = document.getElementById('copySuccess');
        el.style.display = 'inline';
        setTimeout(function() { el.style.display = 'none'; }, 2000);
      });
    }

    function resetForm() {
      var inputs = document.querySelectorAll('#promesseForm input, #promesseForm select');
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'number') {
          inputs[i].value = '10';
        } else if (inputs[i].tagName === 'SELECT') {
          inputs[i].selectedIndex = 0;
        } else {
          inputs[i].value = '';
        }
      }
      document.getElementById('previewZone').style.display = 'none';
    }

    // ====== FAQ accordion ======
    function toggleFaq(el) {
      var item = el.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      var allItems = document.querySelectorAll('.faq-item.open');
      for (var i = 0; i < allItems.length; i++) {
        allItems[i].classList.remove('open');
      }
      if (!isOpen) item.classList.add('open');
    }

    // ====== TOC : active link on scroll ======
    (function() {
      var links = document.querySelectorAll('.toc a');
      var sections = [];

      for (var i = 0; i < links.length; i++) {
        var id = links[i].getAttribute('href').replace('#', '');
        var el = document.getElementById(id);
        if (el) sections.push({ id: id, el: el, link: links[i] });
      }

      function onScroll() {
        var scrollY = window.scrollY + 100;
        var current = sections[0];

        for (var i = 0; i < sections.length; i++) {
          if (sections[i].el.getBoundingClientRect().top + window.scrollY <= scrollY) {
            current = sections[i];
          }
        }

        for (var j = 0; j < links.length; j++) {
          links[j].classList.remove('active');
        }
        if (current) current.link.classList.add('active');
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();
