// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    
    // *** COUNTDOWN DATE CONFIGURATION ***
    // Change this date to test the countdown functionality
    // Format: YYYY-MM-DD HH:MM:SS (24-hour format, IST timezone)
    const EVENT_START_DATE = "2025-08-25 00:00:00"; // August 25, 2025 at midnight IST
    
    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Countdown Timer
    function updateCountdown() {
        // Parse the event date considering IST timezone (UTC+5:30)
        const eventDate = new Date(EVENT_START_DATE.replace(' ', 'T') + '+05:30');
        const countDownDate = eventDate.getTime();
        
        const now = new Date().getTime();
        const distance = countDownDate - now;

        console.log('Current time:', new Date());
        console.log('Event time:', eventDate);
        console.log('Distance:', distance);

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update countdown display
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');

        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            showProblemStatements();
        }
    }

    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately

    // Function to show problem statements when countdown ends
    function showProblemStatements() {
        const comingSoonOverlay = document.getElementById('comingSoonOverlay');
        const problemStatementsGrid = document.getElementById('problemStatementsGrid');
        
        if (comingSoonOverlay && problemStatementsGrid) {
            // Fade out countdown overlay
            comingSoonOverlay.style.opacity = '0';
            comingSoonOverlay.style.transform = 'translateY(-20px)';
            comingSoonOverlay.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                comingSoonOverlay.style.display = 'none';
                problemStatementsGrid.style.display = 'grid';
                problemStatementsGrid.style.opacity = '0';
                problemStatementsGrid.style.transform = 'translateY(20px)';
                
                // Animate in problem statements
                setTimeout(() => {
                    problemStatementsGrid.style.transition = 'all 0.8s ease';
                    problemStatementsGrid.style.opacity = '1';
                    problemStatementsGrid.style.transform = 'translateY(0)';
                    problemStatementsGrid.classList.add('reveal');
                    
                    // Animate individual cards
                    const problemCards = document.querySelectorAll('.problem-card');
                    problemCards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100 + (index * 100));
                    });
                }, 100);
            }, 500);
        }
        
        // Mark event as started in localStorage
        localStorage.setItem('impactIndiaEventStarted', 'true');
        
        // Disable registration link in navigation
        disableRegistrationLink();
    }

    // Check if event has already started
    function checkEventStatus() {
        const eventStarted = localStorage.getItem('impactIndiaEventStarted');
        const eventDate = new Date(EVENT_START_DATE.replace(' ', 'T') + '+05:30');
        const countDownDate = eventDate.getTime();
        const now = new Date().getTime();
        
        console.log('Checking event status - Event date:', eventDate, 'Now:', new Date(), 'Started:', eventStarted);
        
        // Make sure the coming soon overlay is visible
        const comingSoonOverlay = document.getElementById('comingSoonOverlay');
        const problemStatementsGrid = document.getElementById('problemStatementsGrid');
        
        if (comingSoonOverlay && problemStatementsGrid) {
            // Default state - always ensure the correct display values initially
            comingSoonOverlay.style.display = 'block';
            comingSoonOverlay.style.opacity = '1';
            problemStatementsGrid.style.display = 'none';
        }
        
        if (eventStarted === 'true' || now >= countDownDate) {
            showProblemStatements();
        }
    }

    // Check event status on page load
    // IMPORTANT: Reset localStorage for testing if date is in the future
    const eventDate = new Date(EVENT_START_DATE.replace(' ', 'T') + '+05:30');
    const now = new Date();
    if (eventDate > now) {
        // Event hasn't started yet, clear localStorage
        console.log('Event date is in the future, clearing localStorage');
        localStorage.removeItem('impactIndiaEventStarted');
    }
    
    checkEventStatus();
    
    // Function to reset event status for testing (accessible from browser console)
    window.resetEventStatus = function() {
        localStorage.removeItem('impactIndiaEventStarted');
        console.log('Event status reset. Refresh the page to see countdown.');
        return 'Event status cleared. Please refresh the page.';
    };
    
    // Function to trigger event for testing (accessible from browser console)
    window.triggerEvent = function() {
        localStorage.setItem('impactIndiaEventStarted', 'true');
        showProblemStatements();
        return 'Event triggered. Problem statements should now be visible.';
    };

    // Function to disable registration link
    function disableRegistrationLink() {
        const regLinks = document.querySelectorAll('a[href="register.html"]');
        regLinks.forEach(link => {
            link.style.opacity = '0.5';
            link.style.cursor = 'not-allowed';
            link.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Registration is now closed as the event has started. Please view the problem statements!');
                window.location.href = '#problems';
            });
        });
        
        // Disable CTA button in hero
        const ctaButton = document.querySelector('.cta-button.primary');
        if (ctaButton && ctaButton.onclick) {
            ctaButton.onclick = null;
            ctaButton.style.opacity = '0.5';
            ctaButton.style.cursor = 'not-allowed';
            ctaButton.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Registration is now closed as the event has started. Please view the problem statements!');
                document.getElementById('problems').scrollIntoView({behavior: 'smooth'});
            });
        }
    }

    // Check if event has started on page load and disable registration
    if (localStorage.getItem('impactIndiaEventStarted') === 'true') {
        disableRegistrationLink();
    } else {
        const eventDate = new Date(EVENT_START_DATE.replace(' ', 'T') + '+05:30');
        const now = new Date().getTime();
        if (now >= eventDate.getTime()) {
            disableRegistrationLink();
        }
    }

    // Animated progress circles for judging criteria
    function animateProgressCircles() {
        const circles = document.querySelectorAll('.criteria-circle');
        
        circles.forEach(circle => {
            const percentage = parseInt(circle.dataset.percentage);
            const degrees = (percentage / 100) * 360;
            
            // Animate the circle when it comes into view
            const circleObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progress = entry.target.querySelector('.circle-progress');
                        progress.style.background = `conic-gradient(
                            #FF9933 0deg,
                            #FF9933 ${degrees}deg,
                            #e0e0e0 ${degrees}deg,
                            #e0e0e0 360deg
                        )`;
                    }
                });
            });
            
            circleObserver.observe(circle);
        });
    }

    animateProgressCircles();

    // Form submission handling
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(registrationForm);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!data.name || !data.email || !data.phone || !data.category || !data.institution || !data.experience) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[+]?[\d\s-()]{10,}$/;
            if (!phoneRegex.test(data.phone)) {
                alert('Please enter a valid phone number.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = registrationForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Registration successful! You will receive a confirmation email shortly.');
                registrationForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Floating animation for hero icons
    function floatingAnimation() {
        const icons = document.querySelectorAll('.hero-icons i');
        
        icons.forEach((icon, index) => {
            const delay = index * 1000; // Stagger the animations
            icon.style.animationDelay = `${delay}ms`;
        });
    }

    floatingAnimation();

    // Smooth reveal animations for timeline items
    function animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.5 });
        
        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.6s ease';
            timelineObserver.observe(item);
        });
    }

    animateTimeline();

    // Navbar background change on scroll
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    handleNavbarScroll();

    // Parallax effect for hero section
    function parallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-background');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    parallaxEffect();

    // Card hover effects
    function initializeCardEffects() {
        const cards = document.querySelectorAll('.rule-card, .illustration-card, .criteria-card, .prize-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    initializeCardEffects();

    // Typing effect for hero tagline
    function typingEffect() {
        const tagline = document.querySelector('.hero-tagline');
        const text = tagline.textContent;
        tagline.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            tagline.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, 100);
    }

    // Start typing effect after hero animation
    setTimeout(typingEffect, 1000);

    // Social media click handlers (you can replace with actual URLs)
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your social media URLs here
            const socialLinks = {
                'fa-facebook': 'https://facebook.com/impactindiachallenge',
                'fa-twitter': 'https://twitter.com/impactindiachallenge',
                'fa-instagram': 'https://instagram.com/impactindiachallenge',
                'fa-linkedin': 'https://linkedin.com/company/impactindiachallenge',
                'fa-youtube': 'https://youtube.com/impactindiachallenge'
            };
            
            const iconClass = Array.from(this.querySelector('i').classList).find(cls => cls.startsWith('fa-'));
            if (socialLinks[iconClass]) {
                window.open(socialLinks[iconClass], '_blank');
            }
        });
    });

    // Active navigation link highlighting
    function highlightActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    highlightActiveNav();

    // Loading animation (optional)
    function hideLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }

    // Hide loader after page load
    window.addEventListener('load', hideLoader);
});

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(function() {
    // Add any scroll optimizations here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);
