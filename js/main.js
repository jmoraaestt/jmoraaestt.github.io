/* ═══════════════════════════════════════════════════════════
   Júlia Toledo — main.js
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── Navbar: scroll effect & mobile menu ─────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ─── Active nav link on scroll ────────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const activateNav = () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
};

window.addEventListener('scroll', activateNav, { passive: true });

// ─── Scroll-triggered animations ─────────────────────────
const animateObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animateObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-animate]').forEach(el => {
  animateObserver.observe(el);
});

// ─── Contact form ─────────────────────────────────────────
const SVG_ARROW = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SVG_SPIN  = `<svg style="animation:spin .75s linear infinite;flex-shrink:0" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-opacity=".2"/><path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`;
const SVG_CHECK = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const form = document.getElementById('contactForm');
const btn  = document.getElementById('submitBtn');

if (form && btn) {
  const DEFAULT_LABEL = `Enviar mensagem ${SVG_ARROW}`;

  btn.innerHTML = DEFAULT_LABEL;

  function setState(state) {
    btn.removeAttribute('data-state');
    if (state === 'loading') {
      btn.disabled = true;
      btn.innerHTML = `Enviando… ${SVG_SPIN}`;
    } else if (state === 'success') {
      btn.disabled = true;
      btn.setAttribute('data-state', 'success');
      btn.innerHTML = `Mensagem enviada! ${SVG_CHECK}`;
    } else if (state === 'error') {
      btn.disabled = false;
      btn.setAttribute('data-state', 'error');
      btn.innerHTML = `Erro ao enviar — tente novamente ${SVG_ARROW}`;
    } else {
      btn.disabled = false;
      btn.innerHTML = DEFAULT_LABEL;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setState('loading');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) throw new Error();

      form.reset();
      setState('success');
      setTimeout(() => setState('default'), 3000);

    } catch {
      setState('error');
      setTimeout(() => setState('default'), 4000);
    }
  });
}

// ─── Smooth anchor scroll (Safari fallback) ──────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
