'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 780px)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const whatsappNumber = '919982301681';

  $('#year').textContent = new Date().getFullYear();
  const nav = $('#nav-links');
  const menu = $('#menu-toggle');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }
  menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('#nav-links a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });
  document.addEventListener('click', event => {
    if (nav.classList.contains('open') && !event.target.closest('.nav')) setMenu(false);
  });
  mobile.addEventListener?.('change', () => setMenu(false));

  const progress = $('#scroll-progress');
  const backTop = $('#back-top');
  let scrollPending = false;
  function paintScroll() {
    const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = Math.min(100, Math.max(0, window.scrollY / maximum * 100)) + '%';
    backTop.classList.toggle('visible', window.scrollY > 750);
    scrollPending = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { requestAnimationFrame(paintScroll); scrollPending = true; }
  }, {passive: true});
  window.addEventListener('resize', paintScroll, {passive: true});
  backTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: reduced ? 'instant' : 'smooth'}));
  paintScroll();

  if (!reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver((entries, instance) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        instance.unobserve(entry.target);
      }
    }, {rootMargin: '0px 0px 60px 0px', threshold: .04});
    $$('.reveal').forEach(el => observer.observe(el));
  }
  if ('IntersectionObserver' in window) {
    const sections = $$('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        $$('.nav-links a[data-nav]').forEach(link => {
          if (link.dataset.nav === entry.target.id) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      }
    }, {rootMargin: '-15% 0px -75% 0px'});
    sections.forEach(el => sectionObserver.observe(el));
  }

  // These counts are the numbers of portfolio projects, service types and packages displayed above.
  if (!reduced && 'IntersectionObserver' in window) {
    const stats = $('#proof');
    const counterObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      $$('.stat-number[data-count]').forEach(el => {
        const end = Number(el.dataset.count);
        const start = performance.now();
        const update = time => {
          const t = Math.min(1, (time - start) / 850);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(end * eased)).padStart(2, '0');
          if (t < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      });
    }, {threshold: .2});
    counterObserver.observe(stats);
  }

  if (!reduced && finePointer.matches) {
    const glow = $('#cursor-glow');
    let hoverFrame = 0;
    window.addEventListener('pointermove', event => {
      if (hoverFrame) return;
      hoverFrame = requestAnimationFrame(() => {
        glow.style.left = event.clientX + 'px';
        glow.style.top = event.clientY + 'px';
        glow.style.opacity = '1';
        hoverFrame = 0;
      });
    }, {passive: true});
    document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  }

  // Subtle magnetic CTA feedback (only for fine pointers, with an accessible still-state).
  if (!reduced && finePointer.matches) {
    $$('.magnetic').forEach(button => {
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        const dx = ((event.clientX - rect.left) / rect.width - .5) * 7;
        const dy = ((event.clientY - rect.top) / rect.height - .5) * 7;
        button.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      });
      button.addEventListener('pointerleave', () => button.style.removeProperty('transform'));
      button.addEventListener('blur', () => button.style.removeProperty('transform'));
    });
  }

  // One efficient decorative canvas animation; not required for content or functionality.
  const canvas = $('#particles');
  if (!reduced && finePointer.matches && window.innerWidth >= 980 && canvas?.getContext) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let dots = [], lastFrame = 0;
      function resizeParticles() {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = window.innerWidth, height = 880;
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        dots = Array.from({length: Math.min(42, Math.floor(width / 31))}, () => ({
          x: Math.random() * width, y: Math.random() * height,
          radius: Math.random() * 1.35 + .3, velocity: Math.random() * .22 + .08
        }));
      }
      resizeParticles();
      window.addEventListener('resize', resizeParticles, {passive: true});
      const draw = time => {
        if (time - lastFrame > 32) {
          lastFrame = time;
          ctx.clearRect(0, 0, window.innerWidth, 880);
          ctx.fillStyle = 'rgba(110,230,255,.47)';
          for (const dot of dots) {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fill();
            dot.y -= dot.velocity;
            if (dot.y < -3) dot.y = 880;
          }
        }
        if (!document.hidden) requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) requestAnimationFrame(draw); });
    }
  }

  const filterButtons = $$('.filter-btn');
  const cards = $$('.work-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(btn => {
      const active = btn === button;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => {
      const visible = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter;
      card.hidden = !visible;
      if (visible) card.classList.add('visible');
    });
  }));

  const projects = {
    satvyk: {
      title: 'Satvyk', type: 'WEBSITE / E-COMMERCE', image: 'satvyk.webp',
      alt: 'Satvyk e-commerce website homepage shown in the original client project screenshot',
      summary: 'A food and wellness e-commerce experience with a vibrant, product-forward identity and organized paths to browse and shop.',
      services: ['Website design and development', 'E-commerce shopping experience', 'Catalog presentation and management', 'SEO and ongoing digital support'],
      url: 'https://satvyk.com/', note: 'Project screenshot supplied by SETU WORKS.'
    },
    peelgold: {
      title: 'Mr. Peelgold', type: 'WEBSITE / E-COMMERCE', image: 'peelgold.webp',
      alt: 'Mr. Peelgold e-commerce spices homepage shown in the original client screenshot',
      summary: 'A black-and-gold digital storefront for a spice and food brand, built around strong product storytelling and a focused commerce experience.',
      services: ['Website design and development', 'E-commerce product presentation', 'Search engine optimization', 'Store operations and management'],
      url: 'https://mrpeelgold.com/', note: 'Project screenshot supplied by SETU WORKS.'
    },
    celestial: {
      title: 'Celestial Gemstone Co.', type: 'ETSY / GEMSTONE JEWELRY', image: 'celestial.webp',
      alt: 'Celestial Gemstone Co. Etsy jewelry shop in its original screenshot',
      summary: 'An Etsy storefront for gemstone jewelry and spiritual products, with a cohesive visual identity and practical marketplace setup.',
      services: ['Store setup and visual branding', 'Jewelry product listings and presentation', 'Keyword-informed listing SEO', 'Marketplace management'],
      url: 'https://www.etsy.com/shop/CelestialGemstoneCo', note: 'The shop screenshot is real. No sales or ranking outcomes are claimed.'
    },
    farooqui: {
      title: 'Farooqui Gems Jewelry', type: 'ETSY / MARKETPLACE OPERATIONS', image: 'farooqui.webp',
      alt: 'Farooqui Gems Jewelry Etsy storefront in the client-provided screenshot',
      summary: 'Ongoing management and optimization for an established Etsy gemstone jewelry shop, rather than creation of the original shop.',
      services: ['Listings and product SEO', 'Store operations and order management', 'Customer communication support', 'Marketplace advertising support'],
      url: 'https://www.etsy.com/shop/Farooquigemsjewelry',
      note: 'The submitted screenshot shows 844 lifetime shop sales and a 4.7 rating. These are historical shop-wide figures, not results attributed to SETU WORKS.'
    },
    meghaa: {
      title: 'Meghaa Gems', type: 'ETSY / MARKETPLACE', image: 'meghaa.webp',
      alt: 'Meghaa Gems handmade jewelry Etsy store in the original supplied screenshot',
      summary: 'A gemstone jewelry marketplace presence with product-focused presentation, listings and continued shop support.',
      services: ['Store design and setup', 'Product catalog and listing optimization', 'SEO and search visibility work', 'Marketplace management'],
      url: '', note: 'A confirmed public store URL was not available. This is the genuine project screenshot.'
    }
  };
  const dialog = $('#project-dialog');
  const dialogClose = $('#dialog-close');
  let lastTrigger = null;
  function openProject(id, trigger) {
    const project = projects[id];
    if (!project) return;
    lastTrigger = trigger;
    $('#dialog-type').textContent = project.type;
    $('#dialog-title').textContent = project.title;
    $('#dialog-summary').textContent = project.summary;
    $('#dialog-note').textContent = project.note;
    const image = $('#dialog-image');
    image.src = 'assets/images/' + project.image;
    image.alt = project.alt;
    const list = $('#dialog-services');
    list.replaceChildren(...project.services.map(service => {
      const li = document.createElement('li'); li.textContent = service; return li;
    }));
    const externalLink = $('#dialog-link');
    externalLink.hidden = !project.url;
    if (project.url) externalLink.href = project.url;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    dialogClose.focus();
  }
  $$('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project, button)));
  function closeProject() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }
  dialogClose.addEventListener('click', closeProject);
  $('#dialog-done').addEventListener('click', closeProject);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeProject(); });
  dialog.addEventListener('close', () => lastTrigger?.focus());

  const serviceSelect = $('#service-select');
  const budgetSelect = $('#budget-select');
  $$('[data-service]').forEach(link => link.addEventListener('click', () => {
    serviceSelect.value = link.dataset.service;
  }));
  $$('[data-package]').forEach(link => link.addEventListener('click', () => {
    const pkg = link.dataset.package;
    budgetSelect.value = pkg.includes('12,000') ? '₹12,000–₹24,000'
      : pkg.includes('24,000') ? '₹24,000–₹43,500'
      : pkg.includes('43,500') ? '₹43,500–₹55,000' : 'Above ₹55,000';
    serviceSelect.value = 'Custom Website Development';
    const description = $('#project-description');
    if (!description.value.trim()) description.value = 'I am interested in your ' + pkg + ' package. Please share the next steps.';
  }));

  const form = $('#enquiry-form');
  const feedback = $('#form-feedback');
  $$('#enquiry-form input, #enquiry-form select, #enquiry-form textarea').forEach(field => {
    field.addEventListener('input', () => field.removeAttribute('aria-invalid'));
    field.addEventListener('change', () => field.removeAttribute('aria-invalid'));
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    feedback.classList.remove('error', 'success');
    const required = [$('#client-name'), serviceSelect, $('#project-description')];
    const invalid = required.find(field => !field.value.trim());
    if (invalid) {
      invalid.setAttribute('aria-invalid', 'true');
      feedback.textContent = 'Please complete your name, required service and project description.';
      feedback.classList.add('error');
      invalid.focus();
      return;
    }
    const name = $('#client-name').value.trim();
    const brand = $('#brand-name').value.trim();
    const service = serviceSelect.value.trim();
    const budget = budgetSelect.value.trim();
    const description = $('#project-description').value.trim();
    const message = [
      'Hello SETU WORKS, I would like a free project consultation.', '',
      'Name: ' + name,
      ...(brand ? ['Business: ' + brand] : []),
      'Service: ' + service,
      ...(budget ? ['Budget: ' + budget] : []),
      'Project details: ' + description
    ].join('\n');
    const url = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
    // The browser may block new tabs; in that case the current tab is navigated to WhatsApp.
    const windowRef = window.open(url, '_blank');
    if (windowRef) windowRef.opener = null;
    if (windowRef === null) {
      const temporary = document.createElement('a');
      temporary.href = url;
      temporary.target = '_blank';
      temporary.rel = 'noopener noreferrer';
      temporary.click();
    }
    feedback.textContent = 'WhatsApp was opened with your prepared enquiry. Review it and tap Send there; nothing has been submitted by this website.';
    feedback.classList.add('success');
  });
})();
