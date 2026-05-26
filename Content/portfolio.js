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

function initSlider(images) {
    const slider = document.querySelector('#about-slider');
    const dotsContainer = document.querySelector('#slider-dots');
    const prevBtn = document.querySelector('#slider-prev');
    const nextBtn = document.querySelector('#slider-next');

    if (!slider || !images || images.length === 0) return;

    let currentIndex = 0;
    let autoInterval;

    // Inject images
    slider.innerHTML = images.map((src, i) =>
        `<img src="${src}" alt="Rohit Magdum Photo ${i + 1}" class="about-slide${i === 0 ? ' active' : ''}" />`
    ).join('');

    // Inject dots
    if (dotsContainer) {
        dotsContainer.innerHTML = images.map((_, i) =>
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
        const next = (currentIndex + 1) % images.length;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentIndex - 1 + images.length) % images.length;
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

    // Init image slider from data
    if (a.images && a.images.length > 0) {
        initSlider(a.images);
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
                <div class="skill-icon">${cat.icon}</div>
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