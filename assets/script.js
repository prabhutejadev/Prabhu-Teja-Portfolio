/* ══════════════════════════════════════
   THEME TOGGLE — FULL JS IMPLEMENTATION
══════════════════════════════════════ */
(function(){
  const html       = document.documentElement;
  const btn        = document.getElementById('themeToggle');
  const knob       = document.getElementById('toggleKnob');
  const label      = document.getElementById('toggleLabel');
  const ripple     = document.getElementById('themeRipple');

  // Icons for each mode
  const ICONS = { light: '☀️', dark: '🌙' };

  // 1. Determine initial theme:
  //    Priority: localStorage > system preference > default 'light'
  function getPreferred() {
    const saved = localStorage.getItem('pt-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  // 2. Apply theme to DOM
  function applyTheme(theme, animate) {
    html.setAttribute('data-theme', theme);
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    knob.textContent = ICONS[theme];
    label.textContent = theme === 'dark' ? 'Dark' : 'Light';

    if (animate) {
      // Ripple flash from toggle position
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      ripple.style.left   = cx + 'px';
      ripple.style.top    = cy + 'px';
      ripple.style.width  = '200vmax';
      ripple.style.height = '200vmax';
      ripple.style.marginLeft  = '-100vmax';
      ripple.style.marginTop   = '-100vmax';
      ripple.classList.remove('flash');
      // force reflow
      void ripple.offsetWidth;
      ripple.classList.add('flash');
    }
  }

  // 3. Toggle handler
  function toggle() {
    const current = html.getAttribute('data-theme') || 'light';
    const next    = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('pt-theme', next);
    applyTheme(next, true);
  }

  // 4. Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('pt-theme')) {
          applyTheme(e.matches ? 'dark' : 'light', true);
        }
      });
  }

  // 5. Clean up ripple after animation ends
  ripple.addEventListener('animationend', () => {
    ripple.classList.remove('flash');
  });

  // 6. Keyboard: Space / Enter also toggle
  btn.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  });

  btn.addEventListener('click', toggle);

  // 7. Init — no animation on load
  applyTheme(getPreferred(), false);
})();

/* ── CURSOR ── */
const cur = document.getElementById('cur');
const curR = document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
(function animC(){
  rx+=(mx-rx)*.16;ry+=(my-ry)*.16;
  cur.style.cssText=`left:${mx}px;top:${my}px`;
  curR.style.cssText=`left:${rx}px;top:${ry}px`;
  requestAnimationFrame(animC);
})();
document.querySelectorAll('a,button,.faq-q,.work-card,.sb-link').forEach(el=>{
  el.addEventListener('mouseenter',()=>{curR.style.transform='translate(-50%,-50%) scale(2)';curR.style.opacity='.2'});
  el.addEventListener('mouseleave',()=>{curR.style.transform='translate(-50%,-50%) scale(1)';curR.style.opacity='.6'});
});

/* ── SMOOTH SCROLL ── */
function scrollTo(id){
  const el=document.getElementById(id);
  if(el)el.scrollIntoView({behavior:'smooth'});
}

/* ── SCROLL OBSERVER ── */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}
  });
},{threshold:.12});
document.querySelectorAll('.exp-item,.work-card,.svc-item,.about-card,.tech-item,.process-step,.faq-item,.fade-up,.fade-left,.fade-right').forEach(el=>io.observe(el));

/* ── ACTIVE NAV ── */
const sectionIds=['hero','experience','works','services','about','techstack','process','faqs','contact'];
const navLinks=document.querySelectorAll('.sb-link');
const secEls=sectionIds.map(id=>document.getElementById(id));
const navObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(l=>l.classList.remove('active'));
      const idx=sectionIds.indexOf(e.target.id);
      if(idx>-1&&navLinks[idx])navLinks[idx].classList.add('active');
    }
  });
},{threshold:.3});
secEls.forEach(s=>s&&navObs.observe(s));

/* ── FAQs ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement;
    const wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!wasOpen)item.classList.add('open');
  });
});

/* ── STAGGER delays on process ── */
document.querySelectorAll('.process-step').forEach((el,i)=>el.style.transitionDelay=`${i*.1}s`);

/* ── THEME TOGGLE (SIMPLE VERSION) ── */
const toggleBtn = document.getElementById('themeToggle');

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  toggleBtn.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
    toggleBtn.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    toggleBtn.textContent = '🌙';
  }
});