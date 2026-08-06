//* Sidebar toggle

export function sidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  document.getElementById('hamburger').addEventListener('click', () => sidebar.classList.toggle('open'));
  sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (window.innerWidth <= 980) sidebar.classList.remove('open');
  }));
}