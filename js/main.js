/**
 * قالب صفحة هبوط عربية — التفاعلات الأساسية
 * JavaScript نقي بدون مكتبات. كل جزء معلّق بالعربية.
 */
(function () {
  'use strict';

  /* ---------- 1) قائمة الموبايل ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    // إتاحة الوصول: أخبر قارئ الشاشة بحالة القائمة
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
  });

  // أغلق القائمة عند الضغط على أي رابط داخلها
  mainNav.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- 2) ظل الشريط العلوي عند التمرير ---------- */
  var header = document.getElementById('siteHeader');
  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ---------- 3) حركة الظهور عند التمرير (IntersectionObserver) ---------- */
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); // أنيميشن مرة واحدة فقط
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // متصفحات قديمة: أظهر كل شيء مباشرة
    revealElements.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 4) عدّادات الأرقام ---------- */
  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var duration = 1400; // بالمللي ثانية
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // منحنى تباطؤ بسيط لحركة طبيعية
      var eased = 1 - Math.pow(1 - progress, 3);
      // أرقام إنجليزية لضمان ظهورها في كل الخطوط العربية
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.stat-number');
  // تفضيل تقليل الحركة: اعرض الأرقام النهائية مباشرة بدون عدّ متحرك
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    counters.forEach(function (el) { el.textContent = el.dataset.target; });
  } else if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.dataset.target;
    });
  }

  /* ---------- 5) التحقق من نموذج التواصل ---------- */
  var form = document.getElementById('contactForm');
  var successMessage = document.getElementById('formSuccess');

  // رسائل الخطأ بالعربية لكل حقل
  var errorMessages = {
    name: 'من فضلك اكتب اسمك (3 أحرف على الأقل).',
    phone: 'من فضلك اكتب رقم هاتف صحيح (10 إلى 15 رقماً).',
    message: 'من فضلك اكتب رسالة لا تقل عن 10 أحرف.'
  };

  function validateField(field) {
    var errorEl = form.querySelector('[data-error-for="' + field.name + '"]');
    var isValid = field.checkValidity();
    field.classList.toggle('is-invalid', !isValid);
    if (errorEl) errorEl.textContent = isValid ? '' : (errorMessages[field.name] || 'هذا الحقل مطلوب.');
    return isValid;
  }

  // تحقق فوري أثناء الكتابة بعد أول محاولة إرسال
  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () { validateField(field); });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var allValid = Array.prototype.every.call(
      form.querySelectorAll('input, textarea'),
      validateField
    );
    if (!allValid) return;

    // لا يوجد خادم في القالب — اربط هنا خدمة الإرسال التي تفضلها
    // (Formspree، EmailJS، أو API خاص بك)
    successMessage.hidden = false;
    form.reset();
    setTimeout(function () { successMessage.hidden = true; }, 5000);
  });

  /* ---------- 6) سنة الفوتر تلقائياً ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
