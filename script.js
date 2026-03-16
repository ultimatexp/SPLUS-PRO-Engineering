/* ============================================
   SPLUS PRO Engineering — Main JavaScript
   Language Switcher, Animations, Lightbox
   ============================================ */

(function () {
  'use strict';

  // ============ LANGUAGE SWITCHER ============
  const DEFAULT_LANG = localStorage.getItem('splus-lang') || 'en';

  function setLanguage(lang) {
    // Update all data-lang-content elements
    document.querySelectorAll('[data-lang-content]').forEach(el => {
      if (el.getAttribute('data-lang-content') === lang) {
        el.classList.add('active');
        // Handle block vs inline display
        if (el.tagName === 'SPAN' || el.tagName === 'A' || el.tagName === 'OPTION') {
          el.style.display = '';
        } else {
          el.style.display = 'block';
        }
      } else {
        el.classList.remove('active');
        el.style.display = 'none';
      }
    });

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Save preference
    localStorage.setItem('splus-lang', lang);

    // Update html lang attribute
    const langMap = { en: 'en', th: 'th', cn: 'zh-CN' };
    document.documentElement.lang = langMap[lang] || 'en';
  }

  // Bind language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
    });
  });

  // Initialize language
  setLanguage(DEFAULT_LANG);

  // ============ STICKY HEADER ============
  const header = document.getElementById('header');

  function handleScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ============ MOBILE MENU ============
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============ SMOOTH SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============ SCROLL REVEAL ANIMATIONS ============
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============ COUNTER ANIMATION ============
  const counters = document.querySelectorAll('.stat-number[data-count]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (counters.length > 0) {
    counterObserver.observe(counters[0].closest('.stats-grid'));
  }

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.round(eased * target);

        counter.textContent = current.toLocaleString() + (target >= 100 && counter.closest('.stat-item').querySelector('.stat-label').textContent.includes('%') ? '' : '+');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target >= 100 && counter.closest('.stat-item').querySelector('.stat-label').textContent.includes('%')
            ? target.toLocaleString()
            : target.toLocaleString() + '+';
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ============ CONTACT FORM → EMAIL ============
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const service = document.getElementById('serviceType').value;
      const details = document.getElementById('projectDetails').value.trim();

      // Service label mapping
      const serviceLabels = {
        electrical: 'Electrical Systems',
        plumbing: 'Plumbing Systems',
        aircon: 'Air Conditioning Systems',
        all: 'Full MEP Package'
      };

      const serviceText = serviceLabels[service] || 'Not specified';

      const subject = encodeURIComponent(`Quote Request from ${name} — ${serviceText}`);
      const body = encodeURIComponent(
        `Hello SPLUS PRO Engineering,\n\n` +
        `I would like to request a quote for your services.\n\n` +
        `--- Contact Details ---\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n\n` +
        `--- Project Details ---\n` +
        `Service Required: ${serviceText}\n` +
        `Details: ${details || 'N/A'}\n\n` +
        `Looking forward to hearing from you.\n` +
        `Best regards,\n${name}`
      );

      window.location.href = `mailto:spluspro2018@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // ============ LIGHTBOX ============
  window.openLightbox = function (el) {
    const img = el.querySelector('img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (img && lightbox && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeLightbox = function () {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeLightbox();
    }
  });

})();
