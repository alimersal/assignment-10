
// Custom Scripts

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Theme Switcher ---
    const themeButton = document.querySelector('#theme-toggle-button');
    const htmlTag = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    
    // Load saved preference
    if (savedTheme) {
        if (savedTheme === 'light') {
            htmlTag.classList.remove('dark');
            themeButton.setAttribute('aria-pressed', 'false');
        } else {
            htmlTag.classList.add('dark');
            themeButton.setAttribute('aria-pressed', 'true');
        }
    }

    // Toggle click
    if (themeButton) {
        themeButton.addEventListener('click', function() {
            htmlTag.classList.toggle('dark');
            
            // Save preference
            if (htmlTag.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                themeButton.setAttribute('aria-pressed', 'true');
            } else {
                localStorage.setItem('theme', 'light');
                themeButton.setAttribute('aria-pressed', 'false');
            }
        });
    }

    // --- Active Link Highlight ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-link');

    window.addEventListener('scroll', function() {
        let currentSectionId = '';
        
        // Find visible section with better accuracy
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust offset for fixed header (approx 100px) and visual comfort
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Update nav links
        navLinks.forEach(function(link) {
            // Clean up old active states
            link.classList.remove('active', 'text-primary', 'font-bold');
            
            // Re-apply default text color based on link type (desktop vs mobile handling)
            // Note: simple toggle of classes is easier than checking type, as CCS handles specifics if we just remove 'active'
            // But we must respect the original base classes logic if present.
            // Simplified: Remove active-specific/color classes, let CSS or base classes handle default.
            // The original code was adding 'text-slate-600' explicitly. We'll stick to that pattern for desktop consistency.
            
            if (!link.classList.contains('mobile-link')) {
                 link.classList.add('text-slate-600', 'dark:text-slate-300');
            } else {
                 link.classList.remove('text-primary'); // Mobile handles its own color via CSS, but we remove the active override
            }

            const href = link.getAttribute('href');
            if (href.includes(currentSectionId) && currentSectionId !== '') {
                // Remove default colors to let active styles take over
                if (!link.classList.contains('mobile-link')) {
                    link.classList.remove('text-slate-600', 'dark:text-slate-300');
                }
                
                // Add active state
                link.classList.add('active');
                
                // Add explicit Tailwind classes for 'active' look if CSS isn't enough or for legacy support
                if (!link.classList.contains('mobile-link')) {
                     link.classList.add('text-primary', 'font-bold');
                }
            }
        });
    });

    // --- Portfolio Filters ---
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const allProjects = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Update button styles
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-linear-to-r', 'from-primary', 'to-secondary', 'text-white');
                btn.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
            });

            this.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
            this.classList.add('active', 'bg-linear-to-r', 'from-primary', 'to-secondary', 'text-white');

            // Filter items
            const category = this.getAttribute('data-filter');

            allProjects.forEach(function(project) {
                const projectCategory = project.getAttribute('data-category');
                
                if (category === 'all' || projectCategory === category) {
                    project.classList.remove('hidden');
                    project.style.display = 'block';
                    
                    // Fade in
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 50);

                } else {
                    // Fade out & hide
                    project.style.opacity = '0';
                    project.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        project.classList.add('hidden');
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- Testimonials Slider ---
    const track = document.querySelector('#testimonials-carousel');
    const nextButton = document.querySelector('#next-testimonial');
    const prevButton = document.querySelector('#prev-testimonial');
    const dots = document.querySelectorAll('.carousel-indicator');
    
    let currentSlide = 0;
    
    // Responsive items per view
    function getVisibleItems() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }

    function updateCarousel() {
        const visibleItems = getVisibleItems();
        const totalItems = document.querySelectorAll('.testimonial-card').length;
        const maxSlide = totalItems - visibleItems;

        // Bounds check
        if (currentSlide < 0) currentSlide = 0;
        if (currentSlide > maxSlide) currentSlide = maxSlide;

        // Move slider
        const movePercentage = 100 / visibleItems;
        track.style.transform = `translateX(${currentSlide * movePercentage}%)`;

        // Update dots
        dots.forEach((dot, index) => {
             const rangePerDot = maxSlide / (dots.length - 1 || 1);
             const activeDotIndex = Math.round(currentSlide / rangePerDot);
             
             if (index === activeDotIndex) {
                 dot.classList.remove('bg-slate-400', 'dark:bg-slate-600');
                 dot.classList.add('bg-accent', 'scale-125');
             } else {
                 dot.classList.add('bg-slate-400', 'dark:bg-slate-600');
                 dot.classList.remove('bg-accent', 'scale-125');
             }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const maxSlide = document.querySelectorAll('.testimonial-card').length - getVisibleItems();
            
            if (currentSlide < maxSlide) {
                currentSlide++;
            } else {
                currentSlide = 0; // Loop back
            }
            updateCarousel();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentSlide > 0) {
                currentSlide--;
            } else {
                currentSlide = document.querySelectorAll('.testimonial-card').length - getVisibleItems(); // Loop to end
            }
            updateCarousel();
        });
    }
    
    window.addEventListener('resize', updateCarousel);
    
    // Dot click
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const maxSlide = document.querySelectorAll('.testimonial-card').length - getVisibleItems();
            
            // Map dot to slide index
            currentSlide = Math.round(index * (maxSlide / (dots.length - 1)));
            updateCarousel();
        });
    });

    // --- Settings Sidebar ---
    const gearButton = document.querySelector('#settings-toggle');
    const sidebar = document.querySelector('#settings-sidebar');
    const closeSidebarBtn = document.querySelector('#close-settings');
    const resetBtn = document.querySelector('#reset-settings');
    const colorGrid = document.querySelector('#theme-colors-grid');
    
    function toggleSettings() {
        if (sidebar) {
            sidebar.classList.toggle('translate-x-full');
            gearButton.setAttribute('aria-expanded', !sidebar.classList.contains('translate-x-full'));
        }
    }

    if (gearButton) {
        gearButton.addEventListener('click', toggleSettings);
        if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSettings);
        
        // Click outside to close
        document.addEventListener('click', function(e) {
            if (sidebar && !sidebar.classList.contains('translate-x-full')) {
                if (!sidebar.contains(e.target) && !gearButton.contains(e.target)) {
                    toggleSettings();
                }
            }
        });
    }

    // --- Fonts ---
    const fontOptions = document.querySelectorAll('.font-option');
    
    function setFont(fontName) {
        document.body.classList.remove('font-alexandria', 'font-tajawal', 'font-cairo');
        document.body.classList.add('font-' + fontName);
        localStorage.setItem('user-font', fontName);

        // Active state
        fontOptions.forEach(opt => {
             opt.classList.remove('border-primary', 'dark:border-white', 'active');
             opt.setAttribute('aria-checked', 'false');
        });
        
        const activeBtn = document.querySelector(`.font-option[data-font="${fontName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('border-primary', 'dark:border-white', 'active');
            activeBtn.setAttribute('aria-checked', 'true');
        }
    }

    fontOptions.forEach(option => {
        option.addEventListener('click', function() {
            setFont(this.getAttribute('data-font'));
        });
    });

    const savedFont = localStorage.getItem('user-font');
    if (savedFont) setFont(savedFont);

    // --- Colors ---
    const colors = [
        { name: 'Default', primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899' },
        { name: 'Ocean', primary: '#0ea5e9', secondary: '#3b82f6', accent: '#06b6d4' },
        { name: 'Nature', primary: '#22c55e', secondary: '#10b981', accent: '#84cc16' },
        { name: 'Sunset', primary: '#f97316', secondary: '#ef4444', accent: '#eab308' },
        { name: 'Berry', primary: '#d946ef', secondary: '#a855f7', accent: '#f43f5e' }
    ];

    if (colorGrid) {
        colors.forEach(theme => {
            const btn = document.createElement('button');
            btn.className = 'w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-md cursor-pointer hover:scale-110 transition-transform flex items-center justify-center';
            btn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
            btn.setAttribute('aria-label', theme.name);
            
            btn.addEventListener('click', function() {
                // Apply Vars
                document.documentElement.style.setProperty('--color-primary', theme.primary);
                document.documentElement.style.setProperty('--color-secondary', theme.secondary);
                document.documentElement.style.setProperty('--color-accent', theme.accent);
                
                localStorage.setItem('user-colors', JSON.stringify(theme));
                
                // Show Checkmark
                colorGrid.querySelectorAll('button').forEach(b => b.innerHTML = '');
                this.innerHTML = '<i class="fa-solid fa-check text-white drop-shadow-md"></i>';
            });

            colorGrid.appendChild(btn);
        });
    }

    const savedColors = localStorage.getItem('user-colors');
    if (savedColors) {
        const theme = JSON.parse(savedColors);
        document.documentElement.style.setProperty('--color-primary', theme.primary);
        document.documentElement.style.setProperty('--color-secondary', theme.secondary);
        document.documentElement.style.setProperty('--color-accent', theme.accent);
    }
    
    // Reset
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            localStorage.clear(); // Clear all app settings
            window.location.reload();
        });
    }


    // --- Scroll To Top ---
    const upButton = document.querySelector('#scroll-to-top');

    if (upButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                upButton.classList.remove('opacity-0', 'invisible');
            } else {
                upButton.classList.add('opacity-0', 'invisible');
            }
        });

        upButton.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Mobile Menu Logic ---
    const mobileBtn = document.querySelector('#mobile-menu-btn');
    const mobileMenu = document.querySelector('#mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const mobileThemeToggle = document.querySelector('#mobile-theme-toggle');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('translate-x-full');
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
            });
        });
    }

    // Sync Mobile Theme Toggle
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', function() {
             // Simulate click on main theme button to reuse logic and sync state
             if (themeButton) themeButton.click();
        });
    }

    // --- Custom Dropdown Functionality (HTML/CSS only UI) ---
    const customSelects = document.querySelectorAll('.custom-select');
    
    customSelects.forEach(select => {
        const optionsContainer = select.nextElementSibling;
        const selectedText = select.querySelector('.selected-text');
        const chevron = select.querySelector('.fa-chevron-down');
        const options = optionsContainer.querySelectorAll('.custom-option');
        const hiddenInput = select.closest('.custom-select-wrapper').parentElement.querySelector('input[type="hidden"]');

        // Toggle dropdown
        select.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = select.getAttribute('aria-expanded') === 'true';
            
            // Close all other dropdowns
            customSelects.forEach(s => {
                s.setAttribute('aria-expanded', 'false');
                s.nextElementSibling.classList.add('hidden');
                s.querySelector('.fa-chevron-down').classList.remove('rotate-180');
            });

            // Toggle current dropdown
            if (!isExpanded) {
                select.setAttribute('aria-expanded', 'true');
                optionsContainer.classList.remove('hidden');
                chevron.classList.add('rotate-180');
            }
        });

        // Handle option selection
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                
                selectedText.textContent = value;
                selectedText.classList.remove('text-slate-500', 'dark:text-slate-400');
                selectedText.classList.add('text-slate-800', 'dark:text-white');
                
                // Update hidden input
                if (hiddenInput) {
                    hiddenInput.value = value;
                }
                
                // Close dropdown
                select.setAttribute('aria-expanded', 'false');
                optionsContainer.classList.add('hidden');
                chevron.classList.remove('rotate-180');
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        customSelects.forEach(select => {
            select.setAttribute('aria-expanded', 'false');
            select.nextElementSibling.classList.add('hidden');
            select.querySelector('.fa-chevron-down').classList.remove('rotate-180');
        });
    });

    // --- Contact Form Validation ---
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        const fullNameInput = document.querySelector('#full-name');
        const emailInput = document.querySelector('#email');
        const phoneInput = document.querySelector('#phone');
        const projectTypeInput = document.querySelector('#project-type-value');
        const budgetInput = document.querySelector('#budget-value');
        const projectDetailsInput = document.querySelector('#project-details');

        // Clear error on input
        function clearError(input) {
            const parent = input.closest('div');
            const errorSpan = parent.querySelector('.error-message');
            const inputField = input.classList.contains('custom-select') ? input : parent.querySelector('input, textarea');
            
            if (errorSpan) {
                errorSpan.classList.add('hidden');
                errorSpan.textContent = '';
            }
            
            if (inputField) {
                inputField.classList.remove('border-red-500', '!border-red-500');
                inputField.classList.add('border-slate-300', 'dark:border-slate-600');
            }
        }

        // Show error
        function showError(input, message) {
            const parent = input.closest('div');
            const errorSpan = parent.querySelector('.error-message');
            const inputField = input.classList.contains('custom-select') ? input : parent.querySelector('input, textarea');
            
            if (errorSpan) {
                errorSpan.classList.remove('hidden');
                errorSpan.textContent = message;
            }
            
            if (inputField) {
                inputField.classList.remove('border-slate-300', 'dark:border-slate-600');
                inputField.classList.add('border-red-500', '!border-red-500');
            }
        }

        // Validate on blur (after user finishes typing)
        fullNameInput.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                showError(this, 'يرجى إدخال الاسم الكامل');
            } else {
                clearError(this);
            }
        });

        emailInput.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                showError(this, 'يرجى إدخال البريد الإلكتروني');
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value.trim())) {
                    showError(this, 'يرجى إدخال بريد إلكتروني صحيح');
                } else {
                    clearError(this);
                }
            }
        });

        projectDetailsInput.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value === '') {
                showError(this, 'يرجى إدخال تفاصيل المشروع');
            } else if (value.length < 20) {
                showError(this, 'يرجى إدخال المزيد من التفاصيل');
            } else {
                clearError(this);
            }
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;

            // Validate full name
            if (fullNameInput.value.trim() === '') {
                showError(fullNameInput, 'يرجى إدخال الاسم الكامل');
                isValid = false;
            }

            // Validate email
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'يرجى إدخال البريد الإلكتروني');
                isValid = false;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    showError(emailInput, 'يرجى إدخال بريد إلكتروني صحيح');
                    isValid = false;
                }
            }

            // Validate project details
            const details = projectDetailsInput.value.trim();
            if (details === '') {
                showError(projectDetailsInput, 'يرجى إدخال تفاصيل المشروع');
                isValid = false;
            } else if (details.length < 20) {
                showError(projectDetailsInput, 'يرجى إدخال المزيد من التفاصيل');
                isValid = false;
            }

            // If valid, show success message
            if (isValid) {
                Swal.fire({
                    icon: 'success',
                    title: 'تم إرسال رسالتك بنجاح!',
                    text: 'سنتواصل معك في أقرب وقت ممكن',
                    confirmButtonText: 'حسناً',
                    confirmButtonColor: '#6366f1',
                    background: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#1e293b'
                }).then(() => {
                    // Reset form
                    contactForm.reset();
                    
                    // Reset dropdown texts
                    customSelects.forEach(select => {
                        const selectedText = select.querySelector('.selected-text');
                        const placeholder = select.getAttribute('data-name') === 'project-type' ? 'اختر نوع المشروع' : 'اختر الميزانية';
                        selectedText.textContent = placeholder;
                        selectedText.classList.add('text-slate-500', 'dark:text-slate-400');
                        selectedText.classList.remove('text-slate-800', 'dark:text-white');
                    });

                    // Clear hidden inputs
                    if (projectTypeInput) projectTypeInput.value = '';
                    if (budgetInput) budgetInput.value = '';
                });
            }
        });
    }

});
