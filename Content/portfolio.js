/**
 * Portfolio — Optimized loader.
 * Fetches data.json ONCE, then populates all sections.
 */

let _pdata = null;

async function getPortfolioData() {
    if (_pdata) return _pdata;
    const res = await fetch('./data.json');
    if (!res.ok) throw new Error('Failed to load portfolio data');
    _pdata = await res.json();
    return _pdata;
}

/* ── Shared IntersectionObserver for reveal animations ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

/* ── Rendering helpers ── */

function renderNavigation(data) {
    const nav = document.querySelector('#nav-links-container');
    if (!nav) return;
    nav.innerHTML = '';
    data.navigation.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.link;
        a.textContent = item.label;
        a.setAttribute('aria-label', 'Navigate to ' + item.label);
        li.appendChild(a);
        nav.appendChild(li);
    });
}

function renderCta(data) {
    const btn = document.querySelector('#nav-cta-button');
    if (!btn) return;
    btn.href = data.cta.link;
    btn.textContent = data.cta.text;
}

function renderHero(data) {
    const hero = data.hero;
    // Headline
    const lines = document.querySelectorAll('#main-headline div');
    hero.headline.forEach((text, i) => { if (lines[i]) lines[i].textContent = text; });
    // Description
    const desc = document.querySelector('#hero-description');
    if (desc) desc.textContent = hero.description;
    // Stats
    const stats = document.querySelector('#hero-stats-container');
    if (stats) {
        stats.innerHTML = hero.stats.map(s =>
            `<div class="stat-item"><div class="stat-num">${s.num}</div><div class="stat-label">${s.label}</div></div>`
        ).join('');
    }
    // Tech stack
    const stack = document.querySelector('#hero-stack-container');
    if (stack) {
        stack.innerHTML = hero.techStack.map(t =>
            `<span class="stack-badge accent">${t}</span>`
        ).join('');
    }
    // Background text
    const bgText = document.querySelector('#hero-bg-text');
    if (bgText) bgText.textContent = hero.backgroundText;
    // Scroll hint
    const scrollText = document.querySelector('#scroll-text');
    if (scrollText) scrollText.textContent = hero.scrollText;
}

function renderMarquee(data) {
    const track = document.querySelector('#marquee-track-container');
    if (!track) return;
    const html = data.marquee.map(item =>
        `<div class="marquee-item">
            <span>${item.category}:</span>
            ${item.skills.map(s => `<div>${s}</div>`).join('<span>✦</span>')}
        </div>`
    ).join('');
    track.innerHTML = html + html; // duplicate for seamless loop
}

function initSlider(photos) {
    const slider = document.querySelector('#about-slider');
    const dotsContainer = document.querySelector('#slider-dots');
    const prevBtn = document.querySelector('#slider-prev');
    const nextBtn = document.querySelector('#slider-next');

    if (!slider || !photos || photos.length === 0) return;

    let currentIndex = 0;
    let autoInterval;

    // Inject slide wrappers with image and prompt overlay
    slider.innerHTML = photos.map((photo, i) => {
        const isActive = i === 0;
        const prompt = photo.prompt || '';
        const safePrompt = prompt.replace(/&/g, '&').replace(/"/g, '"').replace(/</g, '<').replace(/>/g, '>');
        return `<div class="about-slide${isActive ? ' active' : ''}" data-slide-index="${i}">
            <img src="${photo.src}" alt="Rohit Magdum Photo ${i + 1}" class="about-slide-img" width="896" height="599" loading="${isActive ? 'eager' : 'lazy'}" decoding="async" />
            <div class="prompt-overlay">
                <div class="prompt-overlay-bg"></div>
                <div class="prompt-overlay-content">
                    <p class="prompt-text">${prompt}</p>
                    <button class="prompt-copy-btn" data-prompt="${safePrompt}" aria-label="Copy prompt" title="Copy prompt">
                        <i class="fas fa-copy"></i>
                        <span class="copy-feedback">Copied!</span>
                    </button>
                </div>
                <div class="prompt-indicator">
                    <i class="fas fa-info-circle"></i> Hover for prompt
                </div>
            </div>
        </div>`;
    }).join('');

    // Inject dots
    if (dotsContainer) {
        dotsContainer.innerHTML = photos.map((_, i) =>
            `<span class="slider-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`
        ).join('');
    }

    const slides = slider.querySelectorAll('.about-slide');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

    function goToSlide(index) {
        if (index === currentIndex) return;
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        const next = (currentIndex + 1) % photos.length;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentIndex - 1 + photos.length) % photos.length;
        goToSlide(prev);
    }

    function startAuto() {
        stopAuto();
        autoInterval = setInterval(nextSlide, 4000);
    }

    function stopAuto() {
        if (autoInterval) { clearInterval(autoInterval); autoInterval = null; }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAuto(); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.getAttribute('data-index'), 10));
            startAuto();
        });
    });

    // Pause auto on hover
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    if (prevBtn) { prevBtn.addEventListener('mouseenter', stopAuto); prevBtn.addEventListener('mouseleave', startAuto); }
    if (nextBtn) { nextBtn.addEventListener('mouseenter', stopAuto); nextBtn.addEventListener('mouseleave', startAuto); }

    // ── Copy-to-clipboard for prompt buttons ──
    slider.addEventListener('click', (e) => {
        const btn = e.target.closest('.prompt-copy-btn');
        if (!btn) return;
        e.stopPropagation();
        const promptText = btn.getAttribute('data-prompt');
        if (!promptText) return;

        navigator.clipboard.writeText(promptText).then(() => {
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 1800);
        }).catch(() => {
            // Fallback for older browsers / non-HTTPS
            const ta = document.createElement('textarea');
            ta.value = promptText;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 1800);
        });
    });

    // ── Mobile: tap to toggle prompt overlay ──
    slider.addEventListener('click', (e) => {
        // Only handle taps on the slide (not on copy button which is handled above)
        if (e.target.closest('.prompt-copy-btn')) return;
        if (e.target.closest('.slider-btn')) return;
        const slide = e.target.closest('.about-slide');
        if (!slide) return;

        // Toggle persistent prompt visibility on mobile
        const activeSlide = slider.querySelector('.about-slide.active');
        if (activeSlide && activeSlide === slide && window.matchMedia('(max-width: 768px)').matches) {
            activeSlide.classList.toggle('prompt-visible');
        }
    });

    startAuto();
}

function renderAbout(data) {
    const a = data.about;
    const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
    const setH = (sel, val) => { const el = document.querySelector(sel); if (el) el.innerHTML = val; };
    set('#about-section-label', a.label);
    setH('#about-section-title', a.title);
    set('#about-accent-num', a.accent.num);
    set('#about-accent-lbl', a.accent.lbl);

    // Set the CSS custom property for .about-img-frame::after content
    if (a.avatar) {
        document.documentElement.style.setProperty('--about-avatar', `'${a.avatar}'`);
    }

    // Init image slider from data
    if (a.photos && a.photos.length > 0) {
        initSlider(a.photos);
    }

    const bio = document.querySelector('#about-bio-container');
    if (bio) {
        bio.innerHTML = a.bio.map((p, i) =>
            `<p class="reveal${i > 0 ? ' reveal-delay-' + i : ''}">${p}</p>`
        ).join('');
        bio.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }

    const timeline = document.querySelector('#about-timeline-container');
    if (timeline) {
        timeline.innerHTML = a.timeline.map((item, i) =>
            `<div class="timeline-item reveal${i > 0 ? ' reveal-delay-' + i : ''}">
                <div class="timeline-year">${item.year}</div>
                <div class="timeline-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>`
        ).join('');
        timeline.querySelectorAll('.timeline-item.reveal').forEach(el => revealObserver.observe(el));
    }
}

function renderSkills(data) {
    const s = data.skillsSection;
    const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
    const setH = (sel, val) => { const el = document.querySelector(sel); if (el) el.innerHTML = val; };
    set('#skills-section-label', s.label);
    setH('#skills-section-title', s.title);

    const grid = document.querySelector('#skills-grid-container');
    if (grid) {
        grid.innerHTML = s.categories.map((cat, i) =>
            `<div class="skill-card reveal${i > 0 ? ' reveal-delay-' + i : ''}">
                <div class="skill-icon"><i class="${cat.icon}" aria-hidden="true"></i></div>
                <h3>${cat.title}</h3>
                <p>${cat.description}</p>
                <div class="skill-tags">
                    ${cat.tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}
                </div>
            </div>`
        ).join('');
        grid.querySelectorAll('.skill-card.reveal').forEach(el => revealObserver.observe(el));
    }
}

function renderContact(data) {
    const c = data.contact;
    const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
    const setH = (sel, val) => { const el = document.querySelector(sel); if (el) el.innerHTML = val; };
    set('#contact-section-label', c.label);
    setH('#contact-section-title', c.title);
    set('#contact-section-subtext', c.subtext);
    const emailEl = document.querySelector('#contact-email-link');
    if (emailEl) {
        emailEl.href = 'mailto:' + c.email;
        emailEl.textContent = c.email;
    }
    const socials = document.querySelector('#contact-socials-container');
    if (socials) {
        socials.innerHTML = c.socials.map(s =>
            `<a href="${s.link}" class="social-link" target="_blank" rel="noopener" title="${s.platform}" aria-label="${s.platform}">
                <i class="${s.icon}" aria-hidden="true"></i>
            </a>`
        ).join('');
    }
}

function renderFooter(data) {
    const f = data.footer;
    const copy = document.querySelector('#footer-copy-text');
    if (copy) copy.textContent = `\u00a9 ${f.year} ${f.name}. Built with ${f.techStack}.`;
    const back = document.querySelector('#footer-back-link');
    if (back) back.textContent = f.backToTopLabel;
}

/* ── Single init entry point ── */
async function initPortfolio() {
    try {
        const data = await getPortfolioData();

        renderNavigation(data);
        renderCta(data);
        renderHero(data);
        renderMarquee(data);
        renderAbout(data);
        renderSkills(data);
        renderContact(data);
        renderFooter(data);

        // Observe any .reveal elements not already observed by individual renderers
        document.querySelectorAll('.reveal').forEach(el => {
            if (!el.classList.contains('visible')) revealObserver.observe(el);
        });

    } catch (err) {
        console.error('Portfolio init failed:', err);
    }
}

document.addEventListener('DOMContentLoaded', initPortfolio);