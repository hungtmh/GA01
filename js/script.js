// GA01 Group Website - basic interactivity
(function(){
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('primaryMenu');
  if(!toggle || !menu) return;
  toggle.addEventListener('click', function(){
    const open = menu.style.display === 'block';
    menu.style.display = open ? 'none' : 'block';
    toggle.setAttribute('aria-expanded', String(!open));
  });
  // Close menu on resize to desktop
  window.addEventListener('resize', function(){
    if(window.innerWidth > 560){
      menu.style.display = '';
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
