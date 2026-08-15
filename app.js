/* ==========================================================================
   IMPA APOLOGY MICROSITE — INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loader = document.getElementById('loader');
  const scrollProgress = document.getElementById('scroll-progress');
  const customCursor = document.getElementById('custom-cursor');
  const ambientContainer = document.getElementById('ambient-particles');
  const heroCta = document.getElementById('hero-cta');
  const admitBtn = document.getElementById('admit-btn');
  const admitResponse = document.getElementById('admit-response');
  const verdictYesBtn = document.getElementById('verdict-yes');
  const verdictNoBtn = document.getElementById('verdict-no');
  const verdictResponse = document.getElementById('verdict-response');
  const replayBtn = document.getElementById('replay-btn');
  const soundToggleBtn = document.getElementById('sound-toggle');
  
  // Audio state (Web Audio API synth)
  let soundEnabled = false;
  let audioCtx = null;

  /* ------------------------------------------------------------------------
     1. LOADER SCREEN REVEAL
     ------------------------------------------------------------------------ */
  setTimeout(() => {
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.style.display = 'none', 500);
    }
  }, 750);

  /* ------------------------------------------------------------------------
     2. SCROLL PROGRESS INDICATOR
     ------------------------------------------------------------------------ */
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ------------------------------------------------------------------------
     3. OPTIONAL SYNTHESIZED SOUND EFFECTS
     ------------------------------------------------------------------------ */
  function playClickSound() {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Ignore audio failure safely
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.innerHTML = soundEnabled 
        ? '<span class="sound-icon">🔊</span> Sound: On' 
        : '<span class="sound-icon">🔇</span> Sound: Off';
      if (soundEnabled) playClickSound();
    });
  }

  /* ------------------------------------------------------------------------
     4. DESKTOP CUSTOM CURSOR
     ------------------------------------------------------------------------ */
  if (customCursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      customCursor.style.left = `${e.clientX}px`;
      customCursor.style.top = `${e.clientY}px`;
    });

    const hoverables = document.querySelectorAll('button, .glass-card, a');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => customCursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => customCursor.classList.remove('cursor-hover'));
    });
  }

  /* ------------------------------------------------------------------------
     5. AMBIENT PARTICLES ENGINE
     ------------------------------------------------------------------------ */
  function generateAmbientParticles() {
    if (!ambientContainer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    ambientContainer.innerHTML = '';
    const emojis = ['🕵️', '📱', '🔍', '⚠️', '⚡'];
    const particleCount = 10;

    for (let i = 0; i < particleCount; i++) {
      const span = document.createElement('span');
      span.className = 'floating-emoji';
      span.innerText = emojis[i % emojis.length];
      span.style.left = `${Math.random() * 92 + 4}%`;
      span.style.top = `${Math.random() * 85 + 5}%`;
      span.style.animationDelay = `${Math.random() * 8}s`;
      span.style.animationDuration = `${10 + Math.random() * 8}s`;
      ambientContainer.appendChild(span);
    }
  }
  generateAmbientParticles();

  /* ------------------------------------------------------------------------
     6. SCROLL REVEAL OBSERVER & EVIDENCE SEQUENCING
     ------------------------------------------------------------------------ */
  const revealSections = document.querySelectorAll('.reveal-section');
  const evidenceCards = document.querySelectorAll('.evidence-card');
  let evidenceAnimated = false;

  function animateEvidenceCards() {
    if (evidenceAnimated) return;
    evidenceAnimated = true;
    evidenceCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('card-animated');
      }, index * 160);
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.id === 'case-file') {
          animateEvidenceCards();
        }
      }
    });
  }, observerOptions);

  revealSections.forEach(section => sectionObserver.observe(section));

  /* ------------------------------------------------------------------------
     7. HERO CTA SMOOTH SCROLL
     ------------------------------------------------------------------------ */
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      playClickSound();
      const targetSection = document.getElementById('problem');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ------------------------------------------------------------------------
     8. SCREEN 3: ADMIT BUTTON INTERACTION
     ------------------------------------------------------------------------ */
  if (admitBtn && admitResponse) {
    admitBtn.addEventListener('click', () => {
      playClickSound();
      admitResponse.classList.remove('hidden');
      admitBtn.setAttribute('aria-expanded', 'true');
    });
  }

  /* ------------------------------------------------------------------------
     9. SCREEN 5: VERDICT BUTTON INTERACTION
     ------------------------------------------------------------------------ */
  function showVerdictResponse(htmlContent) {
    if (!verdictResponse) return;
    verdictResponse.innerHTML = htmlContent;
    verdictResponse.classList.remove('hidden');
    verdictResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (verdictYesBtn) {
    verdictYesBtn.addEventListener('click', () => {
      playClickSound();
      showVerdictResponse(`
        <p class="response-headline">Thank you for not filing a complaint 😂✅</p>
      `);
    });
  }

  if (verdictNoBtn) {
    verdictNoBtn.addEventListener('click', () => {
      playClickSound();
      showVerdictResponse(`
        <p class="response-headline">I knew it 😭</p>
        <p class="response-sub">Okay officer, what do I need to do to get out of this interrogation? 🥲</p>
      `);
    });
  }

  /* ------------------------------------------------------------------------
     10. REPLAY INVESTIGATION
     ------------------------------------------------------------------------ */
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      playClickSound();
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Reset admission & verdict states
      if (admitResponse) admitResponse.classList.add('hidden');
      if (verdictResponse) {
        verdictResponse.classList.add('hidden');
        verdictResponse.innerHTML = '';
      }
      
      // Reset evidence card animations so they re-trigger on scroll
      evidenceAnimated = false;
      evidenceCards.forEach(card => card.classList.remove('card-animated'));
      
      // Re-check visibility
      setTimeout(() => {
        const caseFileSection = document.getElementById('case-file');
        const rect = caseFileSection.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          animateEvidenceCards();
        }
      }, 500);
    });
  }
});
