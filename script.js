// ===== Scroll progress bar =====
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
}
document.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Nav active link + mobile toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

const navAnchors = document.querySelectorAll('[data-nav]');
const navSections = Array.from(navAnchors).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = document.querySelector(`[data-nav][href="${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
navSections.forEach(s => navObserver.observe(s));

// ===== The Lab: sticky scrollytelling =====
const labPanels = document.querySelectorAll('.lab-panel');
const labImgs = document.querySelectorAll('.lab-img');
const labDots = document.querySelectorAll('[data-lab-dot]');

const labObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const idx = entry.target.getAttribute('data-lab-panel');
    if (entry.isIntersecting) {
      labPanels.forEach(p => p.classList.remove('active'));
      entry.target.classList.add('active');
      labImgs.forEach(img => img.classList.toggle('active', img.getAttribute('data-lab-img') === idx));
      labDots.forEach(dot => dot.classList.toggle('active', dot.getAttribute('data-lab-dot') === idx));
    }
  });
}, { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' });
labPanels.forEach(p => labObserver.observe(p));

// ===== Animated counters =====
const statNums = document.querySelectorAll('.stat-num');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
statNums.forEach(el => countObserver.observe(el));

// ===== Hero parallax =====
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroBg && y < window.innerHeight) {
    heroBg.style.transform = `scale(1.1) translateY(${y * 0.25}px)`;
  }
}, { passive: true });

// ===== Particle canvas (subtle circuit-node network in hero) =====
(function particles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particlesArr;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    const count = Math.min(60, Math.floor((w * h) / 22000));
    particlesArr = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    particlesArr.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });
    for (let i = 0; i < particlesArr.length; i++) {
      for (let j = i + 1; j < particlesArr.length; j++) {
        const a = particlesArr[i], b = particlesArr[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(79,240,199,${0.14 * (1 - dist / 140)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    particlesArr.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124,158,255,0.55)';
      ctx.fill();
    });
    requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  init();
  requestAnimationFrame(step);
})();
