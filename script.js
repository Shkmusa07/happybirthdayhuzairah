'use strict';

/* ═══ CONFIG ═══ */
const CODE = '0707', MAX_TAPS = 4;

/* ═══ DOM ═══ */
const p1 = id('phase-1'), p2 = id('phase-2'), p3 = id('phase-3');
const envelope = id('envelope'), envFlap = id('env-flap'), envSeal = id('env-seal'), envLetter = id('env-letter');
const envHint = id('env-hint'), tapPips = qsa('.pip');
const curtain = id('flower-curtain'), curtL = id('curtain-left'), curtR = id('curtain-right'), curtMsg = id('curtain-msg');
const lockCard = id('lock-card'), pinErr = id('pin-err'), pinDots = qsa('.pdot');
const vbtn = id('vbtn'), vicon = id('vicon'), vwave = id('vwave'), vtime = id('vtime'), vaudio = id('vaudio');
function id(x) { return document.getElementById(x) }
function qsa(x) { return document.querySelectorAll(x) }

/* ═══════════════════════════════
   INJECT CSS SVG DECOR
═══════════════════════════════ */
function svgRedRose() { return `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="68" rx="30" ry="26" fill="#C0392B" opacity=".9"/><ellipse cx="40" cy="55" rx="21" ry="17" fill="#E74C3C" opacity=".88"/><ellipse cx="78" cy="53" rx="19" ry="16" fill="#E74C3C" opacity=".88"/><ellipse cx="60" cy="46" rx="17" ry="13" fill="#FF6B6B" opacity=".9"/><ellipse cx="60" cy="52" rx="11" ry="9" fill="#FFB3B3" opacity=".7"/><path d="M59 94Q60 138 61 144" stroke="#388E3C" stroke-width="4" stroke-linecap="round"/><ellipse cx="44" cy="118" rx="15" ry="7" fill="#66BB6A" transform="rotate(-28 44 118)"/><ellipse cx="76" cy="128" rx="13" ry="6" fill="#66BB6A" transform="rotate(22 76 128)"/></svg>` }
function svgSunflower(small) { const r = small ? 32 : 38, cr = small ? 18 : 22; return `<svg viewBox="0 0 140 180" xmlns="http://www.w3.org/2000/svg"><g transform="translate(70,65)">${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => `<ellipse cx="0" cy="${-r}" rx="${small ? 9 : 11}" ry="${small ? 16 : 20}" fill="${a % 60 === 0 ? '#F4A261' : '#F9C74F'}" transform="rotate(${a})"/>`).join('')}<circle cx="0" cy="0" r="${cr}" fill="#5D4037"/></g><path d="M70 87Q68 128 70 168" stroke="#388E3C" stroke-width="${small ? 4 : 5}" stroke-linecap="round"/><ellipse cx="50" cy="132" rx="${small ? 17 : 20}" ry="${small ? 9 : 10}" fill="#66BB6A" transform="rotate(-20 50 132)"/><ellipse cx="88" cy="148" rx="${small ? 15 : 18}" ry="${small ? 8 : 9}" fill="#66BB6A" transform="rotate(16 88 148)"/></svg>` }
id('deco-rr').innerHTML = svgRedRose();
id('deco-sf1').innerHTML = svgSunflower(false);
id('deco-sf2').innerHTML = svgSunflower(true);

/* ═══════════════════════════════
   PHASE 1 — 4-TAP ENVELOPE
═══════════════════════════════ */
let taps = 0, tapping = false;

envelope.addEventListener('click', onTap);
envelope.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') onTap(); });

function onTap() {
  if (tapping || taps >= MAX_TAPS) return;
  tapping = true; taps++;
  tapPips[taps - 1].classList.add('on');
  burstEmojis();

  if (taps === 1) { envFlap.classList.add('open') }
  else if (taps === 2) { envLetter.classList.add('rise'); envSeal.classList.add('gone') }
  else if (taps === 3) { envHint.textContent = 'one more ♡ 🌹'; envHint.style.color = '#C9918B' }
  else if (taps === MAX_TAPS) {
    envHint.style.opacity = '0';
    envelope.classList.add('bloom');
    setTimeout(openCurtain, 500);
    return;
  }
  setTimeout(() => { tapping = false; }, 360);
}

function burstEmojis() {
  const icons = ['🌸', '🌹', '🌺', '🌷', '🌼', '✿', '❀'];
  const rect = envelope.getBoundingClientRect();
  const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('span');
    el.className = 'e-petal';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    const ang = (Math.PI * 2 * i / 8) + Math.random() * .5;
    const dist = 55 + Math.random() * 70;
    el.style.left = `${cx - 12}px`; el.style.top = `${cy - 12}px`;
    el.style.setProperty('--ex', `${Math.cos(ang) * dist}px`);
    el.style.setProperty('--ey', `${Math.sin(ang) * dist}px`);
    el.style.fontSize = `${1.2 + Math.random() * .8}rem`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 950);
  }
}

/* ═══════════════════════════════
   FLOWER CURTAIN
═══════════════════════════════ */
/* SVG flower templates for curtain */
const FLOWER_SVGS = [
  // White rose
  (s) => `<svg width="${s}" height="${s}" viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="48" rx="22" ry="20" fill="#F5F0EE"/><ellipse cx="26" cy="36" rx="16" ry="13" fill="#EDE8E5"/><ellipse cx="54" cy="35" rx="15" ry="12" fill="#EDE8E5"/><ellipse cx="40" cy="30" rx="13" ry="10" fill="#FFF9F8"/><ellipse cx="40" cy="36" rx="8" ry="7" fill="#fff" opacity=".7"/><path d="M39 68Q40 82 41 85" stroke="#66BB6A" stroke-width="3" stroke-linecap="round"/><ellipse cx="30" cy="78" rx="9" ry="5" fill="#81C784" transform="rotate(-22 30 78)"/></svg>`,
  // Red rose
  (s) => `<svg width="${s}" height="${s}" viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="48" rx="22" ry="20" fill="#C0392B"/><ellipse cx="26" cy="36" rx="16" ry="13" fill="#E74C3C"/><ellipse cx="54" cy="35" rx="15" ry="12" fill="#E74C3C"/><ellipse cx="40" cy="30" rx="13" ry="10" fill="#FF6B6B"/><ellipse cx="40" cy="36" rx="8" ry="7" fill="#FFB3B3" opacity=".7"/><path d="M39 68Q40 82 41 85" stroke="#388E3C" stroke-width="3" stroke-linecap="round"/><ellipse cx="30" cy="78" rx="9" ry="5" fill="#66BB6A" transform="rotate(-22 30 78)"/></svg>`,
  // Cherry blossom
  (s) => `<svg width="${s}" height="${s}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="40" cy="22" rx="9" ry="14" fill="#FFB7C5" opacity=".9" transform="rotate(${a} 40 40)"/>`).join('')}<circle cx="40" cy="40" r="6" fill="#FFD700"/><circle cx="40" cy="40" r="3" fill="#FF8C00" opacity=".6"/></svg>`,
  // Peony
  (s) => `<svg width="${s}" height="${s}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="28" fill="#F4A7B9" opacity=".9"/><circle cx="40" cy="40" r="22" fill="#F48FB1" opacity=".85"/><circle cx="40" cy="40" r="16" fill="#F06292" opacity=".8"/><circle cx="40" cy="40" r="10" fill="#E91E63" opacity=".75"/><circle cx="40" cy="40" r="5" fill="#FFD54F"/></svg>`,
  // Sunflower small
  (s) => `<svg width="${s}" height="${s}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cx="40" cy="18" rx="7" ry="13" fill="#F9C74F" transform="rotate(${a} 40 40)"/>`).join('')}<circle cx="40" cy="40" r="14" fill="#6D4C1F"/></svg>`,
  // Daisy
  (s) => `<svg width="${s}" height="${s}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">${[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map(a => `<ellipse cx="40" cy="16" rx="6" ry="14" fill="white" stroke="#E0D0C0" stroke-width="1" transform="rotate(${a} 40 40)"/>`).join('')}<circle cx="40" cy="40" r="10" fill="#F9C74F"/></svg>`,
];

function openCurtain() {
  curtain.classList.remove('hidden');
  p1.classList.add('hidden');

  const vw = window.innerWidth, vh = window.innerHeight;
  // Spawn about 120 flowers randomly across screen
  const count = 120;

  for (let i = 0; i < count; i++) {
    const size = 60 + Math.floor(Math.random() * 60);
    const fIdx = Math.floor(Math.random() * FLOWER_SVGS.length);
    const wrap = document.createElement('div');
    wrap.className = 'cf';

    // Random absolute position
    wrap.style.left = `${Math.random() * 100}vw`;
    wrap.style.top = `${Math.random() * 100}vh`;

    wrap.style.setProperty('--cbase', `${(Math.random() - .5) * 15}deg`);
    wrap.style.setProperty('--ctip', `${(Math.random() - .5) * 25}deg`);
    wrap.style.animationDelay = `${Math.random() * 1.5}s`;
    wrap.style.animationDuration = `${3 + Math.random() * 2}s`;
    wrap.innerHTML = FLOWER_SVGS[fIdx](size);
    curtL.appendChild(wrap);
  }

  // Show center message after flowers start popping
  setTimeout(() => curtMsg.classList.add('show'), 800);

  // Sweep OUT (fade out flowers)
  setTimeout(sweepOutCurtain, 3800);
}

function sweepOutCurtain() {
  curtMsg.classList.remove('show');
  curtMsg.style.transition = 'opacity .5s ease';
  curtL.classList.add('out');

  setTimeout(() => {
    curtain.classList.add('hidden');
    curtL.innerHTML = '';
    curtL.classList.remove('out');
    curtMsg.classList.remove('show');
    p2.classList.remove('hidden');
  }, 1000);
}


/* ═══════════════════════════════
   PHASE 2 — NUMPAD PASSCODE
═══════════════════════════════ */
let pin = '';
document.querySelectorAll('.nk').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.dataset.v;
    if (v === 'del') { pin = pin.slice(0, -1) }
    else if (v !== undefined && pin.length < 4) { pin += v }
    updatePinDots();
    if (pin.length === 4) setTimeout(checkPin, 180);
  });
});

function updatePinDots() {
  pinDots.forEach((d, i) => d.classList.toggle('on', i < pin.length));
}
function checkPin() {
  if (pin === CODE) {
    pinErr.classList.remove('show');
    lockCard.classList.add('out');

    // Autoplay Spotify
    const sp = document.getElementById('spotify-player');
    if (sp) sp.src = sp.src + '&autoplay=1';

    setTimeout(() => {
      p2.classList.add('hidden');
      playFlowerTransition(() => {
        p3.classList.remove('hidden');
        initPhase3();
        spawnPetals();
      });
    }, 650);
  } else {
    lockCard.classList.remove('shake');
    void lockCard.offsetWidth;
    lockCard.classList.add('shake');
    pinErr.textContent = "That's not it… try again ♡";
    pinErr.classList.add('show');
    pin = ''; updatePinDots();
  }
}

function playFlowerTransition(callback) {
  const layer = document.getElementById('petal-layer');
  layer.innerHTML = '';
  for (let i = 0; i < 100; i++) {
    const size = 60 + Math.random() * 70;
    const fIdx = Math.floor(Math.random() * FLOWER_SVGS.length);
    const wrap = document.createElement('div');
    wrap.className = 'cf transition-flower';
    wrap.style.left = `${Math.random() * 100}vw`;
    wrap.style.top = `${Math.random() * 100}vh`;
    wrap.style.setProperty('--cbase', `${(Math.random() - .5) * 20}deg`);
    wrap.style.setProperty('--ctip', `${(Math.random() - .5) * 20}deg`);
    wrap.style.animationDelay = `${Math.random() * 0.3}s`;
    wrap.style.animationDuration = `1.4s`;
    wrap.innerHTML = FLOWER_SVGS[fIdx](size);
    layer.appendChild(wrap);
  }
  setTimeout(() => {
    layer.innerHTML = '';
    callback();
  }, 1500);
}

/* ═══════════════════════════════
   PHASE 3
═══════════════════════════════ */
function initPhase3() {
  buildPhotoWall();
  initScrollReveal();
  buildVoiceWave();
  initVoicePlayer();
  initGiftBox();
  initMovableCake();
  setTimeout(runCakeSequence, 300);
}

function initGiftBox() {
  const gb = document.getElementById('gift-box');
  const inner = document.getElementById('voice-player-inner');
  const wrap = document.getElementById('voice-wrap');
  if (!gb) return;
  gb.addEventListener('click', () => {
    gb.classList.add('open');
    setTimeout(() => {
      gb.style.display = 'none';
      inner.classList.remove('hidden');
      fireConfetti(wrap, 35);
    }, 800);
  });
}

function initMovableCake() {
  const stage = document.querySelector('.stage-3d');
  document.addEventListener('mousemove', (e) => {
    if (p3.classList.contains('hidden')) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    if (stage) {
      stage.style.setProperty('--mx', x);
      stage.style.setProperty('--my', y);
    }
  });
}

/* CAKE */
function runCakeSequence() {
  const hbl = id('hb-line'), hbn = id('hb-name'), cimg = id('cake-img');
  const casm = id('candle-asm'), cglow = id('cake-glow');
  setTimeout(() => hbl.classList.add('show'), 150);
  setTimeout(() => hbn.classList.add('show'), 650);
  setTimeout(() => cimg.classList.add('show'), 1100);
  setTimeout(() => {
    casm.classList.add('show');
    cglow.classList.add('show');
    fireConfetti(document.getElementById('confetti-box'), 70);
  }, 2000);
  // Show blow button after candle is fully visible
  setTimeout(() => initBlowCandle(), 2800);
}

function fireConfetti(box, count) {
  if (!box) return;
  const colors = ['#E8C4C0', '#C9918B', '#E8D5A8', '#B8A8C8', '#A8B8A0', '#F9C74F', '#fff', '#C0392B', '#FFB7C5'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'cc';
    const s = 5 + Math.random() * 9;
    c.style.cssText = `position:absolute;left:${4 + Math.random() * 92}%;top:-10px;width:${s}px;height:${s}px;background:${colors[i % colors.length]};border-radius:${Math.random() > .5 ? '50%' : '2px'};animation:ccFall ${1.6 + Math.random() * 2}s linear ${Math.random() * .8}s forwards;`;
    box.appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

/* PHOTO WALL — SCATTERED */
const MEMORIES = [
  { img: '0b3aa247-483b-4ab1-adc0-c00daa58f86b.JPG', cap: 'golden hour✨' },
  { img: '1e0b408f-722b-4f44-8d49-c70fbfdb58e5.JPG', cap: 'every new morning ☁️' },
  { img: '2d72396a-7b4e-4f90-9f46-91b7cb7e2661.JPG', cap: 'in full bloom, like you 🌸' },
  { img: 'IMG_1685.PNG', cap: 'lost in the deep 🌊' },
  { img: 'IMG_4949.jpg', cap: 'prettiest girl i ever seen💗' },
  { img: 'ae2c134e-5e44-4a89-a817-1c9ef97b8855.JPG', cap: 'secret garden 🌿' },
  { img: 'aec93b29-840c-4c2e-80c1-66f9b3816f00.JPG', cap: 'for you, forever 🌹' },
  { img: 'dd7de683-2717-4233-8829-9ec32cbccac1.JPG', cap: 'late night talks 🌙' },
  { img: 'e5bbce84-09dc-4751-88ad-78dfb8e342ab.JPG', cap: 'fields of lavender 💜' },
  { img: 'f9749392-10b4-4e93-9857-9f5d154dda1e.JPG', cap: 'chasing the northern lights 🌌' }
];

// Carefully placed positions [left%, top px, width px] — 3-col natural scatter
const POSITIONS = [
  { l: 2, t: 20, w: 200, r: -7 },
  { l: 36, t: 10, w: 185, r: 4 },
  { l: 68, t: 30, w: 195, r: -3 },
  { l: 6, t: 310, w: 190, r: 6 },
  { l: 38, t: 295, w: 210, r: -5 },
  { l: 70, t: 315, w: 185, r: 3 },
  { l: 3, t: 605, w: 205, r: -4 },
  { l: 36, t: 590, w: 190, r: 7 },
  { l: 69, t: 610, w: 195, r: -6 },
  { l: 5, t: 905, w: 185, r: 5 }
];

function buildPhotoWall() {
  const wall = id('photo-wall');
  MEMORIES.forEach((m, i) => {
    const pos = POSITIONS[i] || { l: 5 + Math.random() * 60, t: 200 + i * 120, w: 190, r: (Math.random() - .5) * 8 };
    const pol = document.createElement('div');
    pol.className = 'pol';
    pol.style.left = `${pos.l}%`;
    pol.style.top = `${pos.t}px`;
    pol.style.width = `${pos.w}px`;
    pol.style.setProperty('--pr', `${pos.r}deg`);
    pol.style.setProperty('--pol-from', `translateY(40px) rotate(${pos.r * 0.3}deg)`);
    pol.style.setProperty('--pol-to', `rotate(${pos.r}deg)`);
    pol.style.animationDelay = `${i * 0.1 + 0.3}s`;
    pol.style.animationFillMode = 'both';
    pol.style.zIndex = 10 + i;
    pol.innerHTML = `<div class="pol-art"><img src="${m.img}" alt="memory" /></div><div class="pol-cap">${m.cap}</div>`;
    pol.addEventListener('mouseenter', () => {
      pol.style.transform = `rotate(0deg) scale(1.1)`;
      pol.style.zIndex = '200';
    });
    pol.addEventListener('mouseleave', () => {
      pol.style.transform = `rotate(${pos.r}deg) scale(1)`;
      pol.style.zIndex = String(10 + i);
    });
    wall.appendChild(pol);
  });
  // Set wall height
  const lastPos = POSITIONS[POSITIONS.length - 1];
  wall.style.minHeight = `${lastPos.t + 300}px`;
}

/* SCROLL REVEAL */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .12 });
  document.querySelectorAll('.sr').forEach(el => obs.observe(el));
}

/* VOICE */
function buildVoiceWave() {
  for (let i = 0; i < 32; i++) {
    const b = document.createElement('div');
    b.className = 'vbar';
    const h = 5 + Math.random() * 26;
    b.style.height = `${h}px`;
    b.style.setProperty('--vh', `${h}px`);
    b.style.animationDelay = `${(i * .05).toFixed(2)}s`;
    vwave.appendChild(b);
  }
}

function initVoicePlayer() {
  let playing = false, simIv = null, simT = 0;
  vbtn.addEventListener('click', () => {
    if (!playing) {
      playing = true; vicon.textContent = '❚❚'; vwave.classList.add('playing');
      vaudio.play().catch(() => simulate());
    } else {
      playing = false; vicon.textContent = '▶'; vwave.classList.remove('playing');
      vaudio.pause(); clearInterval(simIv);
    }
  });
  vaudio.addEventListener('timeupdate', () => {
    const t = vaudio.currentTime;
    vtime.textContent = `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  });
  vaudio.addEventListener('ended', () => { playing = false; vicon.textContent = '▶'; vwave.classList.remove('playing'); });

  function simulate() {
    simT = 0; clearInterval(simIv);
    simIv = setInterval(() => {
      if (!playing) { clearInterval(simIv); return; }
      simT++;
      vtime.textContent = `${Math.floor(simT / 60)}:${String(simT % 60).padStart(2, '0')}`;
      if (simT >= 45) { clearInterval(simIv); playing = false; vicon.textContent = '▶'; vwave.classList.remove('playing'); vtime.textContent = '0:00'; }
    }, 1000);
  }
}

/* PETALS */
function spawnPetals() {
  const layer = id('petal-layer');
  const cols = ['#E8C4C0', '#FFB7C5', '#fff', '#F9C74F', '#B8A8C8', '#C0392B22', '#A8B8A0'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const s = 7 + Math.random() * 13;
    p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;background:${cols[i % cols.length]};animation-duration:${10 + Math.random() * 14}s;animation-delay:${Math.random() * 14}s;--pd:${(Math.random() - .5) * 180}px;`;
    layer.appendChild(p);
  }
}

/* ═══════════════════════════════
   BLOW CANDLE — MICROPHONE FEATURE
═══════════════════════════════ */
function initBlowCandle() {
  const blowWrap = id('blow-btn-wrap');
  const blowBtn = id('blow-btn');
  const blowHint = id('blow-hint');
  const candleAsm = id('candle-asm');
  const cakeGlow = id('cake-glow');
  const confBox = id('confetti-box');

  if (!blowWrap || !blowBtn) return;

  // Show the button after candle appears (called from runCakeSequence)
  blowWrap.style.display = 'flex';

  let audioCtx = null, analyser = null, micStream = null, animFrame = null;
  let isListening = false, blown = false;

  // Build meter UI dynamically
  const meter = document.createElement('div');
  meter.className = 'blow-meter';
  const meterFill = document.createElement('div');
  meterFill.className = 'blow-meter-fill';
  meter.appendChild(meterFill);
  blowWrap.appendChild(meter);
  meter.style.display = 'none';

  blowBtn.addEventListener('click', async () => {
    if (blown || isListening) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStream = stream;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);

      isListening = true;
      blowBtn.classList.add('listening');
      blowBtn.querySelector('.blow-label').textContent = 'Listening… 🎤';
      blowHint.textContent = 'Now blow hard into your mic! 💨💨💨';
      meter.style.display = 'block';

      const dataArr = new Uint8Array(analyser.frequencyBinCount);
      let blowFrames = 0;
      const BLOW_THRESHOLD = 80;   // RMS threshold (0-255)
      const BLOW_FRAMES_NEEDED = 8; // consecutive frames above threshold

      function detectBlow() {
        if (blown) return;
        analyser.getByteFrequencyData(dataArr);

        // Compute RMS of audio data
        let sum = 0;
        for (let i = 0; i < dataArr.length; i++) sum += dataArr[i] * dataArr[i];
        const rms = Math.sqrt(sum / dataArr.length);

        // Update meter
        const pct = Math.min(100, (rms / BLOW_THRESHOLD) * 70);
        meterFill.style.width = `${pct}%`;

        if (rms > BLOW_THRESHOLD) {
          blowFrames++;
          if (blowFrames >= BLOW_FRAMES_NEEDED) {
            blowOut();
            return;
          }
        } else {
          blowFrames = Math.max(0, blowFrames - 1);
        }

        animFrame = requestAnimationFrame(detectBlow);
      }

      detectBlow();

    } catch (err) {
      // Mic denied or not available
      blowHint.textContent = 'Mic not available. Click here to blow manually! 💨';
      blowBtn.querySelector('.blow-label').textContent = 'Click to blow! 💨';
      blowBtn.onclick = blowOut;
    }
  });

  function blowOut() {
    if (blown) return;
    blown = true;
    isListening = false;

    // Stop microphone
    if (animFrame) cancelAnimationFrame(animFrame);
    if (micStream) micStream.getTracks().forEach(t => t.stop());
    if (audioCtx) audioCtx.close();

    // Extinguish candle
    candleAsm.classList.add('blown');
    cakeGlow.classList.add('blown');

    // Smoke particles
    createSmoke(candleAsm);

    // Meter fill briefly to 100% then disappear
    meterFill.style.width = '100%';
    meter.style.transition = 'opacity 0.6s ease 0.5s';
    meter.style.opacity = '0';

    // Update button
    blowBtn.classList.remove('listening');
    blowBtn.style.background = 'linear-gradient(135deg, #A8B8A0, #7a9070)';
    blowBtn.querySelector('.blow-icon').textContent = '✨';
    blowBtn.querySelector('.blow-label').textContent = 'Candle blown out!';
    blowBtn.style.pointerEvents = 'none';

    // Celebration message
    const msg = document.createElement('p');
    msg.className = 'blown-msg';
    msg.textContent = 'Happy Birthday to my favourite person!✨🎂';
    blowWrap.appendChild(msg);

    // Big confetti burst
    setTimeout(() => {
      fireConfetti(confBox, 120);
      blowHint.textContent = 'Yayyyyyyyyyyyyyyyyyyyyyyyyy';
    }, 400);
  }

  function createSmoke(parent) {
    const rect = parent.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
      const puff = document.createElement('div');
      puff.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2 - 8 + (Math.random() - 0.5) * 10}px;
        top: ${rect.top - 10}px;
        width: ${8 + Math.random() * 10}px;
        height: ${8 + Math.random() * 10}px;
        background: rgba(180,180,180,${0.5 + Math.random() * 0.3});
        border-radius: 50%;
        pointer-events: none;
        z-index: 999;
        animation: none;
        transition: transform ${0.8 + Math.random() * 0.6}s ease-out, opacity ${0.8 + Math.random() * 0.6}s ease-out;
      `;
      document.body.appendChild(puff);
      requestAnimationFrame(() => {
        puff.style.transform = `translate(${(Math.random() - 0.5) * 40}px, -${40 + Math.random() * 40}px) scale(3)`;
        puff.style.opacity = '0';
      });
      setTimeout(() => puff.remove(), 1500);
    }
  }
}

