/* =============================================
   ARUNKUMAR & VISHALI – WEDDING 2026
   main.js – All interactivity
   ============================================= */

// ─── LANGUAGE SYSTEM ─────────────────────────
let currentLang = 'en'; // default English

function toggleLang() {
  currentLang = currentLang === 'en' ? 'ta' : 'en';
  applyLanguage();
}

function applyLanguage() {
  const lang = currentLang;

  document.querySelectorAll(`[data-${lang}]`).forEach(el => {
    const val = el.getAttribute(`data-${lang}`);
    if (val) el.textContent = val;
  });

  const btn = document.getElementById('langToggle');
  if (btn) {
    btn.classList.toggle('active-en', lang === 'en');
    btn.classList.toggle('active-ta', lang === 'ta');
  }

  const invTamil = document.getElementById('invTamil');
  const invEnglish = document.getElementById('invEnglish');
  if (invTamil && invEnglish) {
    if (lang === 'ta') {
      invTamil.classList.remove('hidden');
      invEnglish.classList.add('hidden');
    } else {
      invEnglish.classList.remove('hidden');
      invTamil.classList.add('hidden');
    }
  }

  document.getElementById('htmlRoot').setAttribute('lang', lang === 'ta' ? 'ta' : 'en');

  try { localStorage.setItem('wedding_lang', lang); } catch(e) {}
}

(function() {
  try {
    const saved = localStorage.getItem('wedding_lang');
    if (saved === 'ta') { currentLang = 'ta'; applyLanguage(); }
  } catch(e) {}
})();


// ─── INTRO OVERLAY (Save the Date animation) ─
(function initIntro() {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  const pc = document.getElementById('introPetals');
  if (pc) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      const size = Math.random() * 10 + 6;
      p.style.cssText = `
        left:${Math.random()*100}%; top:-20px;
        width:${size}px; height:${size*0.6}px;
        background: rgba(198,160,80,${Math.random()*0.35+0.15});
        border-radius: 50% 0 50% 0;
        animation-duration:${Math.random()*8+10}s;
        animation-delay:${Math.random()*6}s;
      `;
      pc.appendChild(p);
    }
  }

  const timer = setTimeout(() => dismissIntro(), 4000);

  window.skipIntro = function() {
    clearTimeout(timer);
    dismissIntro();
  };

  function dismissIntro() {
    overlay.classList.add('done');
    document.body.style.overflow = '';
    setTimeout(() => overlay.remove(), 900);
  }

  document.body.style.overflow = 'hidden';
})();

function skipIntro() { /* defined inside initIntro */ }


// ─── NAV ─────────────────────────────────────
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  highlightNavLink();
});

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMobileNav();
  }
});

function highlightNavLink() {
  const sections = ['home','video','invitation','family','gallery','venue'];
  const scrollY = window.scrollY + 90;
  sections.forEach(id => {
    const sec = document.getElementById(id);
    const link = document.querySelector(`.nav__links a[href="#${id}"]`);
    if (!sec || !link) return;
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}
highlightNavLink();


// ─── COUNTDOWN ───────────────────────────────
(function initCountdown() {
  // Monday, 31 Aug 2026, 9:00 AM IST
  const weddingDate = new Date('2026-08-31T09:00:00+05:30').getTime();

  function tick() {
    const diff = weddingDate - Date.now();
    if (diff <= 0) {
      ['days','hours','minutes','seconds'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      const ey = document.getElementById('cdEyebrow');
      if (ey) ey.textContent = '🎉 The wedding is today!';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    const set = (id, v) => { const el=document.getElementById(id); if(el) el.textContent=String(v).padStart(2,'0'); };
    set('days', d); set('hours', h); set('minutes', m); set('seconds', s);
  }
  tick();
  setInterval(tick, 1000);
})();


// ─── SCROLL REVEAL ───────────────────────────
(function initReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();


// ─── PARTICLES ───────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 50 }, () => ({
    x:     Math.random() * (canvas.width || window.innerWidth),
    y:     Math.random() * (canvas.height || window.innerHeight),
    r:     Math.random() * 1.6 + 0.3,
    vx:    (Math.random() - 0.5) * 0.25,
    vy:    -(Math.random() * 0.45 + 0.15),
    alpha: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.45 ? '#C6A050' : '#FFFFFF',
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();


// ─── FLOATING PETALS ─────────────────────────
(function initPetals() {
  const container = document.getElementById('petals');
  if (!container) return;
  const count = window.innerWidth < 600 ? 8 : 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size  = Math.random() * 10 + 5;
    const color = Math.random() > 0.5
      ? `rgba(198,160,80,${Math.random()*0.4+0.15})`
      : `rgba(255,255,255,${Math.random()*0.25+0.08})`;
    p.style.cssText = `
      left:${Math.random()*100}%; top:-20px;
      width:${size}px; height:${size*0.6}px;
      background:${color}; border-radius:50% 0 50% 0;
      animation-duration:${Math.random()*8+10}s;
      animation-delay:${Math.random()*12}s;
    `;
    container.appendChild(p);
  }
})();


// ─── VIDEO AUTOPLAY (pre-wedding shoot) ──────
// Drop your file at video/prewedding.mp4 (uncomment the <source> tag
// in index.html) and it will autoplay, muted, on page load.
(function initVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;
  video.addEventListener('canplay', () => {
    video.play().catch(() => {
      // Autoplay blocked by browser – overlay stays visible until user taps
    });
  });
})();


// ─── GALLERY LIGHTBOX ────────────────────────
const galleryImages = [
  'images/gallery-1.jpg','images/gallery-2.jpg','images/gallery-3.jpg',
  'images/gallery-4.jpg','images/gallery-5.jpg','images/gallery-6.jpg',
];
let lbIndex = 0;

function openLightbox(index) {
  const img = document.getElementById('lbImg');
  const lb  = document.getElementById('lightbox');
  if (!img || !lb) return;
  lbIndex = index;
  img.src = galleryImages[index];
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

function changeLightbox(dir) {
  lbIndex = (lbIndex + dir + galleryImages.length) % galleryImages.length;
  const img = document.getElementById('lbImg');
  if (img) img.src = galleryImages[lbIndex];
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') changeLightbox(1);
  if (e.key === 'ArrowLeft')  changeLightbox(-1);
  if (e.key === 'Escape')     closeLightbox();
});


// ─── WHATSAPP SHARE ──────────────────────────
function shareOnWhatsApp() {
  const isTamil = currentLang === 'ta';
  const text = isTamil
    ? encodeURIComponent(
        '🌟 திருமண அழைப்பிதழ்!\n\n' +
        '💍 *Y. அருண்குமார் & S. விஷாலி*\n\n' +
        '📅 *31-08-2026 (திங்கள்கிழமை)*\n' +
        '⏰ முகூர்த்தம்: காலை 9:00 – 10:30\n' +
        '📍 அருள்மிகு ஸ்ரீ பாலமுருகன் திருக்கோயில் (N-4), சென்னை-81\n' +
        '🎉 மாலை 6:30 மணிக்கு மேல் ஸ்ரீ பேலஸ் திருமண மாளிகை (A/C), சென்னை-13\n\n' +
        'உங்கள் குடும்பத்துடன் வருகை தந்து ஆசீர்வதிக்க அன்புடன் அழைக்கிறோம். 🙏'
      )
    : encodeURIComponent(
        '🌟 Wedding Invitation!\n\n' +
        '💍 *Y. Arunkumar & S. Vishali*\n\n' +
        '📅 *Monday, 31st August 2026*\n' +
        '⏰ Muhurtham: 9:00 AM – 10:30 AM\n' +
        '📍 Arulmigu Sri Balamurugan Thirukoyil (N-4), Chennai-81\n' +
        '🎉 Reception from 6:30 PM — Sri Palace Thirumana Maaligai (A/C), Chennai-13\n\n' +
        'We warmly invite you and your family to bless this occasion. 🙏'
      );
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
}


// ─── SMOOTH SCROLL ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
