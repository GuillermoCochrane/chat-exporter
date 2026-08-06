//* Theme toggle

export function themeToggle() {
  document.getElementById('themeToggle').addEventListener('click', () => document.body.classList.toggle('light'));
}