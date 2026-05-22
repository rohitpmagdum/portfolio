async function loadPortfolioData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        // 1. Hero & Marquee Logic (null-safe)
        const headlineLines = document.querySelectorAll('#main-headline div');
        data.hero.headline.forEach((text, i) => { if (headlineLines[i]) headlineLines[i].textContent = text; });
        const heroDesc = document.querySelector('#hero-description');
        if (heroDesc) heroDesc.textContent = data.hero.description;

        const marqueeTrack = document.querySelector('#marquee-track-container');
        if (marqueeTrack) {
            marqueeTrack.innerHTML = data.marquee.map(item => `
                <div class="marquee-item">
                    <span>${item.category}:</span>
                    ${item.skills.map(s => `<div>${s}</div>`).join('<span>✦</span>')}
                </div>
            `).join('') + marqueeTrack.innerHTML;
        }

        // 2. Skills Section Logic [3, 8] (null-safe)
        const skills = data.skillsSection;
        const skillsLabel = document.querySelector('#skills-section-label');
        const skillsTitle = document.querySelector('#skills-section-title');
        if (skillsLabel) skillsLabel.textContent = skills.label;
        if (skillsTitle) skillsTitle.innerHTML = skills.title;
            
        const gridContainer = document.querySelector('#skills-grid-container');
        if (gridContainer) {
            // 1. Inject the HTML string into the DOM
            gridContainer.innerHTML = skills.categories.map((cat, index) => `
                <div class="skill-card reveal ${index > 0 ? 'reveal-delay-' + index : ''}">
                    <div class="skill-icon">${cat.icon}</div>
                    <h3>${cat.title}</h3>
                    <p>${cat.description}</p>
                    <div class="skill-tags">
                        ${cat.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `).join('');
                
            // 2. Initialize the Intersection Observer
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15
            });
            
            // 3. Target the newly created cards and start observing them
            gridContainer.querySelectorAll('.skill-card.reveal').forEach(card => {
                revealObserver.observe(card);
            });
        }


        // 3. Projects Section Logic [4, 5, 7] (null-safe)
        const projLabel = document.querySelector('#projects-section-label');
        const projTitle = document.querySelector('#projects-section-title');
        if (projLabel) projLabel.textContent = data.projectsHeader.label;
        if (projTitle) projTitle.innerHTML = data.projectsHeader.title;

        // 4. Contact Section Logic [4, 6] (null-safe)
        const contact = data.contact;
        const contactLabel = document.querySelector('#contact-section-label');
        const contactTitle = document.querySelector('#contact-section-title');
        if (contactLabel) contactLabel.textContent = contact.label;
        if (contactTitle) contactTitle.innerHTML = contact.title;

        const emailEl = document.querySelector('#contact-email-link');
        if (emailEl) {
            emailEl.href = `mailto:${contact.email}`;
            emailEl.textContent = contact.email;
        }

        const socialsContainer = document.querySelector('#contact-socials-container');
        if (socialsContainer) {
            socialsContainer.innerHTML = contact.socials.map(social => `
                <a href="${social.link}" class="social-link" target="_blank">
                    <i class="${social.icon}"></i>
                </a>
            `).join('');
        }

    } catch (error) {
        console.error("Critical error loading portfolio:", error);
    }
}
async function loadNavigation() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        const navContainer = document.querySelector('#nav-links-container');
        if (!navContainer) return;

        // Clear existing content just in case
        navContainer.innerHTML = '';

        // Generate the <li> elements dynamically
        data.navigation.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');

            a.href = item.link;
            a.textContent = item.label;

            li.appendChild(a);
            navContainer.appendChild(li);
        });

    } catch (error) {
        console.error("Error loading navigation:", error);
    }
}
async function loadCtaData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        const ctaButton = document.querySelector('#nav-cta-button');
        if (!ctaButton) return;

        // Update the link and text from JSON
        ctaButton.href = data.cta.link;
        ctaButton.textContent = data.cta.text;

    } catch (error) {
        console.error("Error loading CTA data:", error);
    }
}
async function loadHeroHeadline() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        // Select all line divs within the headline
        const headlineLines = document.querySelectorAll('#main-headline div');

        // Loop through the strings in your JSON and apply them to the divs
        data.hero.headline.forEach((text, index) => {
            if (headlineLines[index]) {
                headlineLines[index].textContent = text;
            }
        });

    } catch (error) {
        console.error("Error loading hero headline:", error);
    }
}
async function loadHeroDescription() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        const descriptionEl = document.querySelector('#hero-description');

        if (descriptionEl && data.hero.description) {
            descriptionEl.textContent = data.hero.description;
        }

    } catch (error) {
        console.error("Error loading hero description:", error);
    }
}
async function loadHeroStats() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        // 1. Render Stats
        const statsContainer = document.querySelector('#hero-stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = data.hero.stats.map(stat => `
                <div class="stat-item">
                    <div class="stat-num">${stat.num}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('');
        }

        // 2. Render Tech Stack Badges
        const stackContainer = document.querySelector('#hero-stack-container');
        if (stackContainer) {
            stackContainer.innerHTML = data.hero.techStack.map(tech => `
                <span class="stack-badge accent">${tech}</span>
            `).join('');
        }

    } catch (error) {
        console.error("Error loading hero stats:", error);
    }
}
async function loadHeroBackgroundAndScroll() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        // 1. Update Giant Ghost-Text
        const bgText = document.querySelector('#hero-bg-text');
        if (bgText && data.hero.backgroundText) {
            bgText.textContent = data.hero.backgroundText;
        }

        // 2. Update Scroll Hint Text
        const scrollText = document.querySelector('#scroll-text');
        if (scrollText && data.hero.scrollText) {
            scrollText.textContent = data.hero.scrollText;
        }

    } catch (error) {
        console.error("Error loading background or scroll text:", error);
    }
}
async function loadMarqueeData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        const marqueeTrack = document.querySelector('#marquee-track-container');
        if (!marqueeTrack) return;

        // Generate the marquee items
        marqueeTrack.innerHTML = data.marquee.map(item => `
            <div class="marquee-item">
                <span>${item.category}:</span>
                ${item.skills.map(skill => `<div>${skill}</div>`).join('<span>✦</span>')}
            </div>
        `).join('');

        // Note: For infinite scrolling, you may need to clone the
        // marquee content if your CSS animation requires it.
        const clone = marqueeTrack.innerHTML;
        marqueeTrack.innerHTML += clone;

    } catch (error) {
        console.error("Error loading marquee data:", error);
    }
}
// 1. Initialize the observer once globally at the top of your file
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // Animate once
        }
    });
}, {
    threshold: 0.15 // Triggers smoothly when 15% of the element enters view
});

async function loadAboutData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        const about = data.about;

        // 1. Basic Text Injection (null-safe)
        const aboutLabel = document.querySelector('#about-section-label');
        const aboutTitle = document.querySelector('#about-section-title');
        const aboutAvatar = document.querySelector('#about-avatar-text');
        const aboutAccentNum = document.querySelector('#about-accent-num');
        const aboutAccentLbl = document.querySelector('#about-accent-lbl');
        if (aboutLabel) aboutLabel.textContent = about.label;
        if (aboutTitle) aboutTitle.innerHTML = about.title;
        if (aboutAvatar) aboutAvatar.textContent = about.avatar;
        if (aboutAccentNum) aboutAccentNum.textContent = about.accent.num;
        if (aboutAccentLbl) aboutAccentLbl.textContent = about.accent.lbl;

        // 2. Render Bio Paragraphs with Reveal Classes (null-safe)
        const bioContainer = document.querySelector('#about-bio-container');
        if (bioContainer) {
            bioContainer.innerHTML = about.bio.map((para, index) => `
                <p class="reveal ${index > 0 ? 'reveal-delay-' + index : ''}">
                    ${para}
                </p>
            `).join('');
            bioContainer.querySelectorAll('.reveal').forEach(p => revealObserver.observe(p));
        }

        // 3. Render Timeline Items (null-safe)
        const timelineContainer = document.querySelector('#about-timeline-container');
        if (timelineContainer) {
            timelineContainer.innerHTML = about.timeline.map((item, index) => `
                <div class="timeline-item reveal ${index > 0 ? 'reveal-delay-' + index : ''}">
                    <div class="timeline-year">${item.year}</div>
                    <div class="timeline-info">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                </div>
            `).join('');
            timelineContainer.querySelectorAll('.timeline-item.reveal').forEach(item => {
                revealObserver.observe(item);
            });
        }

    } catch (error) {
        console.error("Error loading About section:", error);
    }
}

async function loadSkillsData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        const skills = data.skillsSection;

        // 1. Update Section Label and Title (null-safe)
        const skillsLabel = document.querySelector('#skills-section-label');
        const skillsTitle = document.querySelector('#skills-section-title');
        if (skillsLabel) skillsLabel.textContent = skills.label;
        if (skillsTitle) skillsTitle.innerHTML = skills.title;

        // 2. Render Skill Cards with Reveal Animations (null-safe)
        const gridContainer = document.querySelector('#skills-grid-container');
        if (gridContainer) {
            gridContainer.innerHTML = skills.categories.map((cat, index) => `
                <div class="skill-card reveal ${index > 0 ? 'reveal-delay-' + index : ''}">
                    <div class="skill-icon">${cat.icon}</div>
                    <h3>${cat.title}</h3>
                    <p>${cat.description}</p>
                    <div class="skill-tags">
                        ${cat.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error("Error loading Skills section:", error);
    }
}
async function loadProjectsHeader() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        const header = data.projectsHeader;

        // Update Label and Title (null-safe)
        const projLabel = document.querySelector('#projects-section-label');
        const projTitle = document.querySelector('#projects-section-title');
        if (projLabel) projLabel.textContent = header.label;
        if (projTitle) projTitle.innerHTML = header.title;

        // Update GitHub Link and Text (null-safe)
        const githubLinkEl = document.querySelector('#projects-github-link');
        if (githubLinkEl) {
            githubLinkEl.href = header.githubLink;
            githubLinkEl.textContent = header.githubLabel;
        }

    } catch (error) {
        console.error("Error loading Projects header:", error);
    }
}
async function loadFeaturedProject() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        // Find the project designated as 'featured'
        const featured = data.projects.find(p => p.featured);
        const container = document.querySelector('#featured-project-container');

        if (featured && container) {
            container.innerHTML = `
                <div class="project-card featured reveal">
                    <div class="project-thumb">
                        <div class="project-thumb-inner ${featured.thumbClass}">${featured.emoji}</div>
                    </div>
                    <div class="project-info">
                        <div class="project-num">// Project ${featured.id} — Featured</div>
                        <h3>${featured.title}</h3>
                        <p>${featured.description}</p>
                        <div class="project-tech">
                            ${featured.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            <a href="${featured.github}" class="proj-link"><i class="fab fa-github"></i> GitHub</a>
                            <a href="${featured.live}" class="proj-link"><i class="fas fa-arrow-up-right-from-square"></i> Live</a>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error loading featured project:", error);
    }
}
async function loadStandardProjects() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        // Filter for projects that are NOT featured
        const standardProjects = data.projects.filter(p => !p.featured);
        const container = document.querySelector('#standard-projects-container');

        if (container) {
            container.innerHTML = standardProjects.map((proj, index) => `
                <div class="project-card reveal ${index === 1 ? 'reveal-delay-1' : ''}">
                    <div class="project-thumb">
                        <div class="project-thumb-inner ${proj.thumbClass}">${proj.emoji}</div>
                    </div>
                    <div class="project-info">
                        <div class="project-num">// Project ${proj.id}</div>
                        <h3>${proj.title}</h3>
                        <p>${proj.description}</p>
                        <div class="project-tech">
                            ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            <a href="${proj.github}" class="proj-link"><i class="fab fa-github"></i> GitHub</a>
                            <a href="${proj.live}" class="proj-link"><i class="fas fa-arrow-up-right-from-square"></i> Live</a>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error("Error loading standard projects:", error);
    }
}
async function loadFinalProjectsRow() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        // Find Project 04 and the More Projects info
        const proj04 = data.projects.find(p => p.id === "04");
        const more = data.moreProjects;
        const container = document.querySelector('#final-projects-row');

        if (container && proj04 && more) {
            container.innerHTML = `
                <!-- Project 04 Card -->
                <div class="project-card reveal reveal-delay-2">
                    <div class="project-thumb">
                        <div class="project-thumb-inner ${proj04.thumbClass}">${proj04.emoji}</div>
                    </div>
                    <div class="project-info">
                        <div class="project-num">// Project ${proj04.id}</div>
                        <h3>${proj04.title}</h3>
                        <p>${proj04.description}</p>
                        <div class="project-tech">
                            ${proj04.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            <a href="${proj04.github}" class="proj-link"><i class="fab fa-github"></i> GitHub</a>
                            <a href="${proj04.live}" class="proj-link"><i class="fas fa-arrow-up-right-from-square"></i> Live</a>
                        </div>
                    </div>
                </div>

                <!-- Special 'More Projects' Card -->
                <div class="project-card reveal reveal-delay-3" 
                     style="border-color: rgba(212,255,78,0.15); background: rgba(212,255,78,0.02);">
                    <div class="project-info" style="padding: 2.5rem; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                        <div class="project-num">// More</div>
                        <h3 style="color: var(--accent);">${more.count} More<br>Projects</h3>
                        <p>${more.description}</p>
                        <div class="project-links" style="margin-top: auto;">
                            <a href="${more.githubLink}" class="proj-link" style="color: var(--accent);">
                                <i class="fab fa-github"></i> View on GitHub →
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error loading final projects row:", error);
    }
}
async function loadContactData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        const contact = data.contact;

        // 1. Update Labels and Text (null-safe)
        const contactLabel = document.querySelector('#contact-section-label');
        const contactTitle = document.querySelector('#contact-section-title');
        const contactSubtext = document.querySelector('#contact-section-subtext');
        if (contactLabel) contactLabel.textContent = contact.label;
        if (contactTitle) contactTitle.innerHTML = contact.title;
        if (contactSubtext) contactSubtext.textContent = contact.subtext;

        // 2. Update Email Link (null-safe)
        const emailEl = document.querySelector('#contact-email-link');
        if (emailEl) {
            emailEl.href = `mailto:${contact.email}`;
        }

        // 3. Render Social Links (null-safe)
        const socialsContainer = document.querySelector('#contact-socials-container');
        if (socialsContainer) {
            socialsContainer.innerHTML = contact.socials.map(social => `
                <a href="${social.link}" class="social-link" target="_blank" title="${social.platform}">
                    <i class="${social.icon}"></i>
                </a>
            `).join('');
        }

    } catch (error) {
        console.error("Error loading Contact section:", error);
    }
}
async function loadFooterData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        const footer = data.footer;

        // 1. Update Copyright and Tech Info
        const footerText = document.querySelector('#footer-copy-text');
        if (footerText) {
            footerText.textContent = `© ${footer.year} ${footer.name}. Built with ${footer.techStack}.`;
        }

        // 2. Update Back to Top Link
        const backToTop = document.querySelector('#footer-back-link');
        if (backToTop) {
            backToTop.textContent = footer.backToTopLabel;
        }

    } catch (error) {
        console.error("Error loading footer data:", error);
    }
}
async function initPortfolio() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error("JSON not found");
        const data = await response.json();

        // 1. Hero Section - Update headline lines and description
        const headlineLines = document.querySelectorAll('#main-headline div');
        data.hero.headline.forEach((text, i) => {
            if (headlineLines[i]) headlineLines[i].textContent = text;
        });
        const heroDesc = document.querySelector('#hero-description');
        if (heroDesc) heroDesc.textContent = data.hero.description;

        // 2. Marquee - Skills strip
        const marqueeTrack = document.querySelector('#marquee-track-container');
        if (marqueeTrack) {
            marqueeTrack.innerHTML = data.marquee.map(item => `
                <div class="marquee-item">
                    <span>${item.category}:</span>
                    ${item.skills.map(s => `<div>${s}</div>`).join('<span>✦</span>')}
                </div>
            `).join('');
        }

        // 3. Skills Section - Uses 'skillsSection' key from your data
        const skills = data.skillsSection;
        const skillsLabel = document.querySelector('#skills-section-label');
        const skillsTitle = document.querySelector('#skills-section-title');
        if (skillsLabel) skillsLabel.textContent = skills.label;
        if (skillsTitle) skillsTitle.innerHTML = skills.title;

        const gridContainer = document.querySelector('#skills-grid-container');
        if (gridContainer) {
            gridContainer.innerHTML = skills.categories.map((cat, index) => `
                <div class="skill-card reveal ${index > 0 ? 'reveal-delay-' + index : ''}">
                    <div class="skill-icon">${cat.icon}</div>
                    <h3>${cat.title}</h3>
                    <p>${cat.description}</p>
                    <div class="skill-tags">
                        ${cat.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }

        // 4. Projects & Contact (Condensed Logic, null-safe)
        const projTitleEl = document.querySelector('#projects-section-title');
        if (projTitleEl) projTitleEl.innerHTML = data.projectsHeader.title;

        const emailEl = document.querySelector('#contact-email-link');
        if (emailEl) {
            emailEl.textContent = data.contact.email;
            emailEl.href = `mailto:${data.contact.email}`;
        }

    } catch (error) {
        console.error("Failed to load portfolio:", error);
    }
}

// Only one event listener needed
document.addEventListener('DOMContentLoaded', initPortfolio);
document.addEventListener('DOMContentLoaded', loadFooterData);
document.addEventListener('DOMContentLoaded', loadContactData);
document.addEventListener('DOMContentLoaded', loadFinalProjectsRow);
document.addEventListener('DOMContentLoaded', loadStandardProjects);
document.addEventListener('DOMContentLoaded', loadFeaturedProject);
document.addEventListener('DOMContentLoaded', loadProjectsHeader);
document.addEventListener('DOMContentLoaded', loadSkillsData);
document.addEventListener('DOMContentLoaded', loadAboutData);
document.addEventListener('DOMContentLoaded', loadMarqueeData);
document.addEventListener('DOMContentLoaded', loadHeroBackgroundAndScroll);
document.addEventListener('DOMContentLoaded', loadHeroStats);
document.addEventListener('DOMContentLoaded', loadHeroDescription);
document.addEventListener('DOMContentLoaded', loadHeroHeadline);
document.addEventListener('DOMContentLoaded', loadCtaData);
document.addEventListener('DOMContentLoaded', loadNavigation);
document.addEventListener('DOMContentLoaded', loadPortfolioData);