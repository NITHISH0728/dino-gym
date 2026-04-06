// ===== DR DINO FITNESS & GYM — Script =====

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
    }
  }, 1200);
  animateCounters();
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = -Math.random() * 0.3 - 0.1;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.3 + 0.05;
      this.color = Math.random() > 0.6
        ? 'rgba(0, 0, 0,' + this.opacity + ')'
        : 'rgba(51, 51, 51,' + this.opacity + ')';
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -10) this.reset();
      if (this.y < -10) this.y = canvas.height + 10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ===== CURSOR GLOW =====
const glow = document.getElementById('cursorGlow');
if (glow) {
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (navbar) {
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  lastScroll = currentScroll;
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

if (hamburger && mobileMenu && closeMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
  });
  closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
}

function closeMobile() {
  if (mobileMenu) {
    mobileMenu.classList.remove('active');
  }
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('active');
      }, i * 120);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== ABOUT EXPERIENCE BAR =====
const barFill = document.querySelector('.bar-fill');
if (barFill) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        barFill.classList.add('active');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  barObserver.observe(barFill.closest('.about-exp-bar'));
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target >= 1000) {
        counter.textContent = current.toLocaleString() + '+';
      } else {
        counter.textContent = current + '+';
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    // Delay start for visual effect
    setTimeout(() => requestAnimationFrame(updateCounter), 800);
  });
}

// ===== REVIEWS INFINITE SCROLL =====
const reviewsTrack = document.getElementById('reviewsTrack');
if (reviewsTrack) {
  // Duplicate cards for seamless infinite scroll
  const cards = reviewsTrack.innerHTML;
  reviewsTrack.innerHTML = cards + cards;
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const interest = document.getElementById('interest').value;
    const message = document.getElementById('message').value;

    const btn = document.getElementById('submitBtn');
    const originalText = btn.textContent;

    // The UX
    btn.textContent = 'Connecting to WhatsApp...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // The Backup: Silently send to Netlify Forms
    const formData = new URLSearchParams();
    formData.append("form-name", "Gym-Leads");
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("interest", interest);
    formData.append("message", message);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    }).catch(error => console.error('Form submission error:', error));

    setTimeout(() => {
      // The Formatting
      const waMessage = `🦖 DR DINO GYM INQUIRY\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n✉️ Email: ${email}\n🏋️ Interest: ${interest}\n🎯 Goal: ${message}`;
      const encodedMessage = encodeURIComponent(waMessage);
      
      // The Redirection
      const waUrl = `https://wa.me/918608113558?text=${encodedMessage}`;
      window.open(waUrl, '_blank');

      contactForm.reset();
      
      btn.textContent = originalText;
      btn.style.opacity = '1';
      btn.disabled = false;
    }, 1200);
  });
}

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && scrolled < window.innerHeight) {
    heroVisual.style.transform = `translateY(${scrolled * 0.08}px)`;
  }
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 200;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = 'var(--gold)';
      } else {
        link.style.color = '';
      }
    }
  });
});

// ===== TILT EFFECT ON CARDS =====
document.querySelectorAll('.infra-card, .achiever-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== FOUNDER IMAGE SLIDESHOW =====
function initFounderSlideshow(containerId, intervalMs) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const images = container.querySelectorAll('.founder-img');
  if (images.length < 2) return;

  let currentIndex = 0;

  setInterval(() => {
    // Remove active from current
    images[currentIndex].classList.remove('active');
    // Move to next
    currentIndex = (currentIndex + 1) % images.length;
    // Add active to next
    images[currentIndex].classList.add('active');
  }, intervalMs);
}

// Start both slideshows with slightly different intervals for visual variety
initFounderSlideshow('founder1Slideshow', 3000);
initFounderSlideshow('founder2Slideshow', 3500);

// ===== GOLD SHIMMER ON SECTION TITLES =====
const sectionTitles = document.querySelectorAll('.section-title');
const shimmerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'goldShimmer 3s ease-in-out';
      shimmerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
sectionTitles.forEach(el => shimmerObserver.observe(el));
