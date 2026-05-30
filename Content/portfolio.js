/**
 * Portfolio — Optimized loader with rich interactivity.
 * Fetches data.json ONCE, then populates all sections.
 * Enables: ripple, tilt, magnetic buttons, tag flips,
 *   timeline expand, parallax, copy-toast, easter eggs.
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

/* ═══════════════════════════════════════════
   INTERACTIVE HELPERS
   ═══════════════════════════════════════════ */

/* ── Copy Toast ── */
let toastTimer;

function showCopyToast(message) {
    const toast = document.getElementById('copyToast');
    if (!toast) return;
    toast.textContent = message || '📋 Copied!';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

/* ── Ripple Effect ── */
function createRipple(e, el) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size * 0.6 + 'px';
    ripple.style.left = (e.clientX - rect.left - size * 0.3) + 'px';
    ripple.style.top = (e.clientY - rect.top - size * 0.3) + 'px';
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

function attachRipple(selector) {
    document.addEventListener('click', (e) => {
        const el = e.target.closest(selector);
        if (!el) return;
        createRipple(e, el);
    });
}

/* ── 3D Card Tilt ── */
function enable3DTilt(selector, intensity = 8) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform =
                `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
        });
    });
}

/* ── Stat Number Pulse on Scroll ── */
let statPulsed = false;
function enableStatPulse() {
    const statsSection = document.querySelector('.hero');
    if (!statsSection) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statPulsed) {
                statPulsed = true;
                document.querySelectorAll('.stat-num').forEach((el, i) => {
                    setTimeout(() => {
                        el.classList.add('pulse');
                        el.addEventListener('animationend', () => el.classList.remove('pulse'), { once: true });
                    }, i * 180);
                });
            }
        });
    }, { threshold: 0.6 });
    observer.observe(statsSection);
}

/* ── Skill Tag Flip on Click ── */
function attachTagFlip() {
    document.addEventListener('click', (e) => {
        const tag = e.target.closest('.skill-tag');
        if (!tag) return;
        if (tag.classList.contains('flipped')) return;
        tag.classList.add('flipped');
        const techName = tag.textContent.trim();
        showCopyToast('📎 ' + techName);
        setTimeout(() => tag.classList.remove('flipped'), 500);
    });
}

/* ── Timeline Expand/Collapse ── */
function attachTimelineToggle() {
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.timeline-item');
        if (!item) return;
        // If there's no .timeline-extra, inject one with detail
        if (!item.querySelector('.timeline-extra')) {
            const p = item.querySelector('.timeline-info p');
            const fullText = p ? p.textContent : '';
            const extra = document.createElement('div');
            extra.className = 'timeline-extra';
            extra.innerHTML =
                '<p style="font-size:0.82rem;color:var(--fg);line-height:1.7;">' +
                '📌 ' + (fullText || 'More details about this role.') +
                ' — This position reflects hands-on experience in enterprise-grade software engineering.' +
                '</p>';
            item.appendChild(extra);
        }
        item.classList.toggle('expanded');
    });
}

/* ── Hero Background Text Parallax ── */
function enableParallax() {
    const bgText = document.getElementById('hero-bg-text');
    if (!bgText) return;
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 16;
        const y = (e.clientY / window.innerHeight - 0.5) * 12;
        bgText.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
}

/* ── Magnetic Buttons ── */
function enableMagneticButtons() {
    const magneticSelectors = '.nav-cta, .btn-primary, .btn-ghost, .social-link';
    document.addEventListener('mousemove', (e) => {
        document.querySelectorAll(magneticSelectors).forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
            const radius = Math.max(rect.width, rect.height) * 1.2;
            if (dist < radius) {
                const strength = (1 - dist / radius) * 6;
                const dx = (e.clientX - cx) * strength / dist * 0.25;
                const dy = (e.clientY - cy) * strength / dist * 0.25;
                btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
            } else {
                btn.style.transform = 'translate(0, 0)';
            }
        });
    });
}

/* ── Contact Email Copy ── */
function attachEmailCopy() {
    const emailEl = document.getElementById('contact-email-link');
    if (!emailEl) return;
    emailEl.addEventListener('click', (e) => {
        const email = emailEl.textContent || emailEl.getAttribute('href')?.replace('mailto:', '');
        if (!email || email.indexOf('@') === -1) return;
        e.preventDefault();
        navigator.clipboard.writeText(email).then(() => {
            showCopyToast('📧 Email copied!');
        }).catch(() => {
            showCopyToast('📧 ' + email);
        });
    });
}

/* ── Glow Pulse on Contact ── */
function enableGlowPulse() {
    const contact = document.querySelector('#contact');
    if (!contact) return;
    contact.classList.add('glow-pulse');
}

/* ── Headline Glitch on Double Click ── */
function attachHeadlineGlitch() {
    const h1 = document.getElementById('main-headline');
    if (!h1) return;
    h1.addEventListener('dblclick', (e) => {
        const lines = h1.querySelectorAll('div');
        lines.forEach((line, i) => {
            setTimeout(() => {
                line.style.animation = 'headline-glitch 0.3s ease';
                line.addEventListener('animationend', () => {
                    line.style.animation = '';
                }, { once: true });
            }, i * 40);
        });
        showCopyToast('⚡ Glitch!');
    });
}

/* ── Nav Logo Easter Egg ── */
function attachEasterEgg() {
    const logo = document.querySelector('.nav-logo');
    if (!logo) return;
    let clicks = 0;
    let clickTimer;
    logo.addEventListener('click', (e) => {
        clicks++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clicks = 0; }, 800);
        if (clicks >= 5) {
            clicks = 0;
            document.body.classList.add('easter-egg-active');
            showCopyToast('🎉 You found the easter egg!');
            setTimeout(() => document.body.classList.remove('easter-egg-active'), 600);
        }
    });
}

/* ── Hero Stats Click to pulse ── */
function attachStatClickPulse() {
    document.addEventListener('click', (e) => {
        const statNum = e.target.closest('.stat-num');
        if (!statNum) return;
        statNum.classList.add('pulse');
        statNum.addEventListener('animationend', () => statNum.classList.remove('pulse'), { once: true });
    });
}

/* ── Marquee Drag Scroll ── */
function enableMarqueeDrag() {
    const marquee = document.getElementById('marquee-track-container');
    if (!marquee) return;
    let isDown = false, startX, scrollLeftPos;

    marquee.addEventListener('mousedown', (e) => {
        isDown = true;
        marquee.style.animationPlayState = 'paused';
        startX = e.pageX - marquee.getBoundingClientRect().left;
        scrollLeftPos = marquee.scrollLeft;
    });

    marquee.addEventListener('mouseleave', () => {
        isDown = false;
        marquee.style.animationPlayState = 'running';
    });

    marquee.addEventListener('mouseup', () => {
        isDown = false;
        marquee.style.animationPlayState = 'running';
    });

    marquee.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - marquee.getBoundingClientRect().left;
        const walk = (x - startX) * 1.5;
        marquee.scrollLeft = scrollLeftPos - walk;
    });
}

/* ── Footer Copy hover easter egg ── */
function attachFooterClickCopy() {
    const footerCopy = document.getElementById('footer-copy-text');
    if (!footerCopy) return;
    footerCopy.addEventListener('dblclick', () => {
        const text = footerCopy.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showCopyToast('📋 Footer copied!');
        }).catch(() => {});
    });
}

/* ═══════════════════════════════════════════
   INIT ALL INTERACTIONS
   ═══════════════════════════════════════════ */

function initInteractions() {
    // Ripple on buttons
    attachRipple('.btn-primary, .btn-ghost, .nav-cta, .social-link');
    rippleOnExisting('.btn-primary, .btn-ghost, .nav-cta, .social-link');

    // 3D Tilt on cards (deferred to let DOM render)
    setTimeout(() => {
        enable3DTilt('.hero-card', 6);
        enable3DTilt('.skill-card', 4);
    }, 500);

    // Stats pulse
    setTimeout(enableStatPulse, 800);

    // Tag flip
    attachTagFlip();

    // Timeline toggle
    setTimeout(attachTimelineToggle, 500);

    // Parallax on hero bg text
    enableParallax();

    // Magnetic buttons
    enableMagneticButtons();

    // Email copy
    setTimeout(attachEmailCopy, 500);

    // Glow pulse on contact
    setTimeout(enableGlowPulse, 1000);

    // Headline glitch
    attachHeadlineGlitch();

    // Easter egg on logo
    attachEasterEgg();

    // Stat click pulse
    attachStatClickPulse();

    // Marquee drag
    enableMarqueeDrag();

    // Footer double-click copy
    setTimeout(attachFooterClickCopy, 500);
}

function rippleOnExisting(selector) {
    document.querySelectorAll(selector).forEach(el => {
        el.classList.add('ripple-container');
    });
}

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
            showCopyToast('📋 Prompt copied!');
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
            showCopyToast('📋 Prompt copied!');
        });
    });

    // ── Tap to toggle prompt overlay / click outside to dismiss ──
    slider.addEventListener('click', (e) => {
        // Ignore clicks on copy button or slider nav
        if (e.target.closest('.prompt-copy-btn')) return;
        if (e.target.closest('.slider-btn')) return;

        const activeSlide = slider.querySelector('.about-slide.active');
        if (!activeSlide) return;

        const clickedInsidePrompt = e.target.closest('.prompt-overlay');
        const clickedOnSlide = e.target.closest('.about-slide');

        if (activeSlide.classList.contains('prompt-visible')) {
            // Prompt is open — clicking outside it dismisses
            if (!clickedInsidePrompt) {
                activeSlide.classList.remove('prompt-visible');
            }
        } else if (clickedOnSlide === activeSlide) {
            // Prompt is closed — clicking the active slide opens it
            activeSlide.classList.add('prompt-visible');
        }
    });

    // ── Document-level: click outside slider dismisses prompt ──
    document.addEventListener('click', (e) => {
        const activeSlide = slider.querySelector('.about-slide.active');
        if (!activeSlide || !activeSlide.classList.contains('prompt-visible')) return;
        // If click is outside the entire slider frame, dismiss
        if (!slider.contains(e.target)) {
            activeSlide.classList.remove('prompt-visible');
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
        grid.innerHTML = s.categories.map((cat, i) => {
            const isAI = cat.icon && cat.icon.includes('robot');
            return `<div class="skill-card reveal${i > 0 ? ' reveal-delay-' + i : ''}${isAI ? ' ai-glow' : ''}">
                <div class="skill-icon"><i class="${cat.icon}" aria-hidden="true"></i></div>
                <h3>${cat.title}</h3>
                <p>${cat.description}</p>
                <div class="skill-tags">
                    ${cat.tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}
                </div>
            </div>`;
        }).join('');
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
    if (copy) copy.textContent = `\u00a9 ${f.year} ${f.name}. ${f.techStack}.`;
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

        // Delay interactions slightly so DOM is populated
        initInteractions();

    } catch (err) {
        console.error('Portfolio init failed:', err);
    }
}

document.addEventListener('DOMContentLoaded', initPortfolio);