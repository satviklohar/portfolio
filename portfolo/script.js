const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);

$('#year').textContent = new Date().getFullYear();

/* ---------- loader (counts to 100) ---------- */
(function () {
  const n = $('#loadNum'), bar = $('#loadBar'), t0 = performance.now(), dur = 1500;
  const hide = () => $('#loader').classList.add('done');
  (function tick(t) {
    const p = clamp((t - t0) / dur);
    n.textContent = Math.round(p * 100);
    bar.style.width = p * 100 + '%';
    if (p < 1) requestAnimationFrame(tick); else setTimeout(hide, 250);
  })(t0);
  setTimeout(hide, 3500); // failsafe
})();

/* ---------- mobile menu ---------- */
const nav = $('#nav'), burger = $('#burger');
function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
$$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ---------- typing effect ---------- */
const words = ['Front-End Developer', 'Website Builder', 'UI Designer'];
const typed = $('#typed');
let w = 0, c = 0, deleting = false;
(function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!deleting && c === word.length) { deleting = true; return setTimeout(type, 1500); }
  if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
  c += deleting ? -1 : 1;
  setTimeout(type, deleting ? 40 : 90);
})();

/* ---------- count-up + scroll reveal ---------- */
function countUp(el) {
  const target = +el.dataset.count, suffix = el.dataset.suffix || '';
  const start = performance.now(), dur = 1400;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => io.observe(el));

/* ---------- statement: words light up as you scroll ---------- */
const stmt = $('#words');
stmt.innerHTML = stmt.textContent.trim().split(/\s+/).map((t) => `<span class="w">${t}</span>`).join(' ');
const sw = $$('.w', stmt);

/* ---------- scroll: progress bar + statement words ---------- */
const bar = $('#progress');
function onScroll() {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
  const r = stmt.getBoundingClientRect();
  const p = clamp((innerHeight * 0.85 - r.top) / (innerHeight * 0.55 + r.height * 0.4));
  const lit = Math.round(p * sw.length);
  sw.forEach((s, i) => s.classList.toggle('on', i < lit));
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

/* ---------- nav highlight for the section in view ---------- */
const links = $$('#menu a[href^="#"]');
const spy = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach((s) => spy.observe(s));

/* ---------- mouse effects (fine pointers only) ---------- */
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const glow = $('#glow');
  addEventListener('mousemove', (e) => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

  const photo = $('.hero-photo');
  addEventListener('mousemove', (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 16, y = (e.clientY / innerHeight - 0.5) * 16;
    photo.style.translate = `${x}px ${y}px`;
  });

  $$('.btn').forEach((b) => {
    b.addEventListener('mousemove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });

  $$('.shot').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---------- button ripple ---------- */
$$('.btn').forEach((b) => b.addEventListener('click', (e) => {
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
  const s = document.createElement('span');
  s.className = 'ripple';
  s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  b.appendChild(s);
  setTimeout(() => s.remove(), 600);
}));
