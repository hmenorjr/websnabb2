document.addEventListener('DOMContentLoaded', () => {
  // Update copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==========================================
     1. Theme Switcher (Light / Dark)
     ========================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Detect saved preference or system theme
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  /* ==========================================
     2. Internationalization (i18n)
     ========================================== */
  const langSelect = document.getElementById('lang-select');
  const savedLang = localStorage.getItem('lang') || 'en';

  function applyLanguage(lang) {
    if (!translations[lang]) return;

    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('lang', lang);

    if (langSelect) langSelect.value = lang;
  }

  applyLanguage(savedLang);

  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
  }

  /* ==========================================
     3. Scroll Animations (IntersectionObserver)
     ========================================== */
  const animatedElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    animatedElements.forEach(el => el.classList.add('visible'));
  }

  /* ==========================================
     4. Mobile Bottom Navigation Active Highlighting
     ========================================== */
  const sections = document.querySelectorAll('section[id], header[id="hero"]');
  const navItems = document.querySelectorAll('.mobile-nav-item');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
      }
    });
  });
});
