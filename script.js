// ===== PURA — Main Script =====

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// Toast notification
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Add to cart buttons
document.querySelectorAll('.add-btn, .add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => showToast('✓ Produit ajouté au panier !'));
});

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// Skin quiz logic
const quizSteps = document.querySelectorAll('.quiz-step');
const progressDots = document.querySelectorAll('.progress-dot');
let currentStep = 0;
const quizAnswers = {};

function goToStep(n) {
  quizSteps.forEach((s, i) => s.classList.toggle('active', i === n));
  progressDots.forEach((d, i) => {
    d.classList.toggle('active', i === n);
    d.classList.toggle('done', i < n);
  });
  currentStep = n;
}

document.querySelectorAll('.quiz-option').forEach(opt => {
  opt.addEventListener('click', function () {
    const step = this.closest('.quiz-step');
    step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    this.classList.add('selected');
    quizAnswers[currentStep] = this.textContent.trim();
    setTimeout(() => {
      if (currentStep < quizSteps.length - 1) {
        goToStep(currentStep + 1);
      } else {
        showQuizResult();
      }
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

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (input && input.value.trim()) {
      showToast('✓ Merci de votre inscription !');
      input.value = '';
    }
  });
}

// Contact form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✓ Message envoyé ! Nous vous répondrons sous 24h.');
    contactForm.reset();
  });
}

// Stagger animation for grid items
document.querySelectorAll('.features-grid .feature-card, .products-grid .product-card, .testimonials-grid .testimonial-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
  el.classList.add('reveal');
  revealObserver.observe(el);
});
