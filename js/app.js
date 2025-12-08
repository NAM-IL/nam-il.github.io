/**
 * Portfolio Website JavaScript
 */

// Language Management
let currentLang = localStorage.getItem('language') || 'ko';

function switchLanguage(lang) {
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
}

// Navigation toggle for mobile
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    switchLanguage(currentLang);
    
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
            const projectContent = projectCard.querySelector('.project-content');
            
            // Extract project information
            const title = projectContent.querySelector('.project-title').textContent;
            const client = projectContent.querySelector('.detail-row .detail-value').textContent;
            const period = projectContent.querySelectorAll('.detail-row .detail-value')[1]?.textContent || '';
            const environment = projectContent.querySelectorAll('.detail-row .detail-value')[2]?.textContent || '';
            
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
            }
            
            // Get tags
            const tags = [];
            const tagElements = projectContent.querySelectorAll('.project-tags .tag');
            tagElements.forEach(tag => {
                tags.push(tag.textContent.trim());
            });
            
            // Populate modal
            document.getElementById('modalProjectTitle').textContent = title;
            document.getElementById('modalClient').textContent = client;
            document.getElementById('modalPeriod').textContent = period;
            document.getElementById('modalEnvironment').textContent = environment;
            document.getElementById('modalIntroduction').textContent = introduction;
            
            // Format role
            const roleContainer = document.getElementById('modalRole');
            if (role.includes('|')) {
                roleContainer.innerHTML = '<ul class="modal-role-list">' + 
                    role.split('|').map(r => '<li>' + r + '</li>').join('') + 
                    '</ul>';
            } else {
                roleContainer.textContent = role;
            }
            
            document.getElementById('modalReview').textContent = review || '프로젝트 후기 정보가 없습니다.';
            
            // Show/hide sections based on content
            const introSection = document.querySelector('.modal-section:has(#modalIntroduction)');
            const roleSection = document.querySelector('.modal-section:has(#modalRole)');
            const reviewSection = document.querySelector('.modal-section:has(#modalReview)');
            
            if (introduction) {
                document.getElementById('modalIntroduction').parentElement.parentElement.style.display = 'block';
            } else {
                document.getElementById('modalIntroduction').parentElement.parentElement.style.display = 'none';
            }
            
            if (role) {
                document.getElementById('modalRole').parentElement.parentElement.style.display = 'block';
            } else {
                document.getElementById('modalRole').parentElement.parentElement.style.display = 'none';
            }
            
            if (review) {
                document.getElementById('modalReview').parentElement.parentElement.style.display = 'block';
            } else {
                document.getElementById('modalReview').parentElement.parentElement.style.display = 'none';
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
