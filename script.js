/* ── PAGE FADE IN ── */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 1.2s ease';
setTimeout(() => { document.body.style.opacity = '1'; }, 80);

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / maxScroll * 100) + '%';
});

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

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

/* ── PARTICLE CANVAS ── */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.r    = Math.random() * 1.5 + 0.3;
    this.vx   = (Math.random() - 0.5) * 0.3;
    this.vy   = (Math.random() - 0.5) * 0.3 - 0.1;
    this.life = Math.random();
    this.maxLife = Math.random() * 0.015 + 0.003;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.maxLife;
    if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    const alpha = Math.max(0, this.life);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${alpha * 0.7})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animParticles);
}
animParticles();

/* ── 3D TILT ON PROGRAM CARDS ── */
document.querySelectorAll('.program-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.3;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ── ACTIVE NAV LINK ── */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

/* ── ANIMATED STAT COUNTERS ── */
const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const match = el.textContent.match(/[\d,]+/);
    if (!match) return;
    const target = parseInt(match[0].replace(',', ''));
    const suffix = el.querySelector('span')?.textContent || '';
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.innerHTML = Math.round(current) + '<span>' + suffix + '</span>';
      if (current >= target) clearInterval(timer);
    }, 18);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));
