// A-Z nav
    (function() {
      var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      var bar = document.getElementById('az-nav-bar');
      var available = {};
      document.querySelectorAll('.letter-block').forEach(function(b) {
        var id = b.id;
        var letter = id.replace('letter-','').toUpperCase();
        available[letter] = true;
      });
      letters.forEach(function(L) {
        var a = document.createElement('a');
        a.textContent = L;
        if (available[L]) {
          a.href = '#letter-' + L.toLowerCase();
          a.className = 'has-content';
        } else {
          a.className = 'disabled';
        }
        bar.appendChild(a);
      });
    })();

    // Search filter
    (function() {
      var input = document.getElementById('def-search');
      var items = document.querySelectorAll('.def-item');
      var blocks = document.querySelectorAll('.letter-block');
      var empty = document.getElementById('empty-state');
      function normalize(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
      input.addEventListener('input', function() {
        var q = normalize(input.value.trim());
        var visibleCount = 0;
        items.forEach(function(it) {
          var name = normalize(it.getAttribute('data-name') || '');
          var match = !q || name.indexOf(q) !== -1;
          it.style.display = match ? '' : 'none';
          if (match) visibleCount++;
        });
        blocks.forEach(function(b) {
          var visibleItems = b.querySelectorAll('.def-item:not([style*="display: none"])').length;
          b.style.display = visibleItems > 0 ? '' : 'none';
        });
        empty.style.display = visibleCount === 0 ? 'block' : 'none';
      });
    })();

    // Burger
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
