/**
 * مؤسسة جميلة للمقاولات العامة - JavaScript
 * Handles: Header scroll, mobile nav, accordion, reveal animations,
 * scroll progress, back-to-top
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ─── 1. Scroll Progress Bar ─────────────────────────── */
    const progressBar = document.getElementById('scroll-progress');
    function updateProgress() {
      if (!progressBar) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      progressBar.style.transform = 'scaleX(' + progress + ')';
    }

    /* ─── 2. Header Scroll Effect ────────────────────────── */
    const header = document.getElementById('site-header');
    const backToTop = document.getElementById('back-to-top');

    function onScroll() {
      const scrollY = window.scrollY;

      // Header shadow
      if (header) {
        header.classList.toggle('scrolled', scrollY > 60);
      }

      // Back to top button
      if (backToTop) {
        backToTop.classList.toggle('visible', scrollY > 400);
      }

      updateProgress();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run once on load

    /* ─── 3. Mobile Navigation ────────────────────────────── */
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-controls', 'main-navigation');

      navToggle.addEventListener('click', function () {
        const isOpen = mainNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        // Change icon
        navToggle.innerHTML = isOpen
          ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'
          : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      });

      // Close nav when a link is clicked
      mainNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        });
      });

      // Close nav when clicking outside
      document.addEventListener('click', function (e) {
        if (!header.contains(e.target) && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* ─── 4. Scroll Reveal (Intersection Observer) ────────── */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
      const revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

      reveals.forEach(function (el) { revealObs.observe(el); });
    } else {
      // Fallback: show all elements immediately
      reveals.forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ─── 5. Accordion (FAQ) ──────────────────────────────── */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(function (header) {
      header.addEventListener('click', function () {
        const isActive = header.classList.contains('active');

        // Close all
        document.querySelectorAll('.accordion-header.active').forEach(function (active) {
          active.classList.remove('active');
          active.nextElementSibling.style.maxHeight = null;
        });

        // Open clicked (if it wasn't active)
        if (!isActive) {
          header.classList.add('active');
          const content = header.nextElementSibling;
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });

    /* ─── 6. Back to Top ──────────────────────────────────── */
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ─── 7. Scroll Indicator (Hero) ─────────────────────── */
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', function () {
        const target = document.querySelector('.services-section, main section, section:nth-child(2)');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    /* ─── 8. Lazy Loading Images ──────────────────────────── */
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported - set loading="lazy" for non-hero images
      document.querySelectorAll('img[data-src]').forEach(function (img) {
        img.src = img.dataset.src;
      });
    } else if ('IntersectionObserver' in window) {
      // Fallback Intersection Observer for older browsers
      const imgObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imgObs.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      document.querySelectorAll('img[data-src]').forEach(function (img) {
        imgObs.observe(img);
      });
    }

    /* ─── 9. Contact Form (WhatsApp Redirect) ────────────── */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Check native validation
        if (!contactForm.checkValidity()) {
          contactForm.reportValidity();
          return;
        }

        const name = document.getElementById('contact-name')?.value || '';
        const phone = document.getElementById('contact-phone')?.value || '';
        const serviceSelect = document.getElementById('contact-service');
        const serviceText = serviceSelect && serviceSelect.value ? serviceSelect.options[serviceSelect.selectedIndex].text : 'غير محدد';
        const district = document.getElementById('contact-district')?.value || 'غير محدد';
        const details = document.getElementById('contact-message')?.value || 'لا يوجد تفاصيل إضافية';

        // Format message
        let waMessage = `*مؤسسة جميلة للمقاولات العامة بالرياض*\n`;
        waMessage += `*طلب عرض سعر جديد*\n`;
        waMessage += `---------------------------------------\n\n`;
        waMessage += `*بيانات العميل:*\n`;
        waMessage += `• الاسم: ${name}\n`;
        waMessage += `• الجوال: ${phone}\n\n`;
        waMessage += `*تفاصيل الخدمة:*\n`;
        waMessage += `• الخدمة المطلوبة: ${serviceText}\n`;
        waMessage += `• موقع المشروع (الحي): ${district}\n\n`;
        waMessage += `*تفاصيل إضافية عن المشروع:*\n`;
        waMessage += `${details}\n\n`;
        waMessage += `---------------------------------------\n`;
        waMessage += `_تم إرسال هذا الطلب عبر الموقع الإلكتروني للمؤسسة_`;

        const encodedText = encodeURIComponent(waMessage);
        const waUrl = `https://wa.me/966538430747?text=${encodedText}`;

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'جاري التوجيه للواتساب...';
          submitBtn.disabled = true;
          submitBtn.style.background = '#25d366';
        }

        setTimeout(function () {
          window.open(waUrl, '_blank');
          
          if (submitBtn) {
            submitBtn.textContent = 'إرسال الطلب';
            submitBtn.disabled = false;
            submitBtn.style.background = '';
          }
          contactForm.reset();
        }, 800);
      });
    }

    /* ─── 10. Active nav link highlight ──────────────────── */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

  }); // End DOMContentLoaded

})();
