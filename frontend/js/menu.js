// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.getElementById('menuButton');
  const navMenu = document.getElementById('navMenu');
  const authButtons = document.querySelector('.auth-buttons');

  // Toggle menu ao clicar no botão
  menuButton.addEventListener('click', function() {
    const isNavOpen = navMenu.classList.contains('nav-open');
    const isAuthOpen = authButtons.classList.contains('auth-open');

    // Se um está aberto, fecha; se nenhum está aberto, abre ambos
    if (isNavOpen || isAuthOpen) {
      navMenu.classList.remove('nav-open');
      authButtons.classList.remove('auth-open');
      menuButton.classList.remove('menu-open');
    } else {
      navMenu.classList.add('nav-open');
      authButtons.classList.add('auth-open');
      menuButton.classList.add('menu-open');
    }
  });

  // Fechar menu ao clicar em um link de navegação
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuButton.classList.remove('menu-open');
      navMenu.classList.remove('nav-open');
      authButtons.classList.remove('auth-open');
    });
  });

  // Fechar menu ao clicar em botões de auth
  const authLinks = authButtons.querySelectorAll('a');
  authLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuButton.classList.remove('menu-open');
      navMenu.classList.remove('nav-open');
      authButtons.classList.remove('auth-open');
    });
  });
});
