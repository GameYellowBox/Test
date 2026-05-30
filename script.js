const html = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

html.setAttribute('data-theme', savedTheme);
if (toggleBtn) updateBtnText(savedTheme);

toggleBtn?.addEventListener('click', () => {
  const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateBtnText(newTheme);
});

function updateBtnText(theme) {
  if (toggleBtn) toggleBtn.textContent = theme === 'light' ? '🌙 暗黑' : '☀️ 明亮';
}

// 自动更新页脚年份
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
