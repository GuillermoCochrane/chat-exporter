//* Theme toggle
import { $ , setText } from "../utilities/dom.js"

export function themeToggle() {
  // ---------- THEME TOGGLE ----------
  const $themeToggle = $('#themeToggle');
  const $html = document.documentElement;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  const themeIcon = currentTheme === 'dark' ? '☀️' : '🌙';

  $html.setAttribute('data-theme', currentTheme);
  setText("#themeToggle", themeIcon);

  $themeToggle.addEventListener('click', () => {
      const newTheme = $html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      $html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      setText("#themeToggle", newTheme === 'dark' ? '☀️' : '🌙');
  });
}