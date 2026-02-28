document.addEventListener('DOMContentLoaded', () => {

  /* ── PAGE FADE IN ── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 1.2s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 80);

  /* ── SCROLL PROGRESS BAR ── */
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) progressBar.style.width = (window.scrollY / maxScroll * 100) + '%';
    }, { passive: true });
  }

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');

  if (cursor && ring) {
    let mx = -200, my = -200, rx = -200, ry = -200;

    // Position off-screen until first mousemove
    cursor.style.left = '-200px';
    cursor.style.top  = '-200px';
    ring.style.left   = '-200px';
    ring.style.top    = '-200px';

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a, button, .program-card, .value-pill, .contact-card, .photo-figure').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
        ring.style.transform   = 'translate(-50%,-50%) scale(1.4)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.transform   = 'translate(-50%,-50%) scale(1)';
      });
    });
  }

  /* ── PARTICLE CANVAS ── */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x    = Math.random() * canvas.width;
        this.y    = initial ? Math.random() * canvas.height : canvas.height + 10;
        this.r    = Math.random() * 1.4 + 0.3;
        this.vx   = (Math.random() - 0.5) * 0.25;
        this.vy   = -(Math.random() * 0.4 + 0.1);
        this.alpha = Math.random() * 0.6 + 0.1;
        this.decay = Math.random() * 0.004 + 0.001;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        if (this.alpha <= 0 || this.y < -10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${Math.max(0, this.alpha)})`;
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 100 }, () => new Particle());

    function animParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animParticles);
    }
    animParticles();
  }

  /* ── 3D TILT ON PROGRAM CARDS ── */
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── MAGNETIC BUTTONS ── */
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── ACTIVE NAV LINK ── */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── ANIMATED STAT COUNTERS ── */
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    const statObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        statObserver.unobserve(entry.target);

        const el     = entry.target;
        const span   = el.querySelector('span');
        const suffix = span ? span.textContent : '';
        // Read original numeric text from data attribute for reliability
        const raw    = el.dataset.target || el.textContent.replace(suffix, '').trim();
        const target = parseInt(raw.replace(/[^\d]/g, ''), 10);
        if (isNaN(target)) return;

        let cur = 0;
        const duration = 1200; // ms
        const startTime = performance.now();

        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          cur = Math.round(eased * target);
          el.innerHTML = cur + (suffix ? `<span>${suffix}</span>` : '');
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => {
      // Store original numeric value before any innerHTML manipulation
      const span = el.querySelector('span');
      const suffix = span ? span.textContent : '';
      el.dataset.target = el.textContent.replace(suffix, '').trim();
      statObserver.observe(el);
    });
  }

}); // end DOMContentLoaded
