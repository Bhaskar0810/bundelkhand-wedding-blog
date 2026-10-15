/* 
  BANDHAN & BAARAAT: PURE JAVASCRIPT
  Features:
  1. Reading Progress Bar & Smart Auto-Hiding Header (Hides down, reveals up)
  2. Ambient Canvas:
     - Dark / Twilight Mode: Twinkling Celestial Stars & Shooting Star Streaks
     - Light / Dawn Mode: Floating Festive Golden Marigold Petals
  3. Interactive Ambient Cursor Spotlight (Refraction Follower)
  4. Twilight Diya Mode Toggle with LocalStorage
  5. Smooth Navigation Drawer & Offset Anchor Scrolling
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reading Progress Bar & Smart Auto-Hiding Header
  const progressBar = document.getElementById('read-progress');
  const topNav = document.querySelector('.top-nav');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0 && progressBar) {
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = progress + '%';
    }

    // Auto-hide navigation on scroll down, reveal on scroll up or at top
    if (topNav) {
      if (scrollTop <= 60) {
        topNav.classList.remove('nav-hidden');
      } else if (scrollTop > lastScrollY && scrollTop > 110) {
        topNav.classList.add('nav-hidden');
      } else if (scrollTop < lastScrollY) {
        topNav.classList.remove('nav-hidden');
      }
    }
    lastScrollY = scrollTop;
  }, { passive: true });

  // 2. Interactive Cursor Spotlight (Glass Refraction Follower)
  const spotlight = document.getElementById('cursor-spotlight');
  if (spotlight && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateSpotlight = () => {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;
      spotlight.style.transform = 'translate(' + (curX - 240) + 'px, ' + (curY - 240) + 'px)';
      requestAnimationFrame(animateSpotlight);
    };
    requestAnimationFrame(animateSpotlight);
  }

  // 3. Ambient Canvas: Stars in Dark Mode & Marigold Petals in Light Mode
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    let stars = [];
    let shootingStar = null;
    let petals = [];

    const isDarkMode = () => document.body.classList.contains('twilight-mode');

    function initParticles() {
      stars = [];
      const starCount = Math.floor((width * height) / 10000); // Responsive density ~80-120
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.4,
          baseAlpha: Math.random() * 0.6 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.3 ? '#FDE68A' : '#FFFFFF'
        });
      }

      petals = [];
      const petalCount = Math.min(35, Math.floor(width / 35)); // Responsive density ~25-35
      const petalColors = ['#F59E0B', '#EAB308', '#D97706', '#F43F5E', '#FB923C'];
      for (let i = 0; i < petalCount; i++) {
        petals.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 6 + 6,
          speedY: Math.random() * 0.7 + 0.4,
          speedX: Math.random() * 0.4 - 0.2,
          angle: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 1.2,
          swaySpeed: Math.random() * 0.02 + 0.01,
          swayRange: Math.random() * 25 + 10,
          swayPhase: Math.random() * Math.PI * 2,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
          alpha: Math.random() * 0.35 + 0.35
        });
      }
    }

    initParticles();

    // Trigger occasional shooting star in dark mode
    let lastShootingStarTime = Date.now();
    function maybeCreateShootingStar() {
      if (!isDarkMode() || shootingStar) return;
      const now = Date.now();
      if (now - lastShootingStarTime > 4000 && Math.random() < 0.015) {
        lastShootingStarTime = now;
        shootingStar = {
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 10 + 12,
          angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
          alpha: 1
        };
      }
    }

    let time = 0;
    function render() {
      time++;
      ctx.clearRect(0, 0, width, height);

      if (isDarkMode()) {
        // RENDER TWINKLING STARS
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          s.phase += s.twinkleSpeed;
          const currentAlpha = s.baseAlpha + Math.sin(s.phase) * 0.3;
          const finalAlpha = Math.max(0.1, Math.min(1, currentAlpha));

          ctx.fillStyle = s.color;
          ctx.globalAlpha = finalAlpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();

          if (s.radius > 1.4 && finalAlpha > 0.75) {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(s.x - s.radius * 2.5, s.y);
            ctx.lineTo(s.x + s.radius * 2.5, s.y);
            ctx.moveTo(s.x, s.y - s.radius * 2.5);
            ctx.lineTo(s.x, s.y + s.radius * 2.5);
            ctx.stroke();
          }
        }

        maybeCreateShootingStar();
        if (shootingStar) {
          ctx.save();
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = 1.8;
          ctx.globalAlpha = shootingStar.alpha;
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
          ctx.restore();

          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.alpha -= 0.022;
          if (shootingStar.alpha <= 0) {
            shootingStar = null;
          }
        }
      } else {
        // RENDER FLOATING MARIGOLD FLOWER PETALS (LIGHT WEDDING COURTYARD MODE)
        for (let i = 0; i < petals.length; i++) {
          const p = petals[i];
          p.y += p.speedY;
          p.x += Math.sin(time * p.swaySpeed + p.swayPhase) * 0.6 + p.speedX;
          p.angle += p.rotationSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.angle * Math.PI) / 180);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;

          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  // 4. Twilight Diya Mode Toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('locality_blog_theme');
  if (savedTheme === 'twilight') {
    document.body.classList.add('twilight-mode');
    updateThemeBtn(true);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('twilight-mode');
      const isTwilight = document.body.classList.contains('twilight-mode');
      localStorage.setItem('locality_blog_theme', isTwilight ? 'twilight' : 'dawn');
      updateThemeBtn(isTwilight);
    });
  }

  function updateThemeBtn(isTwilight) {
    if (!themeBtn) return;
    const icon = themeBtn.querySelector('.theme-icon');
    const label = themeBtn.querySelector('.theme-label');
    if (isTwilight) {
      if (icon) icon.textContent = '☀️';
      if (label) label.textContent = 'Dawn Mode';
    } else {
      if (icon) icon.textContent = '🌙';
      if (label) label.textContent = 'Twilight Mode';
    }
  }

  // 5. Wikipedia-Style Table of Contents Toggle & Navbar Jump
  const tocToggle = document.getElementById('wiki-toc-toggle');
  const tocList = document.getElementById('wiki-toc-list');
  const tocNavBtn = document.getElementById('nav-toc-link');
  const tocEl = document.getElementById('toc');

  if (tocToggle && tocList) {
    tocToggle.addEventListener('click', () => {
      const isCollapsed = tocList.classList.toggle('is-collapsed');
      const actionSpan = tocToggle.querySelector('.wiki-toc-action');
      if (actionSpan) {
        actionSpan.textContent = isCollapsed ? 'show' : 'hide';
      }
      tocToggle.setAttribute('aria-expanded', !isCollapsed);
    });
  }

  if (tocNavBtn && tocEl) {
    tocNavBtn.addEventListener('click', () => {
      // Ensure TOC list is expanded when navigated to from top navbar
      if (tocList && tocList.classList.contains('is-collapsed')) {
        tocList.classList.remove('is-collapsed');
        const actionSpan = tocToggle ? tocToggle.querySelector('.wiki-toc-action') : null;
        if (actionSpan) actionSpan.textContent = 'hide';
        if (tocToggle) tocToggle.setAttribute('aria-expanded', 'true');
      }
      // Add subtle glow pulse on arrival
      tocEl.classList.remove('highlight-pulse');
      void tocEl.offsetWidth; // trigger reflow
      tocEl.classList.add('highlight-pulse');
    });
  }

  // 6. Smooth Header Offset Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = 80;
        const elemPosition = targetElem.getBoundingClientRect().top;
        const offsetPosition = elemPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 7. Interactive Device Photo Loader & Storage
  const photoInputs = document.querySelectorAll('.photo-file-input');
  photoInputs.forEach((input) => {
    const targetId = input.getAttribute('data-target');
    const storageKey = input.getAttribute('data-storage');
    const imgEl = targetId ? document.getElementById(targetId) : null;

    // Load saved image from browser storage if present
    if (storageKey && imgEl) {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          imgEl.src = savedData;
          imgEl.style.display = 'block';
          if (imgEl.parentElement) {
            imgEl.parentElement.classList.remove('img-fallback');
          }
        }
      } catch (e) {
        // Ignore storage access errors
      }
    }

    // When user selects their photograph file
    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file && imgEl && storageKey) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const result = loadEvent.target.result;
          imgEl.src = result;
          imgEl.style.display = 'block';
          if (imgEl.parentElement) {
            imgEl.parentElement.classList.remove('img-fallback');
          }
          try {
            localStorage.setItem(storageKey, result);
          } catch (storageErr) {
            console.warn('Photo loaded in preview. (Local quota exceeded for long-term storage).');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  });

  console.log('Bandhan & Baaraat: Seamless Long-form Blog Loaded.');
});
