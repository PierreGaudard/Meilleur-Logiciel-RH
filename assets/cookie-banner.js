// Sommaire repliable sur mobile
(function() {
  var toc = document.querySelector('.toc');
  var tocTitle = document.querySelector('.toc-title');
  if (!toc || !tocTitle) return;
  tocTitle.addEventListener('click', function() {
    toc.classList.toggle('open');
  });
})();
