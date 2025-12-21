/**
 * Portfolio Website JavaScript
 */

// Initialization flags to prevent multiple initializations
let isInitialized = false;
let isTTSInitialized = false;
let isSkillTooltipsInitialized = false;
let isVisitorCountInitialized = false;

// Global flag to prevent infinite loops
let isInitializing = false;

// Language Management
let currentLang = localStorage.getItem('language') || 'ko';

function switchLanguage(lang) {
    // Update language state (synchronous, safe)
    currentLang = lang;
    
    // Update localStorage asynchronously to prevent blocking
    setTimeout(() => {
        try {
            localStorage.setItem('language', lang);
        } catch (e) {
            // Ignore localStorage errors
        }
    }, 0);
    
    // Update HTML lang attribute (synchronous, safe)
    try {
        if (document && document.documentElement) {
            document.documentElement.lang = lang;
        }
    } catch (e) {
        // Ignore
    }
    
    // Update language button (single element, synchronous, safe)
    try {
        const langBtn = document.getElementById('langBtn');
        if (langBtn) {
            const langText = langBtn.querySelector('.lang-text');
            if (langText) {
                langText.textContent = lang === 'ko' ? 'EN' : 'KO';
            }
        }
    } catch (e) {
        // Ignore
    }
    
    // Stop TTS (non-blocking, safe)
    try {
        if (typeof speechSynthesis !== 'undefined' && speechSynthesis) {
            if (typeof isPaused !== 'undefined' && typeof stopTTS === 'function') {
                if (speechSynthesis.speaking || isPaused) {
                    stopTTS();
                }
            }
        }
    } catch (e) {
        // Ignore
    }
    
    // Update all elements with data-ko and data-en attributes (async, batched for performance)
    setTimeout(() => {
        try {
            updateLanguageElements(lang);
        } catch (e) {
            console.error('Error updating language elements:', e);
        }
    }, 10);
    // Also attempt to load JSON locale file and apply data-i18n translations
    setTimeout(() => {
        try {
            if (typeof loadLocale === 'function') loadLocale(lang);
        } catch (e) {
            // ignore
        }
    }, 60);
}

// Safe function to update language elements without causing infinite loops
function updateLanguageElements(lang) {
    try {
        // Get all elements with both data-ko and data-en attributes
        const elements = document.querySelectorAll('[data-ko][data-en]');
        const totalElements = elements.length;
        
        // Process in smaller batches to prevent blocking
        const batchSize = 50;
        let processed = 0;
        
        function processBatch(startIndex) {
            const endIndex = Math.min(startIndex + batchSize, totalElements);
            
            for (let i = startIndex; i < endIndex; i++) {
                try {
                    const element = elements[i];
                    if (!element || !element.isConnected) continue;
                    
                    const text = element.getAttribute(`data-${lang}`);
                    if (text !== null && text !== undefined && text !== '') {
                        // Only update if text is different to prevent unnecessary DOM updates
                        if (element.textContent !== text) {
                            element.textContent = text;
                        }
                    }
                } catch (e) {
                    // Ignore individual element errors
                }
            }
            
            processed = endIndex;
            
            // Continue with next batch if there are more elements
            if (processed < totalElements) {
                setTimeout(() => processBatch(processed), 0);
            }
        }
        
        // Start processing
        if (totalElements > 0) {
            processBatch(0);
        }
        
        // Update TTS labels
        updateTTSLabels(lang);
        
        // Update visitor label
        updateVisitorLabel(lang);
        
        // Update skill tooltips
        updateSkillTooltips(lang);
        
        // Update skill category titles
        updateSkillCategories(lang);
        
    } catch (e) {
        console.error('Error in updateLanguageElements:', e);
    }
}


// Helper function to update TTS labels
function updateTTSLabels(lang) {
    try {
        const playBtn = document.getElementById('ttsPlayBtn');
        const pauseBtn = document.getElementById('ttsPauseBtn');
        const stopBtn = document.getElementById('ttsStopBtn');
        const speedLabel = document.querySelector('.tts-speed-label');
        
        if (playBtn) {
            const playText = playBtn.querySelector('.tts-button-text');
            if (playText) {
                const text = playText.getAttribute(`data-${lang}`);
                if (text) playText.textContent = text;
            }
        }
        if (pauseBtn) {
            const pauseText = pauseBtn.querySelector('.tts-button-text');
            if (pauseText) {
                const text = pauseText.getAttribute(`data-${lang}`);
                if (text) pauseText.textContent = text;
            }
        }
        if (stopBtn) {
            const stopText = stopBtn.querySelector('.tts-button-text');
            if (stopText) {
                const text = stopText.getAttribute(`data-${lang}`);
                if (text) stopText.textContent = text;
            }
        }
        if (speedLabel) {
            const text = speedLabel.getAttribute(`data-${lang}`);
            if (text) speedLabel.textContent = text;
        }
    } catch (e) {
        console.warn('Error updating TTS labels:', e);
    }
}

// Helper function to update visitor label
function updateVisitorLabel(lang) {
    try {
        const visitorLabel = document.querySelector('.visitor-label');
        if (visitorLabel) {
            const text = visitorLabel.getAttribute(`data-${lang}`);
            if (text) visitorLabel.textContent = text;
        }
    } catch (e) {
        console.warn('Error updating visitor label:', e);
    }
}

// --- JSON-based locale loader and applier (data-i18n) ---
async function loadLocale(lang) {
    try {
        const url = '/locales/' + lang + '.json';
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) {
            window.currentLocale = null;
            return;
        }
        const dict = await res.json();
        window.currentLocale = dict;
        applyLocaleTranslations(dict);
    } catch (e) {
        window.currentLocale = null;
        // silent fail, fallback to data-ko/data-en handling
    }
}

// Enhanced: support data-i18n-attr and data-i18n-html
function applyLocaleTranslations(dict) {
    if (!dict) return;
    try {
        // text content via data-i18n (already present)
        const i18nEls = document.querySelectorAll('[data-i18n]');
        i18nEls.forEach(el => {
            try {
                const key = el.getAttribute('data-i18n');
                // Apply all keys when present; prefer locale values over DOM fallbacks

                const val = getValueByPath(dict, key);
                if (val === undefined || val === null) return;
                const tag = el.tagName.toLowerCase();
                if (tag === 'input' || tag === 'textarea') {
                    if (el.hasAttribute('placeholder')) el.placeholder = val;
                    else el.value = val;
                } else {
                    if (el.textContent !== val) el.textContent = val;
                }
            } catch (e) {
                // ignore element error
            }
        });

        // HTML content override
        const htmlEls = document.querySelectorAll('[data-i18n-html]');
        htmlEls.forEach(el => {
            try {
                const key = el.getAttribute('data-i18n-html');
                const val = getValueByPath(dict, key);
                if (val === undefined || val === null) return;
                if (el.innerHTML !== val) el.innerHTML = val;
            } catch (e) {
                // ignore
            }
        });

        // attribute mappings: format -> "attr1:json.path1;attr2:json.path2"
        const attrEls = document.querySelectorAll('[data-i18n-attr]');
        attrEls.forEach(el => {
            try {
            // Skip attributes for elements inside projects section
            // if (el.closest && el.closest('.projects-section')) return;
                const mapping = el.getAttribute('data-i18n-attr');
                if (!mapping) return;
                const pairs = mapping.split(';').map(s => s.trim()).filter(Boolean);
                pairs.forEach(pair => {
                    const idx = pair.indexOf(':');
                    if (idx === -1) return;
                    const attr = pair.substring(0, idx).trim();
                    const key = pair.substring(idx + 1).trim();
                    const val = getValueByPath(dict, key);
                    if (val === undefined || val === null) return;
                    // set attribute or property
                    try {
                        if (attr in el) el[attr] = val;
                        el.setAttribute(attr, val);
                    } catch (e) {
                        try { el.setAttribute(attr, val); } catch (ee) {}
                    }
                });
            } catch (e) {
                // ignore
            }
        });

        // Optionally update document.title if locale provides pageTitle
        try {
            const pageTitle = getValueByPath(dict, 'pageTitle');
            if (pageTitle) document.title = pageTitle;
        } catch (e) {}

    } catch (e) {
        // ignore
    }
}

function getValueByPath(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((o, k) => (o && Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined), obj);
}

// Load initial locale on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    try {
        if (currentLang) loadLocale(currentLang);
    } catch (e) {
        // ignore
    }
});




// Initialize project links with language data attributes
function initProjectLinkLanguage() {
    try {
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            if (!link.hasAttribute('data-ko')) {
                link.setAttribute('data-ko', '자세히 보기');
            }
            if (!link.hasAttribute('data-en')) {
                link.setAttribute('data-en', 'View Details');
            }
        });
    } catch (e) {
        console.warn('Error initializing project link language:', e);
    }
}

// Skill tooltip descriptions (both Korean and English)
const skillTooltips = {
    'Java': { ko: '객체지향 프로그래밍 언어, 엔터프라이즈 애플리케이션 개발', en: 'Object-oriented programming language for enterprise applications' },
    'Spring Framework': { ko: 'Java 기반 엔터프라이즈 애플리케이션 개발 프레임워크', en: 'Java-based framework for enterprise application development' },
    'Spring Boot': { ko: 'Spring Framework 기반 빠른 애플리케이션 개발 도구', en: 'Tool for rapid application development on Spring Framework' },
    'Spring AI': { ko: 'Spring 기반 AI 통합 프레임워크, LLM 연동', en: 'Spring-based AI integration framework with LLM support' },
    'JSP/Servlet': { ko: 'Java 웹 애플리케이션 개발 기술', en: 'Java web application development technology' },
    'MyBatis': { ko: 'Java 영속성 프레임워크, SQL 매퍼', en: 'Java persistence framework and SQL mapper' },
    'Python': { ko: '고수준 프로그래밍 언어, 데이터 분석 및 웹 개발', en: 'High-level language for data analysis and web development' },
    'HTML5/CSS3': { ko: '웹 표준 마크업 및 스타일링 언어', en: 'Web standard markup and styling languages' },
    'Bootstrap': { ko: '반응형 웹 디자인 CSS 프레임워크', en: 'Responsive web design CSS framework' },
    'JavaScript/jQuery': { ko: '웹 클라이언트 사이드 스크립팅 및 DOM 조작', en: 'Client-side scripting and DOM manipulation for the web' },
    'Flutter/Dart': { ko: '크로스 플랫폼 모바일 앱 개발 프레임워크', en: 'Cross-platform mobile app framework' },
    'Android/Java & Kotlin': { ko: '안드로이드 네이티브 앱 개발', en: 'Android native application development' },
    'iOS/Swift & SwiftUI': { ko: 'iOS 네이티브 앱 개발, SwiftUI 프레임워크', en: 'iOS native development with Swift and SwiftUI' },
    'Oracle': { ko: '관계형 데이터베이스 관리 시스템', en: 'Relational database management system' },
    'Git/GitHub & GitLab & Bitbucket': { ko: '버전 관리 시스템 및 협업 플랫폼', en: 'Version control systems and collaboration platforms' },
    'CI/CD (Jenkins)': { ko: '지속적 통합 및 배포 자동화 도구', en: 'Continuous integration and delivery automation tool' },
    'Docker': { ko: '컨테이너 기반 가상화 플랫폼', en: 'Container-based virtualization platform' },
    'Figma': { ko: 'UI/UX 디자인 및 프로토타이핑 도구', en: 'UI/UX design and prototyping tool' }
};

// Initialize skill tooltips
function initSkillTooltips() {
    // Prevent multiple initializations
    if (isSkillTooltipsInitialized) return;
    isSkillTooltipsInitialized = true;
    
    try {
        const skillNames = document.querySelectorAll('.skill-name');
        skillNames.forEach(skillName => {
            const skillText = skillName.textContent.trim();
            const tooltipObj = skillTooltips[skillText];
            if (tooltipObj) {
                // store both language variants on the element for reference
                skillName.setAttribute('data-tooltip-ko', tooltipObj.ko);
                skillName.setAttribute('data-tooltip-en', tooltipObj.en);
                // set initial title based on current language
                const initial = tooltipObj[currentLang] || tooltipObj.ko;
                skillName.setAttribute('title', initial);
            }
        });
    } catch (e) {
        console.error('Error in initSkillTooltips:', e);
        isSkillTooltipsInitialized = false; // Reset on error
    }
}

// Update skill tooltips when language changes
function updateSkillTooltips(lang) {
    try {
        const skillNames = document.querySelectorAll('.skill-name');
        skillNames.forEach(skillName => {
            const skillText = skillName.textContent.trim();
            const tooltipObj = skillTooltips[skillText];
            let text = null;
            // prefer stored data attributes if present
            if (skillName.hasAttribute(`data-tooltip-${lang}`)) {
                text = skillName.getAttribute(`data-tooltip-${lang}`);
            } else if (tooltipObj && tooltipObj[lang]) {
                text = tooltipObj[lang];
            }
            if (text) {
                skillName.setAttribute('title', text);
            }
        });
    } catch (e) {
        console.warn('Error updating skill tooltips:', e);
    }
}

// Update skill category titles when language changes
function updateSkillCategories(lang) {
    try {
        const categoryTitles = document.querySelectorAll('.category-title');
        categoryTitles.forEach(title => {
            if (title.hasAttribute(`data-${lang}`)) {
                title.textContent = title.getAttribute(`data-${lang}`);
            }
        });
    } catch (e) {
        console.warn('Error updating skill categories:', e);
    }
}

// Visitor Count Management
function initVisitorCount() {
    // Prevent multiple initializations
    if (isVisitorCountInitialized) return;
    isVisitorCountInitialized = true;
    
    try {
        const visitorCountEl = document.getElementById('visitorCount');
        if (!visitorCountEl) return;
        
        // Get today's date as key
        const today = new Date().toISOString().split('T')[0];
        const todayKey = `visit_${today}`;
        const totalKey = 'total_visits';
        const lastVisitKey = 'last_visit_date';
        
        // Check if already visited today
        const lastVisit = localStorage.getItem(lastVisitKey);
        const visitedToday = localStorage.getItem(todayKey);
        
        // Get total visits
        let totalVisits = parseInt(localStorage.getItem(totalKey) || '0');
        
        // If first visit today, increment
        if (lastVisit !== today || !visitedToday) {
            totalVisits++;
            localStorage.setItem(totalKey, totalVisits.toString());
            localStorage.setItem(todayKey, 'true');
            localStorage.setItem(lastVisitKey, today);
        }
        
        // Format number with commas
        const formattedCount = totalVisits.toLocaleString('ko-KR');
        visitorCountEl.textContent = formattedCount;
        
        // Update visitor label on language change (without MutationObserver to prevent infinite loop)
        const visitorLabel = document.querySelector('.visitor-label');
        if (visitorLabel) {
            // Set initial label
            const label = visitorLabel.getAttribute(`data-${currentLang}`) || visitorLabel.textContent;
            if (visitorLabel.getAttribute(`data-${currentLang}`)) {
                visitorLabel.textContent = label;
            }
        }
    } catch (e) {
        console.error('Error in initVisitorCount:', e);
        isVisitorCountInitialized = false; // Reset on error
    }
}

// Navigation toggle for mobile
document.addEventListener('DOMContentLoaded', function() {
    // Prevent multiple initializations
    if (isInitialized) return;
    isInitialized = true;
    
    // Execute initialization asynchronously to prevent blocking
    setTimeout(function() {
        initializePage();
    }, 0);
});

function initializePage() {
    // Prevent multiple simultaneous initializations
    if (isInitializing) {
        console.warn('Initialization already in progress, skipping...');
        return;
    }
    isInitializing = true;
    
    // Wrap entire initialization in try-catch to prevent page blocking
    try {
        // Initialize language - set state and update elements
        try {
            document.documentElement.lang = currentLang;
            const langBtn = document.getElementById('langBtn');
            if (langBtn) {
                const langText = langBtn.querySelector('.lang-text');
                if (langText) {
                    langText.textContent = currentLang === 'ko' ? 'EN' : 'KO';
                }
            }
            // Apply initial language to all elements (delayed to prevent blocking)
            setTimeout(() => {
                try {
                    updateLanguageElements(currentLang);
                } catch (e) {
                    console.error('Error applying initial language:', e);
                }
            }, 100);
        } catch (e) {
            console.error('Error initializing language:', e);
        }
        
        // Initialize TTS (wrapped in try-catch to prevent blocking)
        try {
            initTTS();
        } catch (e) {
            console.error('Error initializing TTS:', e);
        }
        
        // Initialize skill tooltips (wrapped in try-catch to prevent blocking)
        try {
            initSkillTooltips();
        } catch (e) {
            console.error('Error initializing skill tooltips:', e);
        }
        
        // Initialize project links with language attributes
        try {
            initProjectLinkLanguage();
        } catch (e) {
            console.error('Error initializing project links:', e);
        }
        
        // Initialize visitor count (wrapped in try-catch to prevent blocking)
        try {
            initVisitorCount();
        } catch (e) {
            console.error('Error initializing visitor count:', e);
        }
        
        // Profile image click animation
        const profileImage = document.querySelector('.floating-profile-image');
        if (profileImage) {
            profileImage.addEventListener('click', function() {
                // Add clicked class for spin animation
                this.classList.add('clicked');
                
                // Remove class after animation completes
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 600);
            });
        }
        
        // Language switcher button - completely safe implementation
        const langBtn = document.getElementById('langBtn');
        if (langBtn) {
            let lastClickTime = 0;
            langBtn.addEventListener('click', function(e) {
                // Prevent rapid clicks (debounce)
                const now = Date.now();
                if (now - lastClickTime < 500) {
                    return;
                }
                lastClickTime = now;
                
                // Update language immediately - completely synchronous, no async operations
                try {
                    const newLang = currentLang === 'ko' ? 'en' : 'ko';
                    switchLanguage(newLang);
                } catch (error) {
                    // Ignore all errors - never block
                }
            }, { passive: true });
        }
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger) {
            hamburger.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
        }

        // Close menu and smooth scroll for navigation links (combined to avoid duplicate listeners)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // Close menu
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                // Smooth scroll
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate offset more accurately
                    const rect = targetSection.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const offsetTop = rect.top + scrollTop - 80;
                    
                    // Direct scroll without requestAnimationFrame for immediate response
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navbar background on scroll (throttled for performance)
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            let scrollTimeout = null;
            let lastScrollY = window.scrollY;
            window.addEventListener('scroll', function() {
                const currentScrollY = window.scrollY;
                
                // Only update if scroll position changed significantly
                if (Math.abs(currentScrollY - lastScrollY) < 5) {
                    return;
                }
                lastScrollY = currentScrollY;
                
                if (scrollTimeout) {
                    cancelAnimationFrame(scrollTimeout);
                }
                scrollTimeout = requestAnimationFrame(() => {
                    if (window.scrollY > 50) {
                        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    } else {
                        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }
                });
            }, { passive: true });
        }

        // Animate skill bars on scroll (delayed to prevent blocking)
        setTimeout(function() {
            try {
                const skillBars = document.querySelectorAll('.skill-progress');
                if (skillBars.length > 0) {
                    const observerOptions = {
                        threshold: 0.5,
                        rootMargin: '0px'
                    };

                    const skillObserver = new IntersectionObserver(function(entries) {
                        entries.forEach(entry => {
                            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                                const progress = entry.target.getAttribute('data-progress');
                                if (progress) {
                                    entry.target.style.width = progress + '%';
                                    entry.target.classList.add('animated');
                                }
                            }
                        });
                    }, observerOptions);

                    skillBars.forEach(bar => {
                        skillObserver.observe(bar);
                    });
                }
            } catch (e) {
                console.error('Error in skill bars observer:', e);
            }
        }, 100);

        // Animate stats on scroll (delayed to prevent blocking)
        setTimeout(function() {
            try {
                const statNumbers = document.querySelectorAll('.stat-number');
                if (statNumbers.length > 0) {
                    const statObserver = new IntersectionObserver(function(entries) {
                        entries.forEach(entry => {
                            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                                const text = entry.target.textContent;
                                const value = parseInt(text.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) {
                                    animateValue(entry.target, 0, value, 2000);
                                    entry.target.classList.add('animated');
                                }
                            }
                        });
                    }, { threshold: 0.5, rootMargin: '0px' });

                    statNumbers.forEach(stat => {
                        statObserver.observe(stat);
                    });
                }
            } catch (e) {
                console.error('Error in stat numbers observer:', e);
            }
        }, 100);

        // Add fade-in animation to sections on scroll (delayed to prevent blocking)
        setTimeout(function() {
            try {
                const sections = document.querySelectorAll('.section');
                if (sections.length > 0) {
                    const sectionObserver = new IntersectionObserver(function(entries) {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }
                        });
                    }, {
                        threshold: 0.1,
                        rootMargin: '0px 0px -50px 0px'
                    });

                    sections.forEach(section => {
                        section.style.opacity = '0';
                        section.style.transform = 'translateY(30px)';
                        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        sectionObserver.observe(section);
                    });
                }
            } catch (e) {
                console.error('Error in sections observer:', e);
            }
        }, 100);

        // Project Modal functionality
        const modal = document.getElementById('projectModal');
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalClose = document.querySelector('.modal-close');
        const projectLinks = document.querySelectorAll('.project-link');

        // Open modal when project link is clicked
        projectLinks.forEach(link => {
            link.addEventListener('click', function(e) {
            e.preventDefault();
            const projectCard = this.closest('.project-card');
            if (!projectCard) return;
            
            const projectContent = projectCard.querySelector('.project-content');
            if (!projectContent) return;
            
            // Extract project information
            const titleEl = projectContent.querySelector('.project-title');
            const title = titleEl ? titleEl.textContent : '';
            
            const detailRows = projectContent.querySelectorAll('.detail-row .detail-value');
            const client = detailRows[0] ? detailRows[0].textContent : '';
            const period = detailRows[1] ? detailRows[1].textContent : '';
            const environment = detailRows[2] ? detailRows[2].textContent : '';
            
            // Get data from hidden project-data div (prefer language-specific attributes)
            const projectData = projectContent.querySelector('.project-data');
            let introduction = '';
            let role = '';
            let review = '';

            if (projectData) {
                const introEl = projectData.querySelector('[data-field="introduction"]');
                const roleEl = projectData.querySelector('[data-field="role"]');
                const reviewEl = projectData.querySelector('[data-field="review"]');

                // Prefer attributes like data-en or data-ko if present
                if (introEl) {
                    const attr = introEl.getAttribute(`data-${currentLang}`);
                    introduction = (attr !== null && attr !== undefined && attr !== '') ? attr.trim() : introEl.textContent.trim();
                }
                if (roleEl) {
                    const attr = roleEl.getAttribute(`data-${currentLang}`);
                    role = (attr !== null && attr !== undefined && attr !== '') ? attr.trim() : roleEl.textContent.trim();
                }
                if (reviewEl) {
                    const attr = reviewEl.getAttribute(`data-${currentLang}`);
                    review = (attr !== null && attr !== undefined && attr !== '') ? attr.trim() : reviewEl.textContent.trim();
                }
            } else {
                console.warn('Project data not found for:', title);
            }
            
            // Get tags
            const tags = [];
            const tagElements = projectContent.querySelectorAll('.project-tags .tag');
            tagElements.forEach(tag => {
                tags.push(tag.textContent.trim());
            });
            
            // Populate modal - get all modal elements
            const modalTitleEl = document.getElementById('modalProjectTitle');
            const modalClientEl = document.getElementById('modalClient');
            const modalPeriodEl = document.getElementById('modalPeriod');
            const modalEnvironmentEl = document.getElementById('modalEnvironment');
            const modalIntroductionEl = document.getElementById('modalIntroduction');
            const modalRoleEl = document.getElementById('modalRole');
            const modalReviewEl = document.getElementById('modalReview');
            
            // Populate basic info
            if (modalTitleEl) modalTitleEl.textContent = title || '';
            if (modalClientEl) modalClientEl.textContent = client || '';
            if (modalPeriodEl) modalPeriodEl.textContent = period || '';
            if (modalEnvironmentEl) modalEnvironmentEl.textContent = environment || '';
            
            // Populate introduction - always show section
            if (modalIntroductionEl) {
                modalIntroductionEl.textContent = introduction || '';
                const introSection = modalIntroductionEl.closest('.modal-section');
                if (introSection) {
                    introSection.style.display = 'block';
                }
            }
            
            // Populate role - always show section
            if (modalRoleEl) {
                if (role && role.includes('|')) {
                    modalRoleEl.innerHTML = '<ul class="modal-role-list">' + 
                        role.split('|').map(r => '<li>' + r.trim() + '</li>').join('') + 
                        '</ul>';
                } else {
                    modalRoleEl.textContent = role || '';
                    // Add padding class for text-only content
                    if (role) {
                        modalRoleEl.style.paddingLeft = '1.5rem';
                    }
                }
                const roleSection = modalRoleEl.closest('.modal-section');
                if (roleSection) {
                    roleSection.style.display = 'block';
                }
            }
            
            // Populate review - always show section
            if (modalReviewEl) {
                const reviewSection = modalReviewEl.closest('.modal-section');
                const reviewTitleEl = document.getElementById('modalReviewTitle');
                
                // Get review data element
                const reviewDataEl = projectData ? projectData.querySelector('[data-field="review"]') : null;
                const isPortfolioType = reviewDataEl && reviewDataEl.getAttribute('data-type') === 'portfolio';

                // Helper: resolve localized string by priority: loaded locale -> element data-<lang> -> fallback
                const resolveLocalized = (key, el, fallbackKo, fallbackEn) => {
                    try {
                        const dict = window.currentLocale || {};
                        const val = getValueByPath(dict, key);
                        if (val !== undefined && val !== null && val !== '') return val;
                        if (el && el.getAttribute) {
                            const attr = el.getAttribute(`data-${currentLang}`);
                            if (attr !== null && attr !== undefined && attr !== '') return attr;
                        }
                        return currentLang === 'ko' ? fallbackKo : fallbackEn;
                    } catch (e) {
                        return currentLang === 'ko' ? fallbackKo : fallbackEn;
                    }
                };

                const localizedDetailTitle = resolveLocalized('modal.detail', reviewTitleEl, '프로젝트 상세', 'Project Details');
                const localizedReviewTitle = resolveLocalized('modal.review', reviewTitleEl, '프로젝트 후기', 'Project Review');
                const localizedNoDetail = resolveLocalized('modal.no_detail', reviewTitleEl, '프로젝트 상세 정보가 없습니다.', 'No project details available.');
                const localizedNoReview = resolveLocalized('modal.no_review', reviewTitleEl, '프로젝트 후기 정보가 없습니다.', 'No project review available.');

                // Check if this is Miracle Reading System project (match titles in either lang)
                const isMiracleReading = title === '미라클 리딩 시스템' || title === 'Miracle Reading System';

                if (isMiracleReading) {
                    // Use localized detail title
                    if (reviewTitleEl) reviewTitleEl.textContent = localizedDetailTitle;

                    // Get portfolio content from review data
                    if (isPortfolioType) {
                        // Set innerHTML to preserve HTML structure
                        modalReviewEl.innerHTML = reviewDataEl.innerHTML;
                    } else {
                        modalReviewEl.innerHTML = '<p>' + localizedNoDetail + '</p>';
                    }
                } else {
                    // Use localized review title for other projects
                    if (reviewTitleEl) reviewTitleEl.textContent = localizedReviewTitle;

                    // Check if portfolio type (like Productivity Hub)
                    if (isPortfolioType) {
                        // Set innerHTML to preserve HTML structure
                        modalReviewEl.innerHTML = reviewDataEl.innerHTML;
                    } else {
                        // Use text content for simple text reviews
                        modalReviewEl.textContent = review || localizedNoReview;
                    }
                }
                
                if (reviewSection) {
                    reviewSection.style.display = 'block';
                }
            }
            
            // Populate tags
            const tagsContainer = document.getElementById('modalTags');
            tagsContainer.innerHTML = tags.map(tag => '<span class="tag">' + tag + '</span>').join('');
            
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Scroll to Top Button
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        
        if (scrollTopBtn) {
            // Show/hide scroll top button based on scroll position (throttled for performance)
            let scrollTopTimeout = null;
            let lastScrollTopY = window.scrollY;
            let isScrollTopVisible = false;
            window.addEventListener('scroll', function() {
                const currentScrollY = window.scrollY;
                
                // Only update if scroll position changed significantly
                if (Math.abs(currentScrollY - lastScrollTopY) < 10) {
                    return;
                }
                lastScrollTopY = currentScrollY;
                
                if (scrollTopTimeout) {
                    cancelAnimationFrame(scrollTopTimeout);
                }
                scrollTopTimeout = requestAnimationFrame(() => {
                    const shouldBeVisible = window.scrollY > 300;
                    if (shouldBeVisible !== isScrollTopVisible) {
                        if (shouldBeVisible) {
                            scrollTopBtn.classList.add('visible');
                        } else {
                            scrollTopBtn.classList.remove('visible');
                        }
                        isScrollTopVisible = shouldBeVisible;
                    }
                });
            }, { passive: true });

            // Smooth scroll to top when button is clicked
            scrollTopBtn.addEventListener('click', function() {
                // Cancel any ongoing scroll animations
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Stat items click to scroll to sections
        const statItems = document.querySelectorAll('.stat-item[data-target]');
        statItems.forEach(item => {
            item.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate offset more accurately
                    const rect = targetSection.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const offsetTop = rect.top + scrollTop - 80;
                    
                    // Direct scroll without requestAnimationFrame for immediate response
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    } catch (e) {
        // Critical: Catch any errors in initialization to prevent page blocking
        console.error('Critical error in initializePage:', e);
    } finally {
        // Always reset initialization flag
        isInitializing = false;
    }
}

// Function to animate numbers
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue + (element.textContent.includes('+') ? '+' : '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end + (element.textContent.includes('+') ? '+' : '');
        }
    };
    window.requestAnimationFrame(step);
}

// TTS (Text-to-Speech) functionality
let speechSynthesis = null;
let currentUtterance = null;
let isPaused = false;
let ttsSpeed = 1.0;
let currentTTSText = ''; // Store current text being spoken
let currentTTSLang = 'ko'; // Store current language
let ttsCharIndex = 0; // Track current character index during playback

function initTTS() {
    // Prevent multiple initializations
    if (isTTSInitialized) return;
    isTTSInitialized = true;
    
    try {
        // Check if browser supports Web Speech API
        if ('speechSynthesis' in window) {
            speechSynthesis = window.speechSynthesis;
        
        // Get buttons
        const playBtn = document.getElementById('ttsPlayBtn');
        const pauseBtn = document.getElementById('ttsPauseBtn');
        const stopBtn = document.getElementById('ttsStopBtn');
        const speedSlider = document.getElementById('ttsSpeed');
        const speedValue = document.getElementById('ttsSpeedValue');
        
        // Play button
        if (playBtn) {
            playBtn.addEventListener('click', function() {
                playTTS();
            });
        }
        
        // Pause button
        if (pauseBtn) {
            pauseBtn.addEventListener('click', function() {
                pauseTTS();
            });
        }
        
        // Stop button
        if (stopBtn) {
            stopBtn.addEventListener('click', function() {
                stopTTS();
            });
        }
        
        // Speed control
        if (speedSlider && speedValue) {
            let speedChangeTimeout = null;
            speedSlider.addEventListener('input', function() {
                const newSpeed = parseFloat(this.value);
                const wasSpeaking = speechSynthesis.speaking || speechSynthesis.pending;
                const wasPaused = isPaused;
                
                ttsSpeed = newSpeed;
                speedValue.textContent = ttsSpeed.toFixed(1) + 'x';
                
                // Clear any pending restart
                if (speedChangeTimeout) {
                    clearTimeout(speedChangeTimeout);
                }
                
                // If currently speaking, restart with new speed
                if (wasSpeaking && currentTTSText && !wasPaused) {
                    // Use debounce to avoid multiple restarts during slider drag
                    speedChangeTimeout = setTimeout(() => {
                        console.log('Speed changed during playback, restarting with new speed:', ttsSpeed);
                        // Cancel current speech immediately
                        speechSynthesis.cancel();
                        isPaused = false;
                        currentUtterance = null;
                        
                        // Restart with new speed immediately (no delay for smoother transition)
                        restartTTSWithCurrentText();
                    }, 150); // Small debounce delay
                }
            });
        }
        
        // Stop TTS when page is unloaded
        window.addEventListener('beforeunload', function() {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        });
    } else {
        // Hide TTS controls if not supported
        const ttsControls = document.querySelector('.tts-controls');
        if (ttsControls) {
            ttsControls.style.display = 'none';
        }
    }
    } catch (e) {
        console.error('Error in initTTS:', e);
        isTTSInitialized = false; // Reset on error
    }
}

function getMaleVoice(lang) {
    const voices = speechSynthesis.getVoices();
    const langVoices = voices.filter(voice => {
        if (lang === 'ko') return voice.lang.startsWith('ko');
        if (lang === 'en') return voice.lang.startsWith('en');
        return false;
    });

    if (langVoices.length === 0) return null;

    if (lang === 'ko') {
        // No true male voice is available on the system.
        // The only voices are "Microsoft Heami" and "Google 한국의".
        // We will stop filtering and simply select one, relying on a low pitch setting.
        const microsoftVoice = langVoices.find(v => v.name.toLowerCase().includes('microsoft'));
        if (microsoftVoice) {
            console.log('🎤 No male voice found. Selecting Microsoft voice and using low pitch.', microsoftVoice.name);
            return microsoftVoice;
        }

        const googleVoice = langVoices.find(v => v.name.toLowerCase().includes('google'));
        if (googleVoice) {
            console.log('🎤 No male voice found. Selecting Google voice and using low pitch.', googleVoice.name);
            return googleVoice;
        }
        
        // Fallback to the first available voice.
        if (langVoices[0]) {
             console.log('🎤 No male voice found. Selecting first available voice and using low pitch.', langVoices[0].name);
            return langVoices[0];
        }

        return null; // Should not be reached
    }

    // English male voices (logic seems fine, keeping it)
    if (lang === 'en') {
        const maleVoice = langVoices.find(voice => {
            const name = voice.name.toLowerCase();
            return name.includes('male') || 
                   name.includes('man') || 
                   name.includes('david') || 
                   name.includes('daniel') ||
                   name.includes('james') ||
                   name.includes('john') ||
                   name.includes('mark') ||
                   name.includes('paul') ||
                   name.includes('thomas') ||
                   (name.includes('google') && name.includes('male')) ||
                   (name.includes('microsoft') && (name.includes('david') || name.includes('mark')));
        });
        if (maleVoice) return maleVoice;
    }

    // Final fallback for English or other languages
    return langVoices[0];
}

function playTTS() {
    const aboutTextContent = document.getElementById('aboutTextContent');
    
    if (!speechSynthesis || !aboutTextContent) return;
    
    // Check current state
    const actuallyPaused = speechSynthesis.paused === true;
    const isCurrentlyPaused = isPaused || actuallyPaused;
    const isCurrentlySpeaking = speechSynthesis.speaking || speechSynthesis.pending;
    
    console.log('playTTS called - isPaused:', isPaused, 'actuallyPaused:', actuallyPaused, 'isCurrentlySpeaking:', isCurrentlySpeaking);
    
    // If paused, resume
    if (isCurrentlyPaused && isCurrentlySpeaking && currentUtterance) {
        try {
            console.log('Attempting to resume TTS...');
            speechSynthesis.resume();
            isPaused = false;
            // Update buttons after a short delay to ensure state is updated
            setTimeout(() => {
                updateTTSButtons();
            }, 50);
            console.log('TTS resumed from playTTS, isPaused:', isPaused);
            return;
        } catch (e) {
            console.error('Resume error:', e);
            // If resume fails, restart from beginning
            isPaused = false;
            stopTTS();
            setTimeout(() => {
                playTTS();
            }, 100);
            return;
        }
    }
    
    // If already speaking and not paused, do nothing
    if (isCurrentlySpeaking && !isCurrentlyPaused) {
        console.log('Already speaking, doing nothing');
        return;
    }
    
    // Stop any current speech before starting new
    if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        isPaused = false;
    }
    
    // Get current language
    const lang = currentLang || 'ko';
    currentTTSLang = lang;
    
    // Get text content based on current language
    let text = '';
    const paragraphs = aboutTextContent.querySelectorAll('p');
    paragraphs.forEach(p => {
        const langText = p.getAttribute(`data-${lang}`);
        if (langText) {
            text += langText + ' ';
        } else {
            // Fallback to visible text if data attribute not found
            text += (p.innerText || p.textContent) + ' ';
        }
    });
    text = text.trim();
    
    if (!text) return;
    
    // Store current text for potential restart
    currentTTSText = text;
    
    // Function to speak with voice selection
    function speakWithVoice() {
        // Create utterance
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Set language based on current language mode
        if (lang === 'ko') {
            currentUtterance.lang = 'ko-KR';
        } else {
            currentUtterance.lang = 'en-US';
        }
        
        currentUtterance.rate = ttsSpeed;
        // Set lower pitch for male voice (0.8 to 1.2 range, 1.0 is default)
        // For Korean, use much lower pitch (0.5) to ensure more masculine sound
        currentUtterance.pitch = lang === 'ko' ? 0.5 : 0.9; // Very low pitch for Korean male voice
        currentUtterance.volume = 1.0;
        
        // Get male voice
        const maleVoice = getMaleVoice(lang);
        if (maleVoice) {
            currentUtterance.voice = maleVoice;
            console.log('🎤 Using voice:', maleVoice.name, 'Language:', maleVoice.lang, 'Pitch:', currentUtterance.pitch);
        } else {
            console.warn('No male voice found for language:', lang);
            // Log all available Korean voices for debugging
            if (lang === 'ko') {
                const allKoVoices = speechSynthesis.getVoices().filter(v => v.lang.includes('ko') || v.lang.includes('KR'));
                console.log('All available Korean voices:', allKoVoices.map(v => ({ name: v.name, lang: v.lang })));
            }
            // Even if no specific male voice found, keep the lower pitch setting
        }
        
        // Event handlers
        currentUtterance.onstart = function() {
            isPaused = false;
            ttsCharIndex = 0; // Reset character index on start
            setTimeout(() => {
                updateTTSButtons();
            }, 50);
        };
        
        // Track character position during playback
        currentUtterance.onboundary = function(event) {
            if (event.name === 'word' || event.name === 'sentence') {
                ttsCharIndex = event.charIndex;
            }
        };
        
        currentUtterance.onend = function() {
            isPaused = false;
            currentUtterance = null;
            currentTTSText = ''; // Clear stored text when finished
            ttsCharIndex = 0; // Reset character index
            setTimeout(() => {
                updateTTSButtons();
            }, 50);
        };
        
        currentUtterance.onerror = function(event) {
            // Ignore 'interrupted' error - it's normal when cancelling speech for speed change
            if (event.error !== 'interrupted') {
                console.error('TTS Error:', event.error);
                isPaused = false;
                currentUtterance = null;
                currentTTSText = ''; // Clear stored text on error
                ttsCharIndex = 0; // Reset character index
                setTimeout(() => {
                    updateTTSButtons();
                }, 50);
            }
        };
        
        // Reset state before speaking
        isPaused = false;
        
        // Speak
        speechSynthesis.speak(currentUtterance);
        
        // Update buttons after a short delay to ensure state is set
        setTimeout(() => {
            updateTTSButtons();
        }, 100);
    }
    
    // Check if voices are loaded
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        speakWithVoice();
    } else {
        // Wait for voices to load
        const voicesChangedHandler = function() {
            speakWithVoice();
            speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
        };
        speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
    }
}

// Function to restart TTS with stored text and new speed
function restartTTSWithCurrentText() {
    if (!speechSynthesis || !currentTTSText) {
        console.warn('Cannot restart TTS: speechSynthesis or currentTTSText is missing');
        return;
    }
    
    const lang = currentTTSLang || 'ko';
    
    // Get remaining text from current position
    const remainingText = currentTTSText.substring(ttsCharIndex);
    const charOffset = ttsCharIndex; // Store offset for boundary tracking
    
    if (!remainingText || remainingText.trim().length === 0) {
        // If we've reached the end, just stop
        stopTTS();
        return;
    }
    
    // Cancel any current speech immediately
    if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
    }
    
    // Reset state
    isPaused = false;
    currentUtterance = null;
    
    // Function to speak with voice selection
    function speakWithVoiceRestart() {
        // Create utterance with remaining text
        currentUtterance = new SpeechSynthesisUtterance(remainingText);
        
        // Set language
        if (lang === 'ko') {
            currentUtterance.lang = 'ko-KR';
        } else {
            currentUtterance.lang = 'en-US';
        }
        
        currentUtterance.rate = ttsSpeed; // Use updated speed
        currentUtterance.pitch = lang === 'ko' ? 0.5 : 0.9; // Very low pitch for Korean male voice
        currentUtterance.volume = 1.0;
        
        // Get male voice
        const maleVoice = getMaleVoice(lang);
        if (maleVoice) {
            currentUtterance.voice = maleVoice;
            console.log('🎤 Restarting TTS with new speed:', ttsSpeed, 'Voice:', maleVoice.name, 'Pitch:', currentUtterance.pitch);
        }
        
        // Event handlers
        currentUtterance.onstart = function() {
            isPaused = false;
            // Keep the current character index (don't reset)
            console.log('✅ TTS restarted successfully from position:', charOffset, 'remaining text length:', remainingText.length);
            setTimeout(() => {
                updateTTSButtons();
            }, 50);
        };
        
        // Track character position during playback (adjust for offset)
        currentUtterance.onboundary = function(event) {
            if (event.name === 'word' || event.name === 'sentence') {
                // event.charIndex is relative to current utterance, so add offset
                ttsCharIndex = charOffset + event.charIndex;
            }
        };
        
        currentUtterance.onend = function() {
            isPaused = false;
            currentUtterance = null;
            currentTTSText = '';
            ttsCharIndex = 0; // Reset character index
            setTimeout(() => {
                updateTTSButtons();
            }, 50);
        };
        
        currentUtterance.onerror = function(event) {
            // Ignore 'interrupted' error - it's normal when cancelling speech for speed change
            if (event.error !== 'interrupted') {
                console.error('TTS Error:', event.error);
                isPaused = false;
                currentUtterance = null;
                currentTTSText = '';
                ttsCharIndex = 0; // Reset character index
                setTimeout(() => {
                    updateTTSButtons();
                }, 50);
            }
        };
        
        // Reset state before speaking
        isPaused = false;
        
        // Speak immediately
        try {
            speechSynthesis.speak(currentUtterance);
            // Update buttons immediately
            setTimeout(() => {
                updateTTSButtons();
            }, 100);
        } catch (error) {
            console.error('Error speaking:', error);
            updateTTSButtons();
        }
    }
    
    // Check if voices are loaded
    const availableVoices = speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
        // Small delay to ensure cancellation is complete
        setTimeout(() => {
            speakWithVoiceRestart();
        }, 50);
    } else {
        // Wait for voices to load
        const voicesChangedHandler = function() {
            setTimeout(() => {
                speakWithVoiceRestart();
            }, 50);
            speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
        };
        speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
    }
}

function pauseTTS() {
    if (!speechSynthesis) return;
    
    // Check actual paused state from speechSynthesis
    const actuallyPaused = speechSynthesis.paused === true;
    const isCurrentlyPaused = isPaused || actuallyPaused;
    const isCurrentlySpeaking = speechSynthesis.speaking || speechSynthesis.pending;
    
    console.log('pauseTTS called - isPaused:', isPaused, 'actuallyPaused:', actuallyPaused, 'isCurrentlySpeaking:', isCurrentlySpeaking);
    
    // If paused, resume
    if (isCurrentlyPaused && isCurrentlySpeaking && currentUtterance) {
        try {
            console.log('Resuming TTS from pauseTTS...');
            speechSynthesis.resume();
            isPaused = false;
            // Update buttons after a short delay
            setTimeout(() => {
                updateTTSButtons();
            }, 50);
            console.log('TTS resumed from pauseTTS, isPaused:', isPaused);
            return;
        } catch (e) {
            console.error('Resume error:', e);
            // If resume fails, restart from beginning
            isPaused = false;
            stopTTS();
            setTimeout(() => {
                playTTS();
            }, 100);
            return;
        }
    }
    
    // If speaking and not paused, pause
    if (isCurrentlySpeaking && !isCurrentlyPaused) {
        try {
            console.log('Pausing TTS...');
            speechSynthesis.pause();
            isPaused = true;
            // Update buttons after a short delay
            setTimeout(() => {
                updateTTSButtons();
            }, 50);
            console.log('TTS paused, isPaused:', isPaused, 'speaking:', speechSynthesis.speaking, 'paused:', speechSynthesis.paused);
        } catch (e) {
            console.error('Pause error:', e);
        }
    } else if (!isCurrentlySpeaking) {
        // If not speaking, reset state
        isPaused = false;
        updateTTSButtons();
    }
}

function stopTTS() {
    if (speechSynthesis.speaking || isPaused || speechSynthesis.pending) {
        speechSynthesis.cancel();
        isPaused = false;
        currentUtterance = null;
        currentTTSText = ''; // Clear stored text when stopped
        ttsCharIndex = 0; // Reset character index
        updateTTSButtons();
    }
}

function updateTTSButtons() {
    const playBtn = document.getElementById('ttsPlayBtn');
    const pauseBtn = document.getElementById('ttsPauseBtn');
    const stopBtn = document.getElementById('ttsStopBtn');
    
    if (!speechSynthesis) {
        // No speech synthesis - show play button only
        if (playBtn) playBtn.style.display = 'flex';
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'none';
        return;
    }
    
    // Check actual state from speechSynthesis API
    const actuallyPaused = speechSynthesis.paused === true;
    const isActuallyPaused = isPaused || actuallyPaused;
    const isActuallySpeaking = speechSynthesis.speaking || speechSynthesis.pending;
    
    console.log('updateTTSButtons - isPaused:', isPaused, 'actuallyPaused:', actuallyPaused, 'isActuallySpeaking:', isActuallySpeaking, 'hasUtterance:', !!currentUtterance);
    
    // Priority 1: If paused (but utterance exists), show play button to resume
    if (isActuallyPaused && (isActuallySpeaking || currentUtterance)) {
        if (playBtn) {
            playBtn.style.display = 'flex';
            // Update button text from span element
            const playSpan = playBtn.querySelector('.tts-button-text');
            if (playSpan) {
                const playTextKo = playSpan.getAttribute('data-ko') || '재생';
                const playTextEn = playSpan.getAttribute('data-en') || 'Play';
                playSpan.textContent = currentLang === 'ko' ? playTextKo : playTextEn;
            }
        }
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'flex';
        console.log('Buttons updated: Paused state - showing play button for resume');
        return;
    }
    
    // Priority 2: If playing (not paused), show pause button
    if (isActuallySpeaking && !isActuallyPaused) {
        if (playBtn) playBtn.style.display = 'none';
        if (pauseBtn) {
            pauseBtn.style.display = 'flex';
            // Update button text from span element
            const pauseSpan = pauseBtn.querySelector('.tts-button-text');
            if (pauseSpan) {
                const pauseTextKo = pauseSpan.getAttribute('data-ko') || '일시정지';
                const pauseTextEn = pauseSpan.getAttribute('data-en') || 'Pause';
                pauseSpan.textContent = currentLang === 'ko' ? pauseTextKo : pauseTextEn;
            }
        }
        if (stopBtn) stopBtn.style.display = 'flex';
        console.log('Buttons updated: Playing state - showing pause button');
        return;
    }
    
    // Priority 3: Not playing - show play button only
    if (playBtn) {
        playBtn.style.display = 'flex';
        // Update button text from span element
        const playSpan = playBtn.querySelector('.tts-button-text');
        if (playSpan) {
            const playTextKo = playSpan.getAttribute('data-ko') || '재생';
            const playTextEn = playSpan.getAttribute('data-en') || 'Play';
            playSpan.textContent = currentLang === 'ko' ? playTextKo : playTextEn;
        }
    }
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'none';
    console.log('Buttons updated: Stopped state - showing play button only');
}

// Load voices when available
if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
}

// Add active class to current navigation link
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});
