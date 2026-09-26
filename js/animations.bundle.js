// — lenis.js —
export function initLenis() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    lerp: 0.1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  window.lenis = lenis;

  return lenis;
}


// — animations/hero.js —
/**
 * Hero animation
 * Clip reveal editorial para textos principais.
 */

export function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const heroMedia = document.querySelector('.hero-media');
  const heroStage = document.querySelector('.hero-stage');
  const heroScroll = document.querySelector('.hero-scroll');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal de texto e CTAs agora é 100% CSS (@keyframes heroRv/heroFade) →
  // não depende do GSAP/CDN, evita flash e mantém FCP/LCP rápidos.

  if (reducedMotion) {
    if (heroMedia) gsap.set(heroMedia, { opacity: 1, scale: 1, x: 0 });
    if (heroScroll) gsap.set(heroScroll, { opacity: 1, y: 0 });
    hero.classList.add('is-ready');
    return;
  }

  if (heroMedia) {
    gsap.to(heroMedia, {
      scale: 1,
      duration: 1.2,
      ease: 'machado',
      delay: 0.16,
      onComplete() { hero.classList.add('is-ready'); },
    });
  } else {
    hero.classList.add('is-ready');
  }

  if (heroScroll) {
    gsap.fromTo(heroScroll,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.5 }
    );

    gsap.to(heroScroll.querySelector('.hero-scroll__line'), {
      scaleY: 0.3,
      transformOrigin: 'bottom',
      duration: 1.2,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  if (heroStage && window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) {
    let frame = null;
    let x = 50;
    let y = 50;

    function renderSpotlight() {
      frame = null;
      heroStage.style.setProperty('--mouse-x', `${x}%`);
      heroStage.style.setProperty('--mouse-y', `${y}%`);
    }

    heroStage.addEventListener('pointermove', (event) => {
      const rect = heroStage.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width) * 100;
      y = ((event.clientY - rect.top) / rect.height) * 100;
      if (!frame) frame = requestAnimationFrame(renderSpotlight);
    }, { passive: true });
  }
}


// — animations/marquee.js —
/**
 * Marquee horizontal opcional
 * Inicializa apenas quando existir um bloco com data-marquee no DOM.
 */

export function initMarquee() {
  const marquees = document.querySelectorAll('[data-marquee]');
  if (!marquees.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  marquees.forEach((marquee) => {
    const track = marquee.querySelector('[data-marquee-track]');
    if (!track) return;

    const distance = track.scrollWidth / 2;
    if (!distance) return;

    const speed = parseFloat(marquee.dataset.speed) || 1;
    const duration = Math.max(12, distance / 60) / speed;

    const tween = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: -distance,
        duration,
        ease: 'none',
        repeat: -1,
      }
    );

    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      markers: false,
      onEnter: () => tween.play(),
      onLeave: () => tween.pause(),
      onEnterBack: () => tween.play(),
      onLeaveBack: () => tween.pause(),
    });
  });
}


// — animations/scroll-triggers.js —
function splitTextByLines(el) {
  if (typeof SplitText === 'undefined') return null;
  return new SplitText(el, { type: 'lines', linesClass: 'line-wrap' });
}

export function initScrollTriggers() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    const footerHeadline = document.querySelector('.footer-headline');
    if (footerHeadline) gsap.set(footerHeadline, { opacity: 0.08 });
    return;
  }

  if (!document.querySelector('[data-animate]')) return;

  // Batch all offsetWidth reads before any animations are created (avoids forced reflow)
  const headingData = Array.from(document.querySelectorAll('[data-animate="section-heading"]')).map((el) => {
    const rule = el.querySelector('.section-heading__rule');
    const square = el.querySelector('.section-heading__square');
    return {
      el,
      meta: el.querySelector('.section-heading__meta'),
      title: el.querySelector('.section-heading__title'),
      subtitle: el.querySelector('.section-heading__subtitle'),
      rule,
      square,
      squareTravel: (rule && square) ? rule.offsetWidth - square.offsetWidth : 0,
    };
  });

  headingData.forEach(({ el, meta, title, subtitle, rule, square, squareTravel }) => {
    const parts = [meta, title, subtitle].filter(Boolean);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
        markers: false,
      },
    });

    if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'machado' }, 0);
    if (square && rule) {
      tl.fromTo(square,
        { x: 0, rotate: 0, opacity: 0 },
        { x: squareTravel, rotate: 180, opacity: 1, duration: 0.9, ease: 'machado' },
        0
      );
    }

    if (parts.length) {
      tl.fromTo(parts,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.72, stagger: 0.1, ease: 'machado' },
        0.08
      );
    }
  });

  // ── fade-up ──
  document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.fromTo(el,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0,
        duration: 1, delay,
        ease: 'machado',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      }
    );
  });

  // ── fade-in ──
  document.querySelectorAll('[data-animate="fade-in"]').forEach((el) => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.9, delay,
        ease: 'machado',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      }
    );
  });

  // ── slide-left ──
  document.querySelectorAll('[data-animate="slide-left"]').forEach((el) => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.fromTo(el,
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0,
        duration: 1, delay,
        ease: 'machado',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      }
    );
  });

  // ── slide-right ──
  document.querySelectorAll('[data-animate="slide-right"]').forEach((el) => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.fromTo(el,
      { opacity: 0, x: 60 },
      {
        opacity: 1, x: 0,
        duration: 1, delay,
        ease: 'machado',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      }
    );
  });

  // ── scale-in ──
  document.querySelectorAll('[data-animate="scale-in"]').forEach((el) => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.fromTo(el,
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1, scale: 1,
        duration: 1.1, delay,
        ease: 'machado',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      }
    );
  });

  // ── lines — SplitText por linhas ──
  document.querySelectorAll('[data-animate="lines"]').forEach((el) => {
    const delay = parseFloat(el.dataset.delay) || 0;
    const split = splitTextByLines(el);
    if (!split) return;

    gsap.set(el, { opacity: 1 });
    gsap.fromTo(split.lines,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1,
        delay,
        ease: 'machado',
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      }
    );
  });

  // ── Footer headline scale ──
  const footerHeadline = document.querySelector('.footer-headline');
  if (footerHeadline) {
    gsap.fromTo(footerHeadline,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1, opacity: 0.08,
        duration: 1.2,
        ease: 'machado',
        scrollTrigger: {
          trigger: footerHeadline,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      }
    );
  }
}


// — animations/diferenciais.js —
/**
 * Diferenciais / Pilares
 * Desktop: seção pina enquanto o scroll avança por cada pilar.
 * Mobile: troca de pilar por posição no scroll normal.
 */

export function initDiferenciais() {
  const section = document.querySelector('[data-diferenciais]');
  if (!section) return;

  const steps = Array.from(section.querySelectorAll('[data-diferencial-step]'));
  const images = Array.from(section.querySelectorAll('[data-diferencial-image]'));
  const indicator = section.querySelector('.diferenciais-indicator');
  if (!steps.length || !images.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = -1;
  let indicatorTween = null;
  let indicatorRotation = 0;

  function moveIndicatorTo(step) {
    if (!indicator || !step) return;

    const number = step.querySelector('.diferencial-step__num');
    const targetOffset = number
      ? step.offsetTop + number.offsetTop + (number.offsetHeight / 2) - (indicator.offsetHeight / 2)
      : step.offsetTop;

    if (reducedMotion) {
      indicator.style.transform = `translateY(${targetOffset}px)`;
      return;
    }

    if (indicatorTween) indicatorTween.kill();
    indicatorRotation += 180;

    indicatorTween = gsap.to(indicator, {
      y: targetOffset,
      opacity: 1,
      duration: 0.72,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    gsap.to(indicator, {
      '--indicator-rotation': `${indicatorRotation}deg`,
      duration: 0.72,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }

  function setActive(index) {
    if (index === activeIndex) return;

    activeIndex = index;

    steps.forEach((step, i) => {
      const isActive = i === index;
      step.classList.toggle('is-active', isActive);
      step.setAttribute('aria-current', isActive ? 'step' : 'false');
    });

    images.forEach((image, i) => {
      image.classList.toggle('is-active', i === index);
    });

    moveIndicatorTo(steps[index]);
  }

  steps.forEach((step, i) => {
    step.setAttribute('aria-current', i === activeIndex ? 'step' : 'false');
  });
  setActive(0);

  if (reducedMotion) {
    return;
  }

  const title = section.querySelector('.diferenciais-title');
  const kicker = section.querySelector('.diferenciais-kicker');

  if ((title || kicker) && !section.querySelector('[data-animate="section-heading"]')) {
    gsap.fromTo([title, kicker].filter(Boolean),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'machado',
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          once: true,
          markers: false,
        },
      }
    );
  }

  gsap.fromTo(steps,
    { opacity: 0, y: 28 },
    {
      opacity: (index) => (index === activeIndex ? 1 : 0.42),
      y: 0,
      duration: 0.72,
      ease: 'machado',
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top 68%',
        once: true,
        markers: false,
      },
      onComplete() {
        gsap.set(steps, { clearProps: 'opacity,transform' });
        setActive(activeIndex);
      },
    }
  );

  const mm = gsap.matchMedia();
  const BP_DESKTOP = '(min-width: 1024px)';
  const BP_MOBILE  = '(max-width: 1023px)';

  // ── Desktop: seção pina e scroll avança pelos pilares ──────────────────────
  mm.add(BP_DESKTOP, () => {
    const stepDistance = Math.round(window.innerHeight * 0.7);

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${stepDistance * (steps.length - 1)}`,
      pin: true,
      pinSpacing: true,
      onUpdate(self) {
        const index = Math.max(0, Math.min(
          steps.length - 1,
          Math.round(self.progress * (steps.length - 1))
        ));
        setActive(index);
      },
    });

    return () => st.kill();
  });

  // ── Mobile: troca por posição relativa no scroll normal ────────────────────
  mm.add(BP_MOBILE, () => {
    let ticking = false;

    function syncActiveStep() {
      ticking = false;

      const HYSTERESIS = 90;
      const viewportFocus = window.innerHeight * 0.46;
      let closestIndex = activeIndex < 0 ? 0 : activeIndex;
      let closestDistance = Number.POSITIVE_INFINITY;

      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        const stepCenter = rect.top + rect.height * 0.5;
        const distance = Math.abs(stepCenter - viewportFocus);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex === activeIndex || activeIndex < 0) {
        setActive(closestIndex);
        return;
      }

      const currentRect = steps[activeIndex].getBoundingClientRect();
      const currentCenter = currentRect.top + currentRect.height * 0.5;
      const currentDistance = Math.abs(currentCenter - viewportFocus);

      if (closestDistance + HYSTERESIS < currentDistance) {
        setActive(closestIndex);
      }
    }

    function requestSync() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(syncActiveStep);
    }

    syncActiveStep();
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', requestSync);
    };
  });
}


// — animations/stats.js —
export function initStats() {
  const cards = document.querySelectorAll('[data-stats-card]');
  if (!cards.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const formatStatValue = (value) => `${Math.round(value)}`;
  const valueElements = document.querySelectorAll('[data-stats-card] .stat-number__value[data-count]');

  if (reducedMotion) {
    gsap.set(cards, { opacity: 1, clearProps: 'transform' });
    gsap.set(document.querySelectorAll('[data-stats-card] .stat-label'), {
      opacity: 1,
      clearProps: 'transform',
    });
    valueElements.forEach((valueEl) => {
      const target = parseFloat(valueEl.dataset.count);

      valueEl.textContent = formatStatValue(target);
    });
    return;
  }

  valueElements.forEach((valueEl) => {
    valueEl.textContent = formatStatValue(0);
  });

  // Pré-define estado inicial dos labels antes dos ScrollTriggers dispararem
  gsap.set(document.querySelectorAll('[data-stats-card] .stat-label'), {
    opacity: 0,
    y: 10,
  });

  function animateValue(valueEl) {
    if (valueEl.dataset.counted === 'true') return;

    const target = parseFloat(valueEl.dataset.count);
    const obj = { val: 0 };

    valueEl.dataset.counted = 'true';
    valueEl.textContent = formatStatValue(0);

    gsap.to(obj, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate() {
        valueEl.textContent = formatStatValue(obj.val);
      },
      onComplete() {
        valueEl.textContent = formatStatValue(target);
      },
    });
  }

  cards.forEach((card) => {
    const delay   = parseFloat(card.dataset.delay) || 0;
    const labelEl = card.querySelector('.stat-label');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true,
        markers: false,
      },
      delay,
      defaults: { ease: 'machado' },
    });

    // 1 — Card entra vindo de baixo
    tl.fromTo(card,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.85 }
    );

    // 2 — Label sobe independente durante a entrada do card
    if (labelEl) {
      tl.fromTo(labelEl,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' },
        0.28
      );
    }
  });

  // Contagem separada da timeline visual: a seção dispara todos os números juntos.
  const statsSection = document.querySelector('.stats-section');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        valueElements.forEach(animateValue);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -15% 0px',
    });

    observer.observe(statsSection || cards[0]);
    return;
  }

  valueElements.forEach(animateValue);
}


// — animations/counters.js —
export function initCounters() {
  const counters = Array.from(document.querySelectorAll('[data-count]'))
    .filter((el) => !el.closest('[data-stats-card]'));
  if (!counters.length) return;

  counters.forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj    = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate() {
        el.textContent = Math.round(obj.val) + suffix;
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
        markers: false,
      },
    });
  });
}


// — animations/magnetic.js —
export function initMagnetic() {
  const magnets = document.querySelectorAll('[data-magnetic]:not(.btn--split)');
  if (!magnets.length) return;
  if (window.matchMedia('(hover: none)').matches) return;

  magnets.forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic) || 0.25;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;

      gsap.to(el, {
        x: dx,
        y: dy,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}


// — animations/produtos-tabs.js —
/**
 * Produtos — vitrine premium com decisão por linha.
 * Desktop: seção pinada troca os painéis por scroll ou navegação.
 * Mobile: painéis empilhados com reveals leves e navegação sticky.
 */

export function initProdutosTabs() {
  const section = document.querySelector('[data-produtos-showcase]');
  if (!section) return;

  const panels = gsap.utils.toArray(section.querySelectorAll('.produto-panel'));
  const navItems = gsap.utils.toArray(section.querySelectorAll('[data-go]'));
  if (!panels.length) return;

  const mm = gsap.matchMedia();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const focusableSelector = 'a, button, input, select, textarea, [tabindex]';
  let activeIndex = -1;
  let desktopMode = false;

  function syncPanelAccessibility(index) {
    panels.forEach((panel, i) => {
      const inactiveDesktopPanel = desktopMode && i !== index;
      panel.setAttribute('aria-hidden', inactiveDesktopPanel ? 'true' : 'false');

      panel.querySelectorAll(focusableSelector).forEach((el) => {
        if (inactiveDesktopPanel) {
          el.setAttribute('tabindex', '-1');
          return;
        }
        if (el.getAttribute('tabindex') === '-1') {
          el.removeAttribute('tabindex');
        }
      });
    });
  }

  function updateLineContent(index) {
    const nameSuffix = section.querySelector('.produtos-line-name__suffix');
    const descEl = section.querySelector('.produtos-line-desc');
    const ctaEl = section.querySelector('.produtos-line-cta');
    const progressCurrent = section.querySelector('[data-produtos-current]');
    const btn = navItems[index];
    if (!nameSuffix || !btn) return;

    const suffix = btn.dataset.lineSuffix;
    const desc = btn.dataset.desc || '';
    const href = btn.dataset.href || '#';
    const numStr = String(index + 1).padStart(2, '0');

    if (progressCurrent) progressCurrent.textContent = numStr;

    if (reducedMotion) {
      if (suffix) nameSuffix.textContent = suffix;
      if (descEl) descEl.textContent = desc;
      if (ctaEl) ctaEl.href = href;
      return;
    }

    const targets = [nameSuffix, descEl, ctaEl].filter(Boolean);

    gsap.to(targets, {
      opacity: 0,
      y: 6,
      duration: 0.16,
      ease: 'power2.in',
      overwrite: true,
      onComplete() {
        if (suffix) nameSuffix.textContent = suffix;
        if (descEl) descEl.textContent = desc;
        if (ctaEl) ctaEl.href = href;

        gsap.fromTo(targets,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.36, ease: 'machado', stagger: 0.05 }
        );
      },
    });
  }

  function animatePanel(panel) {
    if (reducedMotion) return;
    const figure = panel.querySelector('.produto-figure');
    if (!figure) return;

    gsap.fromTo(figure,
      { autoAlpha: 0.8, scale: 0.97 },
      { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'machado', overwrite: true }
    );
  }

  function setActive(index, shouldAnimate = true) {
    const nextIndex = Math.max(0, Math.min(panels.length - 1, index));
    if (nextIndex === activeIndex) return;

    activeIndex = nextIndex;

    panels.forEach((panel, i) => panel.classList.toggle('is-active', i === nextIndex));
    navItems.forEach((item, i) => {
      const isActive = i === nextIndex;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    syncPanelAccessibility(nextIndex);
    updateLineContent(nextIndex);

    if (shouldAnimate) {
      animatePanel(panels[nextIndex]);
    }
  }

  function scrollToPanel(index, scrollTrigger) {
    const nextIndex = Math.max(0, Math.min(panels.length - 1, index));

    if (!desktopMode || !scrollTrigger) {
      const rootStyles = getComputedStyle(document.documentElement);
      const targetTop = panels[nextIndex].getBoundingClientRect().top + window.scrollY;
      const offset = window.innerWidth < 1024
        ? parseFloat(rootStyles.getPropertyValue('--navbar-height-scrolled')) + parseFloat(rootStyles.getPropertyValue('--space-4'))
        : 0;

      window.scrollTo({
        top: targetTop - offset,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
      setActive(nextIndex);
      return;
    }

    const progress = panels.length > 1 ? nextIndex / (panels.length - 1) : 0;
    scrollTrigger.scroll(scrollTrigger.start + ((scrollTrigger.end - scrollTrigger.start) * progress));
    setActive(nextIndex);
  }

  setActive(0, false);

  const BP_DESKTOP = '(min-width: 1024px)';
  const BP_MOBILE = '(max-width: 1023px)';

  mm.add(BP_DESKTOP, () => {
    desktopMode = true;
    syncPanelAccessibility(activeIndex < 0 ? 0 : activeIndex);

    // ── Efeito 4: reveal de entrada — rail items ──
    const railItems = gsap.utils.toArray(section.querySelectorAll('.produtos-rail__item'));
    if (!reducedMotion) {
      gsap.set(railItems, { autoAlpha: 0, y: 8 });
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * 0.88) * (panels.length - 1)}`,
      pin: true,
      pinSpacing: true,
      onEnter() {
        if (reducedMotion) return;
        gsap.to(railItems, {
          autoAlpha: 1, y: 0,
          duration: 0.55, stagger: 0.07, ease: 'machado',
        });
      },
      onUpdate(self) {
        if (reducedMotion) return;
        const index = Math.max(0, Math.min(
          panels.length - 1,
          Math.round(self.progress * (panels.length - 1))
        ));
        setActive(index);
      },
    });

    // ── Efeitos 1 & 2: spotlight + parallax no stage ──
    const stage = section.querySelector('.produtos-stage');
    let spotFrame = null;
    let sx = 50, sy = 50;

    function renderSpot() {
      spotFrame = null;
      stage.style.setProperty('--mouse-x', `${sx}%`);
      stage.style.setProperty('--mouse-y', `${sy}%`);
    }

    function onStageMove(e) {
      const rect = stage.getBoundingClientRect();
      sx = ((e.clientX - rect.left) / rect.width) * 100;
      sy = ((e.clientY - rect.top) / rect.height) * 100;
      if (!spotFrame) spotFrame = requestAnimationFrame(renderSpot);

      if (reducedMotion) return;
      const nx = (sx / 100 - 0.5) * 2;
      const ny = (sy / 100 - 0.5) * 2;
      const fig = panels[activeIndex]?.querySelector('.produto-figure');
      if (fig) gsap.to(fig, { x: nx * 12, y: ny * 6, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
    }

    function onStageLeave() {
      if (spotFrame) { cancelAnimationFrame(spotFrame); spotFrame = null; }
      stage.style.setProperty('--mouse-x', '50%');
      stage.style.setProperty('--mouse-y', '50%');
      if (!reducedMotion) {
        const fig = panels[activeIndex]?.querySelector('.produto-figure');
        if (fig) gsap.to(fig, { x: 0, y: 0, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
      }
    }

    stage.addEventListener('pointermove', onStageMove, { passive: true });
    stage.addEventListener('pointerleave', onStageLeave);

    const handlers = navItems.map((item, index) => {
      const onClick = () => scrollToPanel(index, st);
      item.addEventListener('click', onClick);
      return [item, onClick];
    });

    setActive(activeIndex < 0 ? 0 : activeIndex, false);

    return () => {
      handlers.forEach(([item, onClick]) => item.removeEventListener('click', onClick));
      stage.removeEventListener('pointermove', onStageMove);
      stage.removeEventListener('pointerleave', onStageLeave);
      desktopMode = false;
      syncPanelAccessibility(activeIndex < 0 ? 0 : activeIndex);
      st.kill();
    };
  });

  mm.add(BP_MOBILE, () => {
    desktopMode = false;
    syncPanelAccessibility(activeIndex < 0 ? 0 : activeIndex);

    const handlers = navItems.map((item, index) => {
      const onClick = () => scrollToPanel(index);
      item.addEventListener('click', onClick);
      return [item, onClick];
    });

    const triggers = panels.map((panel, index) => ScrollTrigger.create({
      trigger: panel,
      start: 'top 58%',
      end: 'bottom 42%',
      onEnter: () => setActive(index, false),
      onEnterBack: () => setActive(index, false),
    }));

    if (!reducedMotion) {
      panels.forEach((panel) => {
        gsap.fromTo(
          panel.querySelectorAll('.produto-figure, .produto-panel__copy'),
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            ease: 'machado',
            stagger: 0.08,
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              once: true,
            },
          }
        );
      });
    }

    setActive(0, false);

    return () => {
      handlers.forEach(([item, onClick]) => item.removeEventListener('click', onClick));
      triggers.forEach((trigger) => trigger.kill());
    };
  });
}


// — animations/navbar.js —
/**
 * Navbar editorial.
 * @module animations/navbar
 */

export function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 80;
  const toggle = document.querySelector('.navbar-toggle');
  const toggleLabel = toggle?.querySelector('.navbar-toggle__label');
  const panel = document.getElementById('navbar-panel');
  const panelInner = panel?.querySelector('.navbar-panel__inner');
  const lightSections = document.querySelectorAll('.section--light, .hero--light, .sobre--light');

  if (!toggle || !toggleLabel || !panel || !panelInner) return;

  let menuOpen = false;
  let themeFrame = null;
  let cachedNavHeight = navbar.offsetHeight;

  function syncNavbarTheme() {
    themeFrame = null;
    if (menuOpen) return;

    const navProbe = cachedNavHeight + 24;
    let shouldUseLightTheme = false;

    lightSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const overlapsNavbarBand = rect.top <= navProbe && rect.bottom >= 0;
      if (overlapsNavbarBand) {
        shouldUseLightTheme = true;
      }
    });

    navbar.classList.toggle('navbar--light', shouldUseLightTheme);
  }

  function scheduleNavbarTheme() {
    if (themeFrame) return;
    themeFrame = window.requestAnimationFrame(syncNavbarTheme);
  }

  function updateScrolledState() {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > SCROLL_THRESHOLD);
    scheduleNavbarTheme();
  }

  /* ── Indicador animado ── */
  const indicator = panel.querySelector('.nav-indicator');
  const navLinks = panel.querySelectorAll('.navbar-panel__nav a');

  function positionIndicator(target) {
    if (!indicator || !target) return;
    const iconH = indicator.offsetHeight;
    const linkCenter = target.offsetTop + target.offsetHeight / 2;
    indicator.style.transform = `translateY(${linkCenter - iconH / 2}px)`;
  }

  function moveIndicatorToActive() {
    const active = panel.querySelector('.navbar-panel__nav a.is-active');
    if (active) positionIndicator(active);
  }

  function openMenu() {
    menuOpen = true;
    navbar.classList.add('is-open');
    navbar.classList.remove('navbar--light');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-label', 'Fechar menu');
    toggle.setAttribute('aria-expanded', 'true');
    toggleLabel.textContent = 'Close';
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({ defaults: { ease: 'machado' } });

    tl.fromTo(panelInner,
      { opacity: 0, y: 20, clipPath: 'inset(0% 0% 100% 0%)' },
      { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45 }
    );

    tl.fromTo(panel.querySelectorAll('.navbar-panel__nav a'),
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.06 },
      '-=0.25'
    );

    tl.fromTo(panel.querySelectorAll('.navbar-panel__meta > *'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
      '-=0.35'
    );

    tl.fromTo(panel.querySelectorAll('.navbar-card'),
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 },
      '-=0.35'
    );

    tl.call(() => moveIndicatorToActive());
  }

  function closeMenu() {
    if (!menuOpen) return;

    menuOpen = false;
    navbar.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggleLabel.textContent = 'Menu';
    document.body.style.overflow = '';

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete() {
        panel.setAttribute('aria-hidden', 'true');
        panel.classList.remove('is-open');
        gsap.set(panelInner, { clearProps: 'all' });
        scheduleNavbarTheme();
      },
    });

    tl.to(panelInner, {
      opacity: 0,
      y: 16,
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.28,
    });
  }

  toggle.addEventListener('click', () => {
    if (menuOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!menuOpen) return;
      closeMenu();
    });
  });

  panel.addEventListener('click', (event) => {
    if (!menuOpen) return;
    if (panelInner.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!menuOpen) return;
    closeMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => positionIndicator(link));
  });

  const nav = panel.querySelector('.navbar-panel__nav');
  if (nav) {
    nav.addEventListener('mouseleave', moveIndicatorToActive);
  }

  window.addEventListener('scroll', updateScrolledState, { passive: true });
  window.addEventListener('resize', () => {
    cachedNavHeight = navbar.offsetHeight;
    scheduleNavbarTheme();
    if (menuOpen) moveIndicatorToActive();
  }, { passive: true });

  updateScrolledState();
}


// — animations/sobre-gallery.js —
/**
 * Galeria da seção Sobre.
 * @module animations/sobre-gallery
 */

export function initSobreGallery() {
  const gallery = document.querySelector('[data-sobre-gallery]');
  if (!gallery) return;

  const slides = gallery.querySelectorAll('[data-sobre-slide]');
  const dots = gallery.querySelectorAll('[data-sobre-dot]');
  if (!slides.length) return;

  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const total = slides.length;
  let current = 0;
  let autoplay;

  function setSlide(index) {
    const next = (index + total) % total;
    if (next === current && slides[next].classList.contains('is-active')) return;

    const previousSlide = slides[current];
    const nextSlide = slides[next];
    current = next;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
    });

    if (shouldReduceMotion || !previousSlide || !nextSlide) return;

    gsap.fromTo(nextSlide,
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'machado', overwrite: true }
    );
  }

  function queueAutoplay() {
    if (shouldReduceMotion || total < 2) return;
    if (autoplay) autoplay.kill();

    autoplay = gsap.delayedCall(3.6, () => {
      setSlide(current + 1);
      queueAutoplay();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.sobreDot, 10);
      if (Number.isNaN(index)) return;
      setSlide(index);
      queueAutoplay();
    });
  });

  if (!shouldReduceMotion) {
    gsap.fromTo(gallery,
      { y: 24, rotate: -1.2 },
      {
        y: 0,
        rotate: 0,
        duration: 0.9,
        ease: 'machado',
        scrollTrigger: {
          trigger: gallery,
          start: 'top 82%',
          once: true,
        },
      }
    );
  }

  queueAutoplay();
}


// — animations/button-swap.js —
/**
 * Microinteração dos botões split.
 * @module animations/button-swap
 */

export function initButtonSwap() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.btn--split').forEach((btn) => {
    const label = btn.querySelector('.btn__label');
    const plus = btn.querySelector('.btn__plus');
    if (!label || !plus) return;

    btn.addEventListener('mouseenter', () => {
      const labelWidth = label.offsetWidth;
      const plusWidth = plus.offsetWidth;
      const gap = parseFloat(getComputedStyle(btn).columnGap) || 0;

      gsap.to(plus, { x: -(labelWidth + gap), duration: 0.34, ease: 'power2.inOut', overwrite: true });
      gsap.to(label, { x: plusWidth + gap, duration: 0.34, ease: 'power2.inOut', overwrite: true });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(plus, { x: 0, duration: 0.34, ease: 'power2.inOut', overwrite: true });
      gsap.to(label, { x: 0, duration: 0.34, ease: 'power2.inOut', overwrite: true });
    });
  });
}


// — animations/youtube-facade.js —
export function initYoutubeFacade() {
  const buttons = document.querySelectorAll('[data-yt]');
  if (!buttons.length) return;

  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  buttons.forEach((btn) => {
    const video = btn.querySelector('video[data-src]');
    if (video && !isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.src = video.dataset.src;
              video.play().catch(() => {});
              observer.disconnect();
            }
          });
        },
        { rootMargin: '200px' }
      );
      observer.observe(btn);
    }

    btn.addEventListener('click', () => {
      // guard — evita disparo duplo enquanto o iframe carrega
      if (btn.dataset.carregando) return;
      btn.dataset.carregando = 'true';
      btn.classList.add('is-loading');

      const id = btn.dataset.yt;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&color=white`;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.className = 'sobre-yt__iframe sobre-yt__iframe--carregando';
      iframe.title = btn.getAttribute('aria-label') || 'Vídeo institucional';

      // o iframe entra no DOM para comecar a baixar; o poster so sai quando ele esta pronto
      const troca = () => {
        iframe.classList.remove('sobre-yt__iframe--carregando');
        btn.remove();
      };
      iframe.addEventListener('load', troca, { once: true });
      // rede ruim nao pode deixar o usuario preso no estado de loading
      setTimeout(troca, 6000);

      btn.insertAdjacentElement('afterend', iframe);
    });
  });
}
