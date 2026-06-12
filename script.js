// ===== PURA — Main Script =====

// Navbar scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      document.body.style.overflow = 'hidden';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      document.body.style.overflow = '';
    }
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    document.body.style.overflow = '';
  }));
}

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) a.classList.add('active');
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Stagger grid items
document.querySelectorAll('.features-grid .feature-card, .products-grid .product-card, .testimonials-grid .testimonial-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
  if (!el.classList.contains('reveal')) { el.classList.add('reveal'); revealObserver.observe(el); }
});
document.querySelectorAll('.result-card, .cert-card, .value-item, .ai-step').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
  if (!el.classList.contains('reveal')) { el.classList.add('reveal'); revealObserver.observe(el); }
});

// Animated counters
function animateCounter(el) {
  const raw = el.dataset.target;
  const isFloat = raw.includes('.');
  const target = parseFloat(raw);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = target * eased;
    el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// Toast
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Add to cart
document.querySelectorAll('.add-btn, .add-to-cart, .modal-add').forEach(btn => {
  btn.addEventListener('click', () => showToast('✓ Produit ajouté au panier !'));
});

// Newsletter
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input && input.value.trim()) { showToast('✓ Merci de votre inscription !'); input.value = ''; }
  });
});

// Contact form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✓ Message envoyé ! Nous vous répondrons sous 24h.');
    contactForm.reset();
  });
}

// Product modal data
const productData = {
  serum: {
    name: 'Sérum Éclat Vitamine C',
    desc: "Illumine le teint, réduit les taches pigmentaires et stimule la synthèse de collagène naturel. Résultats visibles dès 2 semaines d'utilisation régulière.",
    price: '280 MAD', volume: '30ml', rating: '★★★★★', reviews: '127 avis',
    tags: ['Vitamine C stabilisée', 'Acide hyaluronique', 'Romarin bio', 'Niacinamide'],
    bg: 'linear-gradient(135deg, #e8f5ee, #d4edd8)'
  },
  booster: {
    name: 'Booster Collagène',
    desc: 'Redensifie et raffermit la peau en profondeur. Action anti-âge visible dès 4 semaines pour une peau rebondie et revitalisée.',
    price: '350 MAD', volume: '30ml', rating: '★★★★★', reviews: '89 avis',
    tags: ["Peptides végétaux", "Huile d'argan bio", 'Grenade', 'Rétinol végétal'],
    bg: 'linear-gradient(135deg, #f5f0e8, #ede4d4)'
  },
  masque: {
    name: 'Masque Hydratant Intense',
    desc: "Réservoir d'hydratation pour peau sèche ou déshydratée. Application 2×/semaine pour une peau repulpée et confortable toute la journée.",
    price: '220 MAD', volume: '75ml', rating: '★★★★★', reviews: '203 avis',
    tags: ['Aloe vera bio', 'Acide hyaluronique 3D', "Fleur d'oranger", 'Beurre de karité'],
    bg: 'linear-gradient(135deg, #e8eef5, #d4dded)'
  },
  huile: {
    name: 'Huile Précieuse Nuit',
    desc: 'Récupération nocturne intensive. Un mélange synergique de 15 huiles précieuses pour une régénération cellulaire maximale pendant le sommeil.',
    price: '320 MAD', volume: '30ml', rating: '★★★★★', reviews: '64 avis',
    tags: ['Rose musquée', 'Jojoba bio', 'Nigelle marocaine', 'Bakuchiol'],
    bg: 'linear-gradient(135deg, #2a2016, #3d3020)'
  }
};

const modalOverlay = document.getElementById('productModal');
function openModal(key) {
  const d = productData[key];
  if (!d || !modalOverlay) return;
  const vis = document.getElementById('modalVisual');
  if (vis) vis.style.background = d.bg;
  modalOverlay.querySelector('.modal-product-name').textContent = d.name;
  modalOverlay.querySelector('.modal-product-desc').textContent = d.desc;
  modalOverlay.querySelector('.modal-price-val').textContent = d.price;
  modalOverlay.querySelector('.modal-price-vol').textContent = '/ ' + d.volume;
  modalOverlay.querySelector('.modal-stars-val').textContent = d.rating;
  modalOverlay.querySelector('.modal-reviews').textContent = d.reviews;
  modalOverlay.querySelector('.modal-tags').innerHTML = d.tags.map(t => `<span class="ing-tag">${t}</span>`).join('');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (modalOverlay) { modalOverlay.classList.remove('open'); document.body.style.overflow = ''; }
}
if (modalOverlay) {
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
document.querySelectorAll('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card = btn.closest('[data-product]');
    if (card) openModal(card.dataset.product);
  });
});

// 3D card tilt on mouse move
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    card.style.transform = `perspective(900px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-10px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// Feature card micro-tilt
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// Hero scroll parallax
const heroSection = document.querySelector('.hero');
if (heroSection) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const content = heroSection.querySelector('.hero-content');
    const visual  = heroSection.querySelector('.hero-visual');
    if (content) content.style.transform = `translateY(${y * 0.1}px)`;
    if (visual)  visual.style.transform  = `translateY(${y * 0.05}px)`;
  }, { passive: true });
}

// Cursor glow (desktop)
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = Object.assign(document.createElement('div'), { style: `
    position:fixed;width:320px;height:320px;pointer-events:none;z-index:9999;
    background:radial-gradient(circle,rgba(46,139,87,0.06) 0%,transparent 70%);
    border-radius:50%;transform:translate(-50%,-50%);
    transition:opacity 0.3s;top:0;left:0;` });
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
}

// Skin quiz logic
const quizSteps = document.querySelectorAll('.quiz-step');
const progressDots = document.querySelectorAll('.progress-dot');
let currentStep = 0;
const quizAnswers = {};
function goToStep(n) {
  quizSteps.forEach((s, i) => s.classList.toggle('active', i === n));
  progressDots.forEach((d, i) => { d.classList.toggle('active', i === n); d.classList.toggle('done', i < n); });
  currentStep = n;
}
document.querySelectorAll('.quiz-option').forEach(opt => {
  opt.addEventListener('click', function () {
    const step = this.closest('.quiz-step');
    step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    this.classList.add('selected');
    quizAnswers[currentStep] = this.textContent.trim();
    setTimeout(() => {
      if (currentStep < quizSteps.length - 2) goToStep(currentStep + 1);
      else showQuizResult();
    }, 350);
  });
});
function showQuizResult() {
  const resultStep = document.querySelector('.quiz-result');
  if (resultStep) {
    quizSteps.forEach(s => s.classList.remove('active'));
    resultStep.classList.add('active');
    progressDots.forEach(d => d.classList.add('done'));
  }
}
