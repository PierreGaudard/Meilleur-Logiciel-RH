(function () {
  var mobile = window.matchMedia('(max-width: 980px)');

  // Ferme les menus déroulants (navigation, menu mobile, recherche de l'en-tête) au clic extérieur.
  document.addEventListener('click', function (e) {
    document.querySelectorAll('details.nav-group[open], details.mobile-menu[open], details.header-search[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });

  // En-tête : le menu tient sur une ligne ; sinon, en ordinateur, il se resserre, puis passe sur sa propre ligne sous le
  // logo ; il ne passe dans le menu repliable (bouton à trois traits) que s'il ne tient pas non plus sur cette ligne.
  var header = document.querySelector('.site-header');
  var nav = header && header.querySelector('.site-nav');
  var ordi = window.matchMedia('(min-width: 981px)');
  // Débordement mesuré sur les boîtes des éléments (bords gauche et droit), pas sur scrollWidth : un ornement qui dépasse
  // (chevron tourné d'un sous-menu, ombre) ne compte pas. Tolérance de 2 px pour les arrondis de sous-pixels.
  function deborde(el) {
    if (!el || !el.getClientRects().length) return false;
    var r = el.getBoundingClientRect(), st = getComputedStyle(el);
    var g = r.left + (parseFloat(st.borderLeftWidth) || 0) + (parseFloat(st.paddingLeft) || 0);
    var d = r.right - (parseFloat(st.borderRightWidth) || 0) - (parseFloat(st.paddingRight) || 0);
    var min = Infinity, max = -Infinity;
    for (var i = 0; i < el.children.length; i++) {
      var c = el.children[i];
      if (!c.getClientRects().length) continue;
      var cr = c.getBoundingClientRect();
      if (cr.width === 0 && cr.height === 0) continue;
      if (cr.left < min) min = cr.left;
      if (cr.right > max) max = cr.right;
    }
    if (max === -Infinity) return false;
    return max - d > 2 || g - min > 2;
  }
  // Texte coupé par des points de suspension : le moindre pixel de dépassement se voit, pas de tolérance.
  function texteCoupe(el) { return !!el && el.scrollWidth > el.clientWidth; }
  function ajusterMenu() {
    if (!header || !nav) return;
    header.classList.remove('nav-collapsed', 'header-compact', 'nav-serre', 'nav-deux-lignes');
    var interieur = header.querySelector('.header-inner');
    if (getComputedStyle(nav).display === 'none') {
      // Petit écran : si le logo, les langues et le bouton du menu ne tiennent pas, les langues passent dans le menu.
      if (deborde(interieur) || texteCoupe(header.querySelector('.site-logo-text'))) header.classList.add('header-compact');
      majHauteur();
      return;
    }
    function trop() { return deborde(nav) || deborde(interieur); }
    if (trop() && ordi.matches) {
      header.classList.add('nav-serre');
      if (trop() && !header.classList.contains('header-centre') && !header.classList.contains('header-deux-lignes')) {
        header.classList.add('nav-deux-lignes');
        if (trop()) header.classList.remove('nav-deux-lignes');
      }
    }
    if (trop()) {
      header.classList.remove('nav-serre', 'nav-deux-lignes');
      header.classList.add('nav-collapsed');
    }
    majHauteur();
  }
  // Hauteur de l'en-tête (en-tête transparent posé sur le héros, sommaire collant).
  function majHauteur() { if (header) document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px'); }
  var attente = null;
  function planifier() { if (attente) cancelAnimationFrame(attente); attente = requestAnimationFrame(ajusterMenu); }
  ajusterMenu();
  window.addEventListener('resize', planifier);
  // Les polices Google arrivent après le premier rendu : nouvelle mesure quand elles sont chargées.
  if (document.fonts) {
    if (document.fonts.ready) document.fonts.ready.then(planifier);
    if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', planifier);
  }
  window.addEventListener('load', planifier);

  // En-tête transparent sur la photo du héros : fond plein dès que la page défile ou qu'un menu est ouvert.
  if (header && header.classList.contains('header-transparent')) {
    var plein = function () {
      var ouvert = header.querySelector('details[open]');
      header.classList.toggle('is-solid', window.scrollY > 24 || !!ouvert);
    };
    window.addEventListener('scroll', plein, { passive: true });
    header.querySelectorAll('details').forEach(function (d) { d.addEventListener('toggle', plein); });
    plein();
  }

  // Recherche de l'en-tête : le champ prend le focus à l'ouverture.
  document.querySelectorAll('details.header-search').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      var i = d.querySelector('input'); if (i) setTimeout(function () { i.focus(); }, 30);
    });
  });

  // Mode sombre au choix du lecteur : préférence gardée dans le navigateur (jamais transmise).
  document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
    var html = document.documentElement;
    function maj() {
      var sombre = html.getAttribute('data-theme') === 'sombre';
      b.setAttribute('aria-pressed', sombre ? 'true' : 'false');
      var l = b.getAttribute(sombre ? 'data-label-light' : 'data-label-dark') || '';
      b.setAttribute('aria-label', l); b.setAttribute('title', l);
    }
    b.addEventListener('click', function () {
      var sombre = html.getAttribute('data-theme') !== 'sombre';
      if (sombre) html.setAttribute('data-theme', 'sombre'); else html.removeAttribute('data-theme');
      try { localStorage.setItem('theme', sombre ? 'sombre' : 'clair'); } catch (e) {}
      maj();
    });
    maj();
  });

  // Sous-menus de l'en-tête : jamais hors de l'écran.
  document.querySelectorAll('.site-nav details.nav-group').forEach(function (d) {
    d.addEventListener('toggle', function () {
      var dd = d.querySelector('.nav-dropdown');
      if (!dd || !d.open) return;
      dd.classList.remove('is-flipped');
      if (dd.getBoundingClientRect().right > document.documentElement.clientWidth - 8) dd.classList.add('is-flipped');
    });
  });

  // Copier le lien de l'article.
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
        var prev = btn.textContent;
        btn.textContent = btn.getAttribute('data-copied') || prev;
        setTimeout(function () { btn.textContent = prev; }, 1600);
      });
    });
  });

  // Tableaux du contenu : conteneur à défilement horizontal, ombre sur le bord qui reste à voir, indice au-dessus.
  var indice = document.documentElement.getAttribute('data-table-hint') || '';
  document.querySelectorAll('.prose table').forEach(function (t) {
    if (t.closest('.table-scroll-inner')) return;
    var wrap = document.createElement('div'); wrap.className = 'table-scroll';
    var hint = document.createElement('p'); hint.className = 'table-scroll-hint'; hint.textContent = indice;
    var box = document.createElement('div'); box.className = 'table-scroll-box';
    var inner = document.createElement('div'); inner.className = 'table-scroll-inner';
    inner.setAttribute('tabindex', '0');
    t.parentNode.insertBefore(wrap, t);
    wrap.appendChild(hint); wrap.appendChild(box); box.appendChild(inner); inner.appendChild(t);
    var row = t.rows && t.rows[0];
    if (row && row.cells.length >= 4) wrap.classList.add('is-wide');
    function maj() {
      var max = inner.scrollWidth - inner.clientWidth;
      wrap.classList.toggle('is-scrollable', max > 2);
      wrap.classList.toggle('can-left', inner.scrollLeft > 2);
      wrap.classList.toggle('can-right', inner.scrollLeft < max - 2);
    }
    inner.addEventListener('scroll', maj, { passive: true });
    window.addEventListener('resize', maj);
    maj();
  });

  // Sommaire : replié par défaut sur petit écran, collant seulement s'il tient dans la hauteur de l'écran.
  document.querySelectorAll('details.toc').forEach(function (toc) {
    if (mobile.matches) toc.open = false;
    toc.setAttribute('data-toc-init', '');
    function collant() { toc.classList.toggle('toc-sticky', !mobile.matches && toc.offsetHeight < window.innerHeight - 110); }
    collant();
    window.addEventListener('resize', collant);
    toc.addEventListener('toggle', collant);
  });

  // Sommaire : entrée active au défilement.
  var tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-80px 0px -60% 0px' });
    document.querySelectorAll('.post-content h2[id], .post-content h3[id]').forEach(function (h) { obs.observe(h); });
  }

  // Recherche sur l'index JSON de la langue.
  document.querySelectorAll('[data-search]').forEach(function (box) {
    var url = box.getAttribute('data-search');
    var input = box.querySelector('[data-search-input]');
    var panel = box.querySelector('[data-search-results]');
    var list = box.querySelector('[data-search-list]');
    var empty = box.querySelector('[data-search-empty]');
    var data = null, loading = null;
    // Texte d'aide raccourci quand le champ est trop étroit pour l'afficher en entier.
    var longPh = input.getAttribute('placeholder') || '', shortPh = input.getAttribute('data-placeholder-short') || '';
    function placeholder() {
      if (!shortPh) return;
      var c = document.createElement('canvas').getContext('2d'), st = getComputedStyle(input);
      c.font = st.fontWeight + ' ' + st.fontSize + ' ' + st.fontFamily;
      var dispo = input.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight) - 12;
      input.setAttribute('placeholder', c.measureText(longPh).width > dispo ? shortPh : longPh);
    }
    placeholder();
    window.addEventListener('resize', placeholder);
    window.addEventListener('load', placeholder);
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', placeholder);
    function norm(s) { return (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function load() {
      if (!loading) loading = fetch(url).then(function (r) { return r.json(); }).then(function (j) { data = j; return j; }).catch(function () { data = []; });
      return loading;
    }
    function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
    function render() {
      var q = norm(input.value.trim());
      if (q.length < 2) { panel.hidden = true; return; }
      load().then(function () {
        var hits = data.filter(function (it) {
          return norm([it.title, it.description, (it.categories || []).join(' '), (it.tags || []).join(' ')].join(' ')).indexOf(q) !== -1;
        }).slice(0, 8);
        list.innerHTML = hits.map(function (it) {
          return '<li><a href="' + esc(it.url) + '"><strong>' + esc(it.title) + '</strong><span>' + esc(it.description) + '</span></a></li>';
        }).join('');
        empty.hidden = hits.length > 0;
        panel.hidden = false;
      });
    }
    input.addEventListener('focus', load);
    input.addEventListener('input', render);
    box.querySelector('form').addEventListener('submit', function (e) { e.preventDefault(); render(); });
    var q = new URLSearchParams(window.location.search).get('q');
    var enTete = box.hasAttribute('data-search-header');
    if (q && (!enTete || !document.querySelector('[data-search]:not([data-search-header])'))) {
      input.value = q; render();
      if (enTete) { var d = box.closest('details'); if (d) d.open = true; }
    }
  });
})();
