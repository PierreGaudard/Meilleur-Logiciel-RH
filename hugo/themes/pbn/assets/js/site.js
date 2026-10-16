(function () {
  // Ferme les menus déroulants (langue, navigation) au clic extérieur.
  document.addEventListener('click', function (e) {
    document.querySelectorAll('details.lang-switcher[open], details.nav-group[open], details.mobile-menu[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
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
