import '../scss/global.scss';
// Robust initialisation â€” works whether the script runs before or after
// DOMContentLoaded (handles WordPress footer scripts, defer, and async).
function gssInit() {
    // 1. Feather icons
    if (typeof feather !== 'undefined') feather.replace();

    // 2. Desktop dropdown menus
    document.querySelectorAll('.nav__item--has-children').forEach((item) => {
        const toggle = item.querySelector('.nav__dropdown-toggle');
        if (!toggle) return;

        // Open/close on toggle button click
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = item.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            // Close all siblings
            document.querySelectorAll('.nav__item--has-children').forEach((other) => {
                if (other !== item) {
                    other.classList.remove('open');
                    const t = other.querySelector('.nav__dropdown-toggle');
                    if (t) t.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close on Escape
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                item.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
        document.querySelectorAll('.nav__item--has-children.open').forEach((item) => {
            item.classList.remove('open');
            const t = item.querySelector('.nav__dropdown-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
        });
    });

    // 4. Mobile nav toggle
    const navToggle = document.getElementById('nav-toggle');
    const navDrawer = document.getElementById('nav-drawer');

    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', () => {
            const isOpen = navDrawer.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
                navDrawer.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('click', (e) => {
            if (
                navDrawer.classList.contains('open') &&
                !navDrawer.contains(e.target) &&
                !navToggle.contains(e.target)
            ) {
                navDrawer.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // 3. Sticky nav shadow via IntersectionObserver
    const sentinel = document.getElementById('nav-sentinel');
    const mainNav = document.getElementById('main-nav');
    if (sentinel && mainNav) {
        const observer = new IntersectionObserver(
            ([entry]) => mainNav.classList.toggle('nav--scrolled', !entry.isIntersecting),
            { threshold: 0 },
        );
        observer.observe(sentinel);
    }

    // 4. FAQ accordion
    const faqContainer = document.getElementById('faq');
    if (faqContainer) {
        faqContainer.addEventListener('click', (e) => {
            const trigger = e.target.closest('.faq__trigger');
            if (!trigger) return;

            const item = trigger.closest('.faq__item');
            const body = item.querySelector('.faq__body');
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';

            // Collapse all siblings
            faqContainer.querySelectorAll('.faq__item').forEach((sibling) => {
                const sibTrigger = sibling.querySelector('.faq__trigger');
                const sibBody = sibling.querySelector('.faq__body');
                sibTrigger.setAttribute('aria-expanded', 'false');
                sibBody.style.maxHeight = '0';
            });

            // Open clicked if it was closed
            if (!isOpen) {
                trigger.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    }

    // 5. Contact form validation
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');

    if (contactForm && contactSuccess) {
        const rules = [
            { id: 'first-name', errorId: 'first-name-error', validate: (v) => v.trim().length > 0 },
            { id: 'last-name', errorId: 'last-name-error', validate: (v) => v.trim().length > 0 },
            { id: 'business', errorId: 'business-error', validate: (v) => v.trim().length > 0 },
            { id: 'email', errorId: 'email-error', validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
            { id: 'subject', errorId: 'subject-error', validate: (v) => v !== '' },
            { id: 'message', errorId: 'message-error', validate: (v) => v.trim().length > 10 },
        ];

        const clearError = (field, errorEl) => {
            field.classList.remove('error');
            errorEl.classList.remove('show');
        };

        rules.forEach(({ id, errorId }) => {
            const field = document.getElementById(id);
            const errorEl = document.getElementById(errorId);
            if (field && errorEl) {
                field.addEventListener('input', () => clearError(field, errorEl));
                field.addEventListener('change', () => clearError(field, errorEl));
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            rules.forEach(({ id, errorId, validate }) => {
                const field = document.getElementById(id);
                const errorEl = document.getElementById(errorId);
                if (!field || !errorEl) return;
                if (!validate(field.value)) {
                    field.classList.add('error');
                    errorEl.classList.add('show');
                    if (valid) field.focus();
                    valid = false;
                } else {
                    clearError(field, errorEl);
                }
            });

            if (valid) {
                contactForm.style.display = 'none';
                contactSuccess.classList.add('show');
                // Re-init feather icons inside success block
                if (typeof feather !== 'undefined') feather.replace();
            }
        });
    }

    // 6. Homepage contact form validation
    const homeForm = document.getElementById('home-contact-form');
    const homeSuccess = document.getElementById('home-contact-success');

    if (homeForm && homeSuccess) {
        const homeRules = [
            { id: 'hc-business', errorId: 'hc-business-error', validate: (v) => v.trim().length > 0 },
            { id: 'hc-phone', errorId: 'hc-phone-error', validate: (v) => v.trim().length > 0 },
            { id: 'hc-email', errorId: 'hc-email-error', validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
            { id: 'hc-address', errorId: 'hc-address-error', validate: (v) => v.trim().length > 0 },
            { id: 'hc-spend', errorId: 'hc-spend-error', validate: (v) => v !== '' },
        ];

        const clearErr = (field, errorEl) => {
            field.classList.remove('error');
            errorEl.classList.remove('show');
        };

        homeRules.forEach(({ id, errorId }) => {
            const field = document.getElementById(id);
            const errorEl = document.getElementById(errorId);
            if (field && errorEl) {
                field.addEventListener('input', () => clearErr(field, errorEl));
                field.addEventListener('change', () => clearErr(field, errorEl));
            }
        });

        homeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;

            homeRules.forEach(({ id, errorId, validate }) => {
                const field = document.getElementById(id);
                const errorEl = document.getElementById(errorId);
                if (!field || !errorEl) return;
                if (!validate(field.value)) {
                    field.classList.add('error');
                    errorEl.classList.add('show');
                    if (valid) field.focus();
                    valid = false;
                } else {
                    clearErr(field, errorEl);
                }
            });

            if (valid) {
                homeForm.style.display = 'none';
                homeSuccess.classList.add('show');
                homeSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (typeof feather !== 'undefined') feather.replace();
            }
        });
    }

    // 7. Shipping Journey tabs
    const journeyTabs = document.querySelectorAll('.journey__tab');
    const journeyPanels = document.querySelectorAll('.journey__panel');
    const journeyProgress = document.getElementById('journey-progress');
    const journeyPrev = document.getElementById('journey-prev');
    const journeyNext = document.getElementById('journey-next');
    const journeyCurrent = document.getElementById('journey-current');
    const total = journeyTabs.length;

    function activateJourneyTab(index) {
        journeyTabs.forEach((tab, i) => {
            const active = i === index;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', String(active));
        });
        journeyPanels.forEach((panel, i) => {
            const active = i === index;
            panel.classList.toggle('active', active);
            if (active) panel.removeAttribute('hidden');
            else panel.setAttribute('hidden', '');
        });
        if (journeyProgress) journeyProgress.style.width = ((index + 1) / total) * 100 + '%';
        if (journeyCurrent) journeyCurrent.textContent = index + 1;
        if (journeyPrev) journeyPrev.disabled = index === 0;
        if (journeyNext) journeyNext.disabled = index === total - 1;
        if (typeof feather !== 'undefined') feather.replace();
    }

    journeyTabs.forEach((tab, i) => {
        tab.addEventListener('click', () => activateJourneyTab(i));
    });
    if (journeyPrev)
        journeyPrev.addEventListener('click', () => {
            const cur = Array.from(journeyTabs).findIndex((t) => t.classList.contains('active'));
            if (cur > 0) activateJourneyTab(cur - 1);
        });
    if (journeyNext)
        journeyNext.addEventListener('click', () => {
            const cur = Array.from(journeyTabs).findIndex((t) => t.classList.contains('active'));
            if (cur < total - 1) activateJourneyTab(cur + 1);
        });
} // end gssInit

// Run now if DOM is already parsed, otherwise wait for DOMContentLoaded.
// This handles WordPress footer scripts, static defer, and async loading.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', gssInit);
} else {
    gssInit();
}
