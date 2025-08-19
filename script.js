// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
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
        // Set the date we're counting down to (you can change this date)
        const countDownDate = new Date("2025-08-25T00:00:00").getTime();
        
        const now = new Date().getTime();
        const distance = countDownDate - now;

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
            document.querySelector('.coming-soon-content h3').textContent = 'Event Started!';
            document.querySelector('.coming-soon-content p').textContent = 'The challenge has begun. Good luck to all participants!';
            document.getElementById('countdown').style.display = 'none';
        }
    }

    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately

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
