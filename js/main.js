/* ============================================
   The Sunny Soul Company — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navigation ──────────────────────────────
  const nav         = document.querySelector('.nav');
  const hamburger   = document.querySelector('.nav__hamburger');
  const navLinks    = document.querySelector('.nav__links');
  const navOverlay  = document.querySelector('.nav__overlay');
  const heroBg      = document.querySelector('.hero__bg');

  // Only the home page nav starts transparent — capture that once at load time
  const navStartsTransparent = nav?.classList.contains('nav--transparent');

  // Scroll-based nav style
  function updateNav() {
    if (!nav) return;
    if (navStartsTransparent && window.scrollY < 80) {
      nav.classList.add('nav--transparent');
      nav.classList.remove('nav--solid');
    } else {
      nav.classList.remove('nav--transparent');
      nav.classList.add('nav--solid');
    }
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // Hero background parallax fade-in
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  // Mobile menu
  function closeMenu() {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('open');
    navOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      hamburger.classList.add('active');
      navLinks?.classList.add('open');
      navOverlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  navOverlay?.addEventListener('click', closeMenu);

  // Close menu on nav link click
  navLinks?.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Mark current page nav link active
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks?.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.style.color = 'var(--copper)';
    }
  });


  // ── Scroll Reveal ────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }


  // ── Lightbox ─────────────────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item[data-src]');

  if (galleryItems.length) {
    // Build lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox__close" aria-label="Close">&times;</button>
      <button class="lightbox__prev" aria-label="Previous">&#8249;</button>
      <img class="lightbox__img" src="" alt="Gallery photo">
      <button class="lightbox__next" aria-label="Next">&#8250;</button>
    `;
    document.body.appendChild(lightbox);

    const lbImg   = lightbox.querySelector('.lightbox__img');
    const lbClose = lightbox.querySelector('.lightbox__close');
    const lbPrev  = lightbox.querySelector('.lightbox__prev');
    const lbNext  = lightbox.querySelector('.lightbox__next');

    let images = [];
    let current = 0;

    galleryItems.forEach((item, i) => {
      images.push({
        src: item.dataset.src,
        alt: item.dataset.alt || 'The Sunny Soul Company — Waiheke Island'
      });

      item.addEventListener('click', () => {
        current = i;
        openLightbox();
      });
    });

    function openLightbox() {
      lbImg.src = images[current].src;
      lbImg.alt = images[current].alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lbImg.src = ''; }, 300);
    }

    function showPrev() {
      current = (current - 1 + images.length) % images.length;
      lbImg.style.opacity = '0';
      setTimeout(() => {
        lbImg.src = images[current].src;
        lbImg.alt = images[current].alt;
        lbImg.style.opacity = '1';
      }, 180);
    }

    function showNext() {
      current = (current + 1) % images.length;
      lbImg.style.opacity = '0';
      setTimeout(() => {
        lbImg.src = images[current].src;
        lbImg.alt = images[current].alt;
        lbImg.style.opacity = '1';
      }, 180);
    }

    lbImg.style.transition = 'opacity 0.18s ease';

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', showPrev);
    lbNext.addEventListener('click', showNext);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }


  // ── Gallery Filter ────────────────────────────
  const filterBtns = document.querySelectorAll('.gallery-filter__btn');
  const filteredItems = document.querySelectorAll('.gallery-item[data-category]');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;

        filteredItems.forEach(item => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = '';
            setTimeout(() => item.style.opacity = '1', 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });
  }


  // ── Contact Form ─────────────────────────────
  const form = document.querySelector('.js-enquiry-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const successMsg = form.querySelector('.form-success');

      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        const data = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          if (successMsg) {
            successMsg.style.display = 'block';
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          btn.textContent = 'Message Sent ✓';
        } else {
          throw new Error('Server error');
        }
      } catch {
        btn.disabled = false;
        btn.textContent = 'Send Enquiry';
        alert('Sorry, something went wrong. Please email us directly at thesunnysoulcompany@gmail.com');
      }
    });
  }


  // ── Smooth Anchor Scroll ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

});
