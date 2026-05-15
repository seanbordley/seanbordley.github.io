document.addEventListener('DOMContentLoaded', () => {
    
    // Check Construction Overlay logic
    const overlay = document.getElementById('construction-overlay');
    if (overlay) {
        if (typeof SITE_MODE !== 'undefined' && SITE_MODE === 1) {
            overlay.style.display = 'flex';
        } else {
            overlay.style.display = 'none';
        }
    }

    // Element Selection
    const showcase = document.getElementById('showcase');
    const projects = Array.from(showcase.querySelectorAll('.project-card'));
    const mainContent = document.getElementById('main-content');
    const titleDisplay = document.getElementById('project-title-display');
    const mainTitleDisplay = document.getElementById('project-main-title');
    const emailIconButton = document.getElementById('email-icon-button');
    const contactModalOverlay = document.getElementById('contact-modal-overlay');
    const closeModalButton = document.getElementById('close-modal-button');
    const hexagonContainer = document.getElementById('showcase');
    const contactForm = document.getElementById('contact-form');
    const formContent = document.getElementById('form-content');
    const successMessage = document.getElementById('form-success-message');
    
    const projectContentOverlay = document.getElementById('project-content-overlay');
    const closeProjectButton = document.getElementById('close-project-button');
    const projectIframe = document.getElementById('project-iframe');

    let enlargeTimeout;
    let lastHoveredProject = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // --- Project Content Overlay Logic ---
    const openProjectOverlay = (url) => {
        projectIframe.src = url;
        hexagonContainer.classList.add('is-hidden'); 
        projectContentOverlay.classList.add('is-visible');
    };

    const closeProjectOverlay = () => {
        projectContentOverlay.classList.remove('is-visible');
        hexagonContainer.classList.remove('is-hidden');
        setTimeout(() => {
            projectIframe.src = "about:blank"; 
        }, 300);
    };

    closeProjectButton.addEventListener('click', closeProjectOverlay);
    
    projectContentOverlay.addEventListener('click', (e) => {
        if (e.target === projectContentOverlay) {
            closeProjectOverlay();
        }
    });

    // --- Contact Form Logic ---
    emailIconButton.addEventListener('click', (e) => {
        e.preventDefault();
        contactModalOverlay.classList.add('is-visible');
        hexagonContainer.classList.add('is-hidden');

        if (projectContentOverlay.classList.contains('is-visible')) {
            projectContentOverlay.classList.add('background-faded');
        }
    });

    const closeModal = () => {
        contactModalOverlay.classList.remove('is-visible');
        
        const returningToProject = projectContentOverlay.classList.contains('is-visible');
        projectContentOverlay.classList.remove('background-faded');

        if (returningToProject) {
            hexagonContainer.classList.add('is-hidden');
        } else {
            hexagonContainer.classList.remove('is-hidden');
        }
        
        setTimeout(() => {
            contactForm.reset();
            formContent.style.removeProperty('display'); 
            successMessage.style.display = 'none';
        }, 300);
    };

    closeModalButton.addEventListener('click', closeModal);
    
    contactModalOverlay.addEventListener('click', (e) => {
        if (e.target === contactModalOverlay) {
            closeModal();
        }
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                formContent.style.display = 'none';
                successMessage.style.display = 'block';
                setTimeout(closeModal, 2000); 
            } else {
                alert('Oops! There was a problem submitting your form.');
            }
        }).catch(error => {
            alert('Oops! There was a problem submitting your form.');
        });
    });

    // --- Interaction Logic ---
    const resetAllProjects = () => {
        clearTimeout(enlargeTimeout);
        showcase.classList.remove('is-active', 'is-focused');
        projects.forEach(p => {
            p.classList.remove('is-faded', 'is-central', 'is-enlarged');
        });
        titleDisplay.classList.remove('is-visible');
    };

    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!isDesktop) {
        // Mobile Touch Logic
        projects.forEach(project => {
            project.addEventListener('click', function(e) {
                e.preventDefault();
                const swipeDistance = Math.abs(touchEndX - touchStartX);
                if (swipeDistance > 20) return;
                const url = this.getAttribute('href');
                if (url) openProjectOverlay(url);
            });
        });

        mainContent.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            const currentProject = element ? element.closest('.project-card') : null;

            if (currentProject && currentProject !== lastHoveredProject) {
                lastHoveredProject = currentProject;
                const title = currentProject.dataset.title;
                if (title) {
                    mainTitleDisplay.textContent = title;
                    titleDisplay.classList.add('is-visible');
                }
            } else if (!currentProject && lastHoveredProject) {
                lastHoveredProject = null;
                titleDisplay.classList.remove('is-visible');
            }
        });

        mainContent.addEventListener('touchend', () => {
            lastHoveredProject = null;
            if (!showcase.classList.contains('is-focused')) {
                titleDisplay.classList.remove('is-visible');
            }
        });

        mainContent.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            touchEndX = e.changedTouches[0].screenX; 
            touchEndY = e.changedTouches[0].screenY; 
        }, false);

        mainContent.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
        }, false);

    } else {
        // Desktop Hover Logic
        projects.forEach(project => {
            project.addEventListener('mouseenter', function() {
                projects.forEach(p => p.classList.remove('is-central'));
                showcase.classList.add('is-active');
                projects.forEach(p => {
                    if (p !== this) p.classList.add('is-faded');
                });
                this.classList.remove('is-faded');
                
                const title = this.dataset.title;
                if (title) {
                    mainTitleDisplay.textContent = title;
                    titleDisplay.classList.add('is-visible');
                }
            });

            project.addEventListener('click', function(e) {
                e.preventDefault();
                const url = this.getAttribute('href');
                if (url) openProjectOverlay(url);
            });
        });

        showcase.addEventListener('mouseleave', () => {
            resetAllProjects();
        });
    }

    // --- THEME AUTO-DETECT LOGIC ---
    const setTheme = (isDark) => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches);
    mediaQuery.addEventListener('change', (e) => setTheme(e.matches));
    
    console.log(`Portfolio Version: ${SITE_VERSION}`);

    // --- OFFLINE CACHING (Service Worker Registration) ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});