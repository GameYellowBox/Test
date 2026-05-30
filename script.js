(() => {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  
  // 1. 极速主题初始化（防止白屏闪烁）
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  html.setAttribute('data-theme', theme);
  updateToggleIcon(theme);

  // 2. 主题切换
  toggleBtn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcon(next);
  });

  function updateToggleIcon(t) {
    if (toggleBtn) toggleBtn.innerHTML = t === 'light' ? '🌙 暗黑' : '☀️ 明亮';
  }

  // 3. 导航高亮（根据当前 URL 自动激活）
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 4. 博客实时搜索过滤
  const searchInput = document.getElementById('blog-search');
  const articles = document.querySelectorAll('.article-card');
  searchInput?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    articles.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(term) ? 'block' : 'none';
    });
  });

  // 5. 返回顶部按钮
  const backBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backBtn?.classList.toggle('visible', window.scrollY > 300);
  });
  backBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // 6. 404 鼠标视差背景（轻量级）
  const errorPage = document.querySelector('.error-page');
  if (errorPage) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      document.querySelectorAll('.blob').forEach((b, i) => {
        const speed = (i + 1) * 0.8;
        b.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // 7. 自动年份
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();