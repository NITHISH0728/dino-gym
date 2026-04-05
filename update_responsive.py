import re

with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

new_responsive = """/* ===== RESPONSIVE ===== */

/* ----- Large Desktop (1440px+) ----- */
@media (max-width: 1440px) {
  .navbar { padding: 18px 40px; }
  .navbar.scrolled { padding: 14px 40px; }
  .hero { padding: 120px 40px 60px; }
  .section { padding: 80px 40px; }
  .footer { padding: 60px 40px 30px; }
}

/* ----- Tablet Landscape / Small Laptop (1024px) ----- */
@media (max-width: 1024px) {
  .navbar { padding: 16px 30px; }
  .navbar.scrolled { padding: 12px 30px; }
  .section { padding: 70px 30px; }
  .hero { padding: 110px 30px 50px; min-height: 70vh; }
  .hero h1 { font-size: clamp(2.4rem, 5vw, 4rem); }
  .about-grid, .about-grid.flipped { gap: 40px; }
  .about-image { max-width: 360px; }
  .about-image img, .founder-slideshow .founder-img { height: 300px; }
  .achievers-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .achiever-card .ach-img { height: 260px; }
  .contact-grid { gap: 40px; }
  .footer-top { grid-template-columns: 1fr 1fr; gap: 36px; }
  .footer { padding: 50px 30px 24px; }
  .classes-section { padding: 70px 30px; }
  .review-image-card { width: 340px; height: 180px; }
  .infra-showcase { height: 70vh; min-height: 500px; }
}

/* ----- Tablet Portrait (768px) ----- */
@media (max-width: 768px) {
  .navbar { padding: 14px 20px; }
  .navbar.scrolled { padding: 10px 20px; }
  .nav-links, .nav-cta { display: none; }
  .hamburger { display: flex; }
  .logo-text { font-size: 1.3rem; }
  .logo-img { width: 38px; height: 38px; }
  .hero { min-height: 65vh; padding: 100px 20px 50px; text-align: center; }
  .hero-content { max-width: 100%; }
  .hero h1 { font-size: clamp(2rem, 6vw, 3rem); margin-bottom: 20px; }
  .hero p { font-size: 1rem; max-width: 90%; margin-left: auto; margin-right: auto; margin-bottom: 30px; }
  .hero-badge { padding: 8px 18px; font-size: 0.72rem; }
  .hero-buttons { justify-content: center; flex-wrap: wrap; gap: 12px; }
  .btn-primary { padding: 14px 28px; font-size: 0.9rem; }
  .btn-secondary { padding: 14px 22px; font-size: 0.9rem; }
  .hero-stats { justify-content: center; gap: 28px; margin-top: 36px; }
  .hero-stat .num { font-size: 1.6rem; }
  .hero-visual { display: flex; justify-content: center; }
  .section { padding: 50px 20px; }
  .section-title { font-size: clamp(1.8rem, 5vw, 2.4rem); }
  .section-subtitle { font-size: 0.95rem; margin-left: auto; margin-right: auto; margin-bottom: 36px; }
  .about-grid, .about-grid.flipped { grid-template-columns: 1fr; gap: 32px; text-align: center; }
  .about-grid.flipped { display: flex; flex-direction: column-reverse; }
  .about-grid.flipped .about-image-wrapper { justify-content: center; padding-right: 0; }
  .about-image { margin: 0 auto; max-width: 100%; }
  .about-image img, .founder-slideshow .founder-img { height: 280px; }
  .about-content .about-text { font-size: 0.95rem; }
  .about-highlights { grid-template-columns: 1fr; }
  .founders-section { padding-top: 30px; padding-bottom: 30px; }
  .about-float-badge, .about-exp-bar, .float-card-1, .float-card-2 { display: none; }
  .infra-showcase { height: 60vh; min-height: 400px; }
  .infra-heading { font-size: clamp(1.6rem, 5vw, 2.4rem); letter-spacing: 1px; }
  .infra-tagline { font-size: 0.95rem; }
  .infra-btn { padding: 12px 32px; font-size: 0.88rem; }
  .infra-icon { width: 52px; height: 52px; }
  .classes-section { padding: 50px 20px; }
  .classes-grid { grid-template-columns: 1fr; gap: 32px; }
  .classes-schedule-btn { padding: 14px 40px; font-size: 0.95rem; }
  .achievers-grid { grid-template-columns: 1fr; gap: 24px; }
  .achiever-card .ach-img { height: 240px; }
  .review-image-card { width: 300px; height: 160px; }
  .reviews-track { gap: 16px; }
  .rate-us-btn { padding: 12px 28px; font-size: 0.9rem; }
  .contact-grid { grid-template-columns: 1fr; gap: 32px; }
  .contact-form { padding: 28px; }
  .form-row { grid-template-columns: 1fr; }
  .contact-info-card { padding: 18px 20px; }
  .contact-info-card .ci-icon { width: 44px; height: 44px; font-size: 1.1rem; }
  .footer { padding: 40px 20px 24px; }
  .footer-top { grid-template-columns: 1fr; gap: 32px; }
  .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
  .footer-socials { justify-content: center; }
  .cursor-glow { display: none; }
}

/* ----- Mobile (480px) ----- */
@media (max-width: 480px) {
  .navbar { padding: 12px 16px; }
  .logo-text { font-size: 1.1rem; }
  .logo-img { width: 34px; height: 34px; }
  .hero { min-height: 60vh; padding: 90px 16px 40px; }
  .hero h1 { font-size: clamp(1.8rem, 8vw, 2.4rem); margin-bottom: 16px; }
  .hero p { font-size: 0.9rem; margin-bottom: 24px; }
  .hero-buttons { flex-direction: column; width: 100%; gap: 10px; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
  .section { padding: 40px 16px; }
  .section-title { font-size: clamp(1.5rem, 6vw, 2rem); }
  .about-image img, .founder-slideshow .founder-img { height: 240px; }
  .infra-showcase { height: 50vh; min-height: 350px; }
  .review-image-card { width: 260px; height: 140px; }
  .contact-form { padding: 20px; }
  .footer { padding: 32px 16px 20px; }
  .mobile-menu a { font-size: 1.4rem; }
  .instagram-page { padding: 100px 16px 60px; }
  .instagram-page-header .section-title { font-size: 2rem; }
}

/* ----- Small Mobile / iPhone SE (375px window) ----- */
@media (max-width: 375px) {
  .hero h1 { font-size: 1.6rem; }
  .section-title { font-size: 1.4rem; }
  .about-image img, .founder-slideshow .founder-img { height: 200px; }
  .infra-showcase { height: 45vh; min-height: 300px; }
  .review-image-card { width: 220px; height: 120px; }
  .achiever-card .ach-img { height: 180px; }
}

/* ----- Touch Device Optimizations ----- */
@media (hover: none) and (pointer: coarse) {
  .cursor-glow { display: none; }
  .btn-primary:hover, .btn-secondary:hover, .achiever-card:hover, .contact-info-card:hover, .highlight-item:hover, .classes-img-wrap:hover img, .review-image-card:hover { transform: none; box-shadow: none; }
}
"""

content = re.sub(r'/\* ===== RESPONSIVE ===== \*/.*?/\* ===== MOBILE MENU ===== \*/', new_responsive + '\n/* ===== MOBILE MENU ===== */', content, flags=re.DOTALL)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(content)
