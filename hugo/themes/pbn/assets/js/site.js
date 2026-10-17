(function () {
  var mobile = window.matchMedia('(max-width: 980px)');

  // Ferme les menus déroulants (navigation, menu mobile) au clic extérieur.
  document.addEventListener('click', function (e) {
    document.querySelectorAll('details.nav-group[open], details.mobile-menu[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });

  // En-tête : le menu tient sur une ligne, sinon il passe dans le menu repliable (bouton à trois traits).
  var header = document.querySelector('.site-header');
  var nav = header && header.querySelector('.site-nav');
  function ajusterMenu() {
    if (!header || !nav) return;
    header.classList.remove('nav-collapsed', 'header-compact');
    var interieur = header.querySelector('.header-inner');
    if (getComputedStyle(nav).display === 'none') {
      // Petit écran : si le logo, les langues et le bouton du menu ne tiennent pas, les langues passent dans le menu.
      var nom = header.querySelector('.site-logo-text');
      if ((interieur && interieur.scrollWidth > interieur.clientWidth + 1) || (nom && nom.scrollWidth > nom.clientWidth + 1)) header.classList.add('header-compact');
      return;
    }
    var trop = nav.scrollWidth > nav.clientWidth + 1;
    if (!trop && interieur) trop = interieur.scrollWidth > interieur.clientWidth + 1;
    if (trop) header.classList.add('nav-collapsed');
  }
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
    if (q) { input.value = q; render(); }
  });
})();
