/**
 * Portfolio Website JavaScript
 */

// Language Management
let currentLang = localStorage.getItem('language') || 'ko';

function switchLanguage(lang) {
    // Prevent multiple simultaneous language switches
    if (switchLanguage.isSwitching) {
        return;
    }
    switchLanguage.isSwitching = true;
    
    // CRITICAL: Always reset flag after 100ms (safety net)
    setTimeout(() => {
        switchLanguage.isSwitching = false;
    }, 100);
    
    // Update language state immediately (non-blocking, critical)
    currentLang = lang;
    try {
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
    } catch (e) {
        // Ignore
    }
    
    // Update language button immediately (critical UI feedback)
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
    
    // Stop TTS if speaking (non-blocking)
    try {
        if (typeof speechSynthesis !== 'undefined' && speechSynthesis && typeof isPaused !== 'undefined' && (speechSynthesis.speaking || isPaused)) {
            if (typeof stopTTS === 'function') {
                stopTTS();
            }
        }
    } catch (e) {
        // Ignore
    }
    
    // Update elements - DISABLED to prevent freezing
    // Only update critical TTS and visitor labels
    setTimeout(() => {
        try {
            updateTTSLabels(lang);
            updateVisitorLabel(lang);
        } catch (e) {
            // Ignore
        } finally {
            switchLanguage.isSwitching = false;
        }
    }, 50);
    
    // NOTE: General element updates are disabled to prevent page freezing
    // Only critical UI elements (TTS labels, visitor label) are updated
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

// Skill tooltip descriptions
const skillTooltips = {
    'Java': '객체지향 프로그래밍 언어, 엔터프라이즈 애플리케이션 개발',
    'Spring Framework': 'Java 기반 엔터프라이즈 애플리케이션 개발 프레임워크',
    'Spring Boot': 'Spring Framework 기반 빠른 애플리케이션 개발 도구',
    'Spring AI': 'Spring 기반 AI 통합 프레임워크, LLM 연동',
    'JSP/Servlet': 'Java 웹 애플리케이션 개발 기술',
    'MyBatis': 'Java 영속성 프레임워크, SQL 매퍼',
    'Python': '고수준 프로그래밍 언어, 데이터 분석 및 웹 개발',
    'HTML5/CSS3': '웹 표준 마크업 및 스타일링 언어',
    'Bootstrap': '반응형 웹 디자인 CSS 프레임워크',
    'JavaScript/jQuery': '웹 클라이언트 사이드 스크립팅 및 DOM 조작',
    'Flutter/Dart': '크로스 플랫폼 모바일 앱 개발 프레임워크',
    'Android/Java & Kotlin': '안드로이드 네이티브 앱 개발',
    'iOS/Swift & SwiftUI': 'iOS 네이티브 앱 개발, SwiftUI 프레임워크',
    'Oracle': '관계형 데이터베이스 관리 시스템',
    'Git/GitHub & GitLab & Bitbucket': '버전 관리 시스템 및 협업 플랫폼',
    'CI/CD (Jenkins)': '지속적 통합 및 배포 자동화 도구',
    'Docker': '컨테이너 기반 가상화 플랫폼',
    'Figma': 'UI/UX 디자인 및 프로토타이핑 도구'
};

// Initialize skill tooltips
function initSkillTooltips() {
    const skillNames = document.querySelectorAll('.skill-name');
    skillNames.forEach(skillName => {
        const skillText = skillName.textContent.trim();
        const tooltip = skillTooltips[skillText];
        if (tooltip) {
            skillName.setAttribute('data-tooltip', tooltip);
        }
    });
}

// Visitor Count Management
function initVisitorCount() {
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
    
    // Update visitor label on language change
    const visitorLabel = document.querySelector('.visitor-label');
    if (visitorLabel) {
        const updateLabel = () => {
            const label = visitorLabel.getAttribute(`data-${currentLang}`) || visitorLabel.textContent;
            visitorLabel.textContent = label;
        };
        updateLabel();
        
        // Observe language changes
        const observer = new MutationObserver(updateLabel);
        observer.observe(visitorLabel, { childList: true, attributes: true });
    }
}

// Navigation toggle for mobile
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    switchLanguage(currentLang);
    
    // Initialize TTS
    initTTS();
    
    // Initialize skill tooltips
    initSkillTooltips();
    
    // Initialize visitor count
    initVisitorCount();
    
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
    
    // Language switcher button
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            try {
                const newLang = currentLang === 'ko' ? 'en' : 'ko';
                switchLanguage(newLang);
            } catch (error) {
                console.error('Error switching language:', error);
            }
        });
    }
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
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

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Animate stats on scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateValue(entry.target, 0, parseInt(entry.target.textContent), 2000);
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });

    // Add fade-in animation to sections on scroll
    const sections = document.querySelectorAll('.section');
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
            
            // Get data from hidden project-data div
            const projectData = projectContent.querySelector('.project-data');
            let introduction = '';
            let role = '';
            let review = '';
            
            if (projectData) {
                const introEl = projectData.querySelector('[data-field="introduction"]');
                const roleEl = projectData.querySelector('[data-field="role"]');
                const reviewEl = projectData.querySelector('[data-field="review"]');
                
                if (introEl) introduction = introEl.textContent.trim();
                if (roleEl) role = roleEl.textContent.trim();
                if (reviewEl) review = reviewEl.textContent.trim();
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
                
                // Check if this is Miracle Reading System project
                const isMiracleReading = title === '미라클 리딩 시스템';
                
                if (isMiracleReading) {
                    // Change title to "프로젝트 상세"
                    if (reviewTitleEl) {
                        reviewTitleEl.textContent = '프로젝트 상세';
                    }
                    
                    // Get portfolio content from review data
                    if (isPortfolioType) {
                        // Set innerHTML to preserve HTML structure
                        modalReviewEl.innerHTML = reviewDataEl.innerHTML;
                    } else {
                        modalReviewEl.innerHTML = '<p>프로젝트 상세 정보가 없습니다.</p>';
                    }
                } else {
                    // Keep original title for other projects
                    if (reviewTitleEl) {
                        reviewTitleEl.textContent = '프로젝트 후기';
                    }
                    
                    // Check if portfolio type (like Productivity Hub)
                    if (isPortfolioType) {
                        // Set innerHTML to preserve HTML structure
                        modalReviewEl.innerHTML = reviewDataEl.innerHTML;
                    } else {
                        // Use text content for simple text reviews
                        modalReviewEl.textContent = review || '프로젝트 후기 정보가 없습니다.';
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
    if (scrollTopBtn) {
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
});

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
}

function getMaleVoice(lang) {
    const voices = speechSynthesis.getVoices();
    const langVoices = voices.filter(voice => {
        if (lang === 'ko') {
            return voice.lang.includes('ko') || voice.lang.includes('KR');
        } else {
            return voice.lang.includes('en') || voice.lang.includes('US') || voice.lang.includes('GB');
        }
    });
    
    if (langVoices.length === 0) return null;
    
    // For Korean: STRICT filtering - exclude ALL known female voices
    if (lang === 'ko') {
        const femaleIndicators = [
            'female', '여성', 'yuna', 'sora', 'nara', 'mina', 'jihyun', 'seoyeon', 'soyoung',
            'yeona', 'hyeri', 'jiyeon', 'eunji', 'sohee', 'jisoo', 'jennie', 'rose', 'lisa',
            '아름', '수진', '지은', '미나', '소영', '지현', '서연', '유나', '소라', '나라',
            '은지', '소희', '지수', '제니', '로즈', '리사', '혜리', '지연', '예나',
            'female voice', '여성 음성', 'woman', '여자', 'girl', '소녀'
        ];
        
        // Helper function to check if voice is female
        function isFemaleVoice(voiceName) {
            const name = voiceName.toLowerCase();
            for (const indicator of femaleIndicators) {
                if (name.includes(indicator.toLowerCase())) {
                    return true;
                }
            }
            return false;
        }
        
        // First pass: Find voices with explicit male indicators
        const explicitMaleVoices = langVoices.filter(voice => {
            const name = voice.name.toLowerCase();
            const maleIndicators = ['male', '남성', 'man', '남자', 'male voice', '남성 음성', '남자 음성'];
            return maleIndicators.some(indicator => name.includes(indicator)) && !isFemaleVoice(voice.name);
        });
        
        if (explicitMaleVoices.length > 0) {
            // Prefer Google/Microsoft/Samsung male voices
            const preferred = explicitMaleVoices.find(voice => {
                const name = voice.name.toLowerCase();
                return (name.includes('google') || name.includes('microsoft') || name.includes('samsung'));
            });
            const selected = preferred || explicitMaleVoices[0];
            console.log('✅ Selected explicit male Korean voice:', selected.name, 'Lang:', selected.lang);
            return selected;
        }
        
        // Second pass: Exclude ALL known female voices - STRICT filtering
        const nonFemaleVoices = langVoices.filter(voice => {
            // Exclude if contains ANY female indicator
            if (isFemaleVoice(voice.name)) {
                return false;
            }
            // Additional check: exclude if name suggests female (contains common female name patterns)
            const name = voice.name.toLowerCase();
            // Exclude voices with common female name endings or patterns
            if (name.match(/[가-힣]*[영|은|지|나|라|나|미|희|연|수]$/)) {
                // Korean female name endings
                return false;
            }
            return true;
        });
        
        console.log('Korean voices filtered:', {
            total: langVoices.length,
            nonFemale: nonFemaleVoices.length,
            allVoices: langVoices.map(v => ({ name: v.name, lang: v.lang })),
            filteredVoices: nonFemaleVoices.map(v => ({ name: v.name, lang: v.lang }))
        });
        
        if (nonFemaleVoices.length > 0) {
            // Priority order: Google > Microsoft > Samsung > Others
            // But ONLY if they don't contain female indicators
            const preferred = nonFemaleVoices.find(voice => {
                const name = voice.name.toLowerCase();
                const isPreferred = (name.includes('google') || name.includes('microsoft') || name.includes('samsung'));
                if (isPreferred) {
                    // Triple check: make absolutely sure it's not a female voice
                    return !isFemaleVoice(voice.name);
                }
                return false;
            });
            
            const selected = preferred || nonFemaleVoices[0];
            console.log('✅ Selected Korean voice (filtered):', selected.name, 'Lang:', selected.lang);
            return selected;
        } else {
            console.warn('⚠️ No non-female Korean voices found after filtering');
            // Last resort: try to find any voice that might be male based on name patterns
            // But still exclude known female patterns
            const fallback = langVoices.find(voice => {
                const name = voice.name.toLowerCase();
                // Look for patterns that might indicate male (default voices are often male)
                const mightBeMale = (name.includes('default') || name.includes('standard') || 
                       (name.includes('google') && !name.includes('female')) ||
                       (name.includes('microsoft') && !name.includes('female')));
                return mightBeMale && !isFemaleVoice(voice.name);
            });
            if (fallback) {
                console.log('⚠️ Using fallback Korean voice:', fallback.name);
                return fallback;
            }
            // Absolute last resort: return first voice but log warning
            console.error('❌ Could not find suitable male Korean voice, using first available:', langVoices[0]?.name);
            return langVoices[0];
        }
    }
    
    // English male voices
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
    
    // Final fallback: use first available voice
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
        // For Korean, use much lower pitch (0.65) to ensure more masculine sound
        currentUtterance.pitch = lang === 'ko' ? 0.65 : 0.9; // Very low pitch for Korean male voice
        currentUtterance.volume = 1.0;
        
        // Get male voice
        const maleVoice = getMaleVoice(lang);
        if (maleVoice) {
            currentUtterance.voice = maleVoice;
            console.log('🎤 Using voice:', maleVoice.name, 'Language:', maleVoice.lang, 'Pitch:', currentUtterance.pitch);
            
            // Additional validation for Korean: double-check it's not a female voice
            if (lang === 'ko') {
                const voiceName = maleVoice.name.toLowerCase();
                const femaleCheck = ['female', '여성', 'yuna', 'sora', 'nara', 'mina', 'jihyun', 'seoyeon', 'soyoung'].some(ind => voiceName.includes(ind));
                if (femaleCheck) {
                    console.warn('⚠️ WARNING: Selected voice might be female:', maleVoice.name);
                    // Lower pitch even more if female voice detected
                    currentUtterance.pitch = 0.6;
                    console.log('🔧 Adjusted pitch to 0.6 to compensate');
                }
            }
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
        currentUtterance.pitch = lang === 'ko' ? 0.65 : 0.9; // Very low pitch for Korean male voice
        currentUtterance.volume = 1.0;
        
        // Get male voice
        const maleVoice = getMaleVoice(lang);
        if (maleVoice) {
            currentUtterance.voice = maleVoice;
            console.log('🎤 Restarting TTS with new speed:', ttsSpeed, 'Voice:', maleVoice.name, 'Pitch:', currentUtterance.pitch);
            
            // Additional validation for Korean: double-check it's not a female voice
            if (lang === 'ko') {
                const voiceName = maleVoice.name.toLowerCase();
                const femaleCheck = ['female', '여성', 'yuna', 'sora', 'nara', 'mina', 'jihyun', 'seoyeon', 'soyoung'].some(ind => voiceName.includes(ind));
                if (femaleCheck) {
                    console.warn('⚠️ WARNING: Selected voice might be female:', maleVoice.name);
                    // Lower pitch even more if female voice detected
                    currentUtterance.pitch = 0.6;
                    console.log('🔧 Adjusted pitch to 0.6 to compensate');
                }
            }
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
