(function () {
    'use strict';

    // Elements
    const header = document.getElementById('site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const contactForm = document.getElementById('contact-form');
    const formNote = document.getElementById('form-note');
    const yearSpan = document.getElementById('year');

    // Update copyright year
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Header shadow on scroll
    function handleScroll() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile menu toggle
    function toggleMenu(forceClose) {
        const isOpen = mainNav.classList.contains('open');
        const shouldOpen = forceClose ? false : !isOpen;

        mainNav.classList.toggle('open', shouldOpen);
        menuToggle.setAttribute('aria-expanded', String(shouldOpen));
        document.body.style.overflow = shouldOpen ? 'hidden' : '';
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            toggleMenu();
        });

        // Close menu on nav link click (mobile)
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                toggleMenu(true);
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                toggleMenu(true);
                menuToggle.focus();
            }
        });
    }

    // Product tabs
    tabButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const targetId = button.getAttribute('aria-controls');

            // Update buttons
            tabButtons.forEach(function (btn) {
                const isSelected = btn === button;
                btn.classList.toggle('active', isSelected);
                btn.setAttribute('aria-selected', String(isSelected));
                btn.setAttribute('tabindex', isSelected ? '0' : '-1');
            });

            // Update panels
            tabPanels.forEach(function (panel) {
                const isTarget = panel.id === targetId;
                panel.classList.toggle('active', isTarget);
                panel.hidden = !isTarget;
            });
        });
    });

    // Keyboard navigation for tabs (left/right arrows)
    const tabsArray = Array.from(tabButtons);
    tabButtons.forEach(function (button, index) {
        button.addEventListener('keydown', function (e) {
            let nextIndex = index;
            if (e.key === 'ArrowRight') {
                nextIndex = (index + 1) % tabsArray.length;
            } else if (e.key === 'ArrowLeft') {
                nextIndex = (index - 1 + tabsArray.length) % tabsArray.length;
            } else {
                return;
            }
            e.preventDefault();
            tabsArray[nextIndex].focus();
            tabsArray[nextIndex].click();
        });
    });

    // Smooth scroll & active nav highlight
    function onScrollSpy() {
        const scrollPos = window.scrollY + varHeaderHeight();
        const sections = ['home', 'about', 'products', 'contact'];

        sections.forEach(function (id) {
            const section = document.getElementById(id);
            if (!section) return;

            const offsetTop = section.offsetTop;
            const offsetHeight = section.offsetHeight;

            if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function varHeaderHeight() {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 80;
    }

    window.addEventListener('scroll', onScrollSpy, { passive: true });
    onScrollSpy();

    // Contact form demo handling
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const message = contactForm.querySelector('#message').value.trim();

            if (!name || !email || !message) {
                formNote.textContent = 'Please fill in all fields before sending.';
                formNote.style.color = '#dc2626';
                return;
            }

            // Demo success state
            formNote.textContent = 'Thank you, ' + name + '! Your message has been received (demo only).';
            formNote.style.color = '#16a34a';
            contactForm.reset();

            setTimeout(function () {
                formNote.textContent = 'This is a demo form. Connect it to your backend or form service to receive messages.';
                formNote.style.color = '';
            }, 5000);
        });
    }

    // Hero image carousel
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderPrev = document.getElementById('slider-prev');
    const sliderNext = document.getElementById('slider-next');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const heroSlider = document.getElementById('hero-slider');

    if (heroSlides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        const slideDelay = 6000; // 6 seconds

        function showSlide(index) {
            const normalizedIndex = (index + heroSlides.length) % heroSlides.length;

            heroSlides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === normalizedIndex);
            });

            sliderDots.forEach(function (dot, i) {
                const isActive = i === normalizedIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', String(isActive));
                dot.setAttribute('tabindex', isActive ? '0' : '-1');
            });

            currentSlide = normalizedIndex;
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        function startAutoplay() {
            stopAutoplay();
            slideInterval = setInterval(nextSlide, slideDelay);
        }

        function stopAutoplay() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        if (sliderNext) {
            sliderNext.addEventListener('click', function () {
                nextSlide();
                startAutoplay();
            });
        }

        if (sliderPrev) {
            sliderPrev.addEventListener('click', function () {
                prevSlide();
                startAutoplay();
            });
        }

        sliderDots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startAutoplay();
            });

            dot.addEventListener('keydown', function (e) {
                let nextIndex = index;
                if (e.key === 'ArrowRight') {
                    nextIndex = (index + 1) % heroSlides.length;
                } else if (e.key === 'ArrowLeft') {
                    nextIndex = (index - 1 + heroSlides.length) % heroSlides.length;
                } else {
                    return;
                }
                e.preventDefault();
                showSlide(nextIndex);
                sliderDots[nextIndex].focus();
                startAutoplay();
            });
        });

        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', stopAutoplay);
            heroSlider.addEventListener('mouseleave', startAutoplay);
            heroSlider.addEventListener('touchstart', stopAutoplay, { passive: true });
            heroSlider.addEventListener('touchend', function () {
                startAutoplay();
            }, { passive: true });
        }

        // Pause when tab is hidden
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        startAutoplay();
    }
})();
