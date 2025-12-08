/**
 * Portfolio Website JavaScript
 */

// Language Management
let currentLang = localStorage.getItem('language') || 'ko';

function switchLanguage(lang) {
    // Stop TTS if speaking
    if (speechSynthesis && (speechSynthesis.speaking || isPaused)) {
        stopTTS();
    }
    
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update all elements with data-ko and data-en attributes
    document.querySelectorAll('[data-ko][data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    
    // Update language button
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.querySelector('.lang-text').textContent = lang === 'ko' ? 'EN' : 'KO';
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Stop TTS if speaking when language changes
    if (speechSynthesis && (speechSynthesis.speaking || isPaused)) {
        stopTTS();
    }
    
    // Update TTS button texts
    const playBtn = document.getElementById('ttsPlayBtn');
    const pauseBtn = document.getElementById('ttsPauseBtn');
    const stopBtn = document.getElementById('ttsStopBtn');
    const speedLabel = document.querySelector('.tts-speed-label');
    
    if (playBtn) {
        const playText = playBtn.querySelector('.tts-button-text');
        if (playText) {
            playText.textContent = playText.getAttribute(`data-${lang}`) || playText.textContent;
        }
    }
    if (pauseBtn) {
        const pauseText = pauseBtn.querySelector('.tts-button-text');
        if (pauseText) {
            pauseText.textContent = pauseText.getAttribute(`data-${lang}`) || pauseText.textContent;
        }
    }
    if (stopBtn) {
        const stopText = stopBtn.querySelector('.tts-button-text');
        if (stopText) {
            stopText.textContent = stopText.getAttribute(`data-${lang}`) || stopText.textContent;
        }
    }
    if (speedLabel) {
        speedLabel.textContent = speedLabel.getAttribute(`data-${lang}`) || speedLabel.textContent;
    }
}

// Navigation toggle for mobile
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    switchLanguage(currentLang);
    
    // Initialize TTS
    initTTS();
    
    // Language switcher button
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', function() {
            const newLang = currentLang === 'ko' ? 'en' : 'ko';
            switchLanguage(newLang);
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
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    });

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
                
                // Check if this is Miracle Reading System project
                const isMiracleReading = title === '미라클 리딩 시스템';
                
                if (isMiracleReading) {
                    // Change title to "프로젝트 상세"
                    if (reviewTitleEl) {
                        reviewTitleEl.textContent = '프로젝트 상세';
                    }
                    
                    // Get portfolio content from review data
                    const reviewDataEl = projectData ? projectData.querySelector('[data-field="review"]') : null;
                    if (reviewDataEl && reviewDataEl.getAttribute('data-type') === 'portfolio') {
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
                    modalReviewEl.textContent = review || '프로젝트 후기 정보가 없습니다.';
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
    
    // Show/hide scroll top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Smooth scroll to top when button is clicked
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
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
                const offsetTop = targetSection.offsetTop - 80;
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
            speedSlider.addEventListener('input', function() {
                ttsSpeed = parseFloat(this.value);
                speedValue.textContent = ttsSpeed.toFixed(1) + 'x';
                
                // Update current utterance speed if speaking
                if (currentUtterance && speechSynthesis.speaking && !isPaused) {
                    // Note: Rate cannot be changed while speaking, need to restart
                    // For better UX, we'll update it for next utterance
                    if (currentUtterance) {
                        currentUtterance.rate = ttsSpeed;
                    }
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
    
    // Try to find male voice (usually lower pitch or specific name patterns)
    const maleVoice = langVoices.find(voice => {
        const name = voice.name.toLowerCase();
        // English male voices
        if (lang === 'en') {
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
        }
        // Korean male voices
        else {
            const nameLower = name.toLowerCase();
            
            // First, exclude known female voices explicitly
            const femaleIndicators = ['female', '여성', 'yuna', 'sora', 'nara', 'mina', 'jihyun', 'seoyeon', 'soyoung'];
            for (const indicator of femaleIndicators) {
                if (nameLower.includes(indicator)) {
                    return false;
                }
            }
            
            // Prioritize explicit male indicators
            const maleIndicators = ['male', '남성', 'man', '남자'];
            for (const indicator of maleIndicators) {
                if (nameLower.includes(indicator)) {
                    return true;
                }
            }
            
            // Google Korean voices - check for specific patterns
            if (nameLower.includes('google')) {
                // Google Korean voices: usually "Google 한국어" is male, "Google 한국어 (여성)" is female
                if (nameLower.includes('korean') || nameLower.includes('한국어')) {
                    // If it doesn't explicitly say female, assume male
                    if (!nameLower.includes('female') && !nameLower.includes('여성')) {
                        return true;
                    }
                }
            }
            
            // Microsoft Korean voices
            if (nameLower.includes('microsoft')) {
                if (nameLower.includes('korean') || nameLower.includes('한국어')) {
                    // Microsoft usually has male as default
                    if (!nameLower.includes('female') && !nameLower.includes('여성')) {
                        return true;
                    }
                }
            }
            
            // Samsung Korean voices (often male)
            if (nameLower.includes('samsung')) {
                if (nameLower.includes('korean') || nameLower.includes('한국어')) {
                    return true;
                }
            }
            
            // Exclude if contains any female indicator
            return false;
        }
    });
    
    // If no specific male voice found, try fallback strategies
    if (!maleVoice) {
        if (lang === 'ko') {
            // For Korean: exclude ALL known female voices
            const femaleIndicators = ['female', '여성', 'yuna', 'sora', 'nara', 'mina', 'jihyun', 'seoyeon', 'soyoung'];
            const nonFemaleVoices = langVoices.filter(voice => {
                const name = voice.name.toLowerCase();
                // Check if voice name contains any female indicator
                for (const indicator of femaleIndicators) {
                    if (name.includes(indicator)) {
                        return false;
                    }
                }
                return true;
            });
            
            console.log('Korean voices filtered:', {
                total: langVoices.length,
                nonFemale: nonFemaleVoices.length,
                voices: nonFemaleVoices.map(v => v.name)
            });
            
            if (nonFemaleVoices.length > 0) {
                // Priority order: Google > Microsoft > Samsung > Others
                const preferred = nonFemaleVoices.find(voice => {
                    const name = voice.name.toLowerCase();
                    return (name.includes('google') && (name.includes('korean') || name.includes('한국어'))) ||
                           (name.includes('microsoft') && (name.includes('korean') || name.includes('한국어'))) ||
                           (name.includes('samsung') && (name.includes('korean') || name.includes('한국어')));
                });
                
                const selected = preferred || nonFemaleVoices[0];
                console.log('Selected Korean voice (fallback):', selected.name);
                return selected;
            } else {
                console.warn('No non-female Korean voices found, using first available');
            }
        }
        
        // Fallback: use first available voice
        return langVoices[0];
    }
    
    return maleVoice;
}

function playTTS() {
    const aboutTextContent = document.getElementById('aboutTextContent');
    const playBtn = document.getElementById('ttsPlayBtn');
    const pauseBtn = document.getElementById('ttsPauseBtn');
    const stopBtn = document.getElementById('ttsStopBtn');
    
    if (!speechSynthesis || !aboutTextContent) return;
    
    // Check if currently paused
    const actuallyPaused = speechSynthesis.paused === true;
    const isCurrentlyPaused = isPaused || actuallyPaused;
    const isCurrentlySpeaking = speechSynthesis.speaking || speechSynthesis.pending;
    
    console.log('playTTS called - isPaused:', isPaused, 'actuallyPaused:', actuallyPaused, 'isCurrentlySpeaking:', isCurrentlySpeaking);
    
    // If paused, resume
    if (isCurrentlyPaused && isCurrentlySpeaking) {
        try {
            console.log('Attempting to resume TTS...');
            speechSynthesis.resume();
            isPaused = false;
            // Update buttons immediately
            updateTTSButtons(true);
            console.log('TTS resumed from playTTS, isPaused:', isPaused);
        } catch (e) {
            console.error('Resume error:', e);
            // If resume fails, restart from beginning
            isPaused = false;
            stopTTS();
            setTimeout(() => {
                playTTS();
            }, 100);
        }
        return;
    }
    
    // If already speaking and not paused, do nothing
    if (isCurrentlySpeaking && !isCurrentlyPaused) {
        console.log('Already speaking, doing nothing');
        return;
    }
    
    // Get current language
    const lang = currentLang || 'ko';
    
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
        // For Korean, use much lower pitch (0.75-0.8) to ensure more masculine sound
        currentUtterance.pitch = lang === 'ko' ? 0.75 : 0.9; // Much lower pitch for Korean male voice
        currentUtterance.volume = 1.0;
        
        // Get male voice
        const maleVoice = getMaleVoice(lang);
        if (maleVoice) {
            currentUtterance.voice = maleVoice;
            console.log('Using voice:', maleVoice.name, 'Language:', maleVoice.lang, 'Pitch:', currentUtterance.pitch);
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
            updateTTSButtons(true);
        };
        
        currentUtterance.onend = function() {
            isPaused = false;
            updateTTSButtons(false);
        };
        
        currentUtterance.onerror = function(event) {
            console.error('TTS Error:', event.error);
            isPaused = false;
            updateTTSButtons(false);
        };
        
        // Speak
        speechSynthesis.speak(currentUtterance);
        updateTTSButtons(true);
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

function pauseTTS() {
    if (!speechSynthesis) return;
    
    // Check actual paused state from speechSynthesis
    const actuallyPaused = speechSynthesis.paused !== undefined ? speechSynthesis.paused : isPaused;
    
    // If paused, resume
    if ((isPaused || actuallyPaused) && (speechSynthesis.speaking || speechSynthesis.pending)) {
        try {
            speechSynthesis.resume();
            isPaused = false;
            // Immediately update buttons
            updateTTSButtons(true);
            console.log('TTS resumed from pauseTTS, isPaused:', isPaused);
        } catch (e) {
            console.error('Resume error:', e);
            // If resume fails, restart from beginning
            isPaused = false;
            stopTTS();
            setTimeout(() => {
                playTTS();
            }, 100);
        }
        return;
    }
    
    // If speaking and not paused, pause
    if ((speechSynthesis.speaking || speechSynthesis.pending) && !isPaused && !actuallyPaused) {
        try {
            speechSynthesis.pause();
            isPaused = true;
            // Force update buttons after a tiny delay to ensure state is set
            setTimeout(() => {
                updateTTSButtons(true);
            }, 10);
            console.log('TTS paused, isPaused:', isPaused, 'speaking:', speechSynthesis.speaking, 'paused:', speechSynthesis.paused);
        } catch (e) {
            console.error('Pause error:', e);
        }
    } else if (isPaused && !speechSynthesis.speaking && !speechSynthesis.pending) {
        // If marked as paused but not actually speaking, reset state
        isPaused = false;
        updateTTSButtons(false);
    }
}

function stopTTS() {
    if (speechSynthesis.speaking || isPaused) {
        speechSynthesis.cancel();
        isPaused = false;
        currentUtterance = null;
        updateTTSButtons(false);
    }
}

function updateTTSButtons(isPlaying) {
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
    
    // Check actual paused state from speechSynthesis API
    const actuallyPaused = speechSynthesis.paused === true;
    const isActuallyPaused = isPaused || actuallyPaused;
    const isActuallySpeaking = speechSynthesis.speaking || speechSynthesis.pending;
    
    console.log('updateTTSButtons - isPlaying:', isPlaying, 'isPaused:', isPaused, 'actuallyPaused:', actuallyPaused, 'isActuallySpeaking:', isActuallySpeaking);
    
    // Priority 1: If paused (but utterance exists), show play button to resume
    if (isActuallyPaused && isActuallySpeaking) {
        if (playBtn) playBtn.style.display = 'flex';
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'flex';
        console.log('Buttons updated: Paused state - showing play button for resume');
        return;
    }
    
    // Priority 2: If playing (not paused), show pause button
    if (isActuallySpeaking && !isActuallyPaused) {
        if (playBtn) playBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'flex';
        if (stopBtn) stopBtn.style.display = 'flex';
        console.log('Buttons updated: Playing state - showing pause button');
        return;
    }
    
    // Priority 3: Not playing - show play button only
    if (playBtn) playBtn.style.display = 'flex';
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
