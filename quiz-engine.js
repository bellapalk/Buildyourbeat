/* ============================================================
   FACE FILES — quiz engine
   ============================================================ */

const state = {
  answers: {},
  musePicks: [],    // ids of tiles picked in the musePick step
  history: [],
  step: 'welcome',
};

const root = document.getElementById('quiz-root');

function visibleQuestions() {
  const path = state.answers.fork;
  return QUESTIONS.filter(q => q.path === 'all' || q.path === path);
}

function currentIndex() {
  return visibleQuestions().findIndex(q => q.id === state.step);
}

function totalSteps() {
  return visibleQuestions().length + 1; // +1 for contact step
}

function progressIndex() {
  if (state.step === 'welcome') return 0;
  if (state.step === 'contact' || state.step === 'result') return totalSteps();
  return currentIndex() + 1;
}

function goNext() {
  if (state.step === 'welcome') {
    state.step = 'fork';
  } else {
    state.history.push(state.step);
    const qs = visibleQuestions();
    const idx = qs.findIndex(q => q.id === state.step);
    if (idx < qs.length - 1) {
      state.step = qs[idx + 1].id;
    } else {
      state.step = 'contact';
    }
  }
  render();
}

function goBack() {
  if (state.history.length === 0) { state.step = 'welcome'; render(); return; }
  state.step = state.history.pop();
  render();
}

function selectAnswer(qid, value) {
  state.answers[qid] = value;
  setTimeout(goNext, 180);
  render(true);
}

/* ---- muse multi-pick ---- */
function toggleMuseTile(id) {
  const i = state.musePicks.indexOf(id);
  if (i > -1) state.musePicks.splice(i, 1);
  else state.musePicks.push(id);
  render(true);
}

/* ---- muse gut-check (final, decisive pick) ---- */
function selectMuseFinal(id) {
  const tile = MUSE_TILES.find(t => t.id === id);
  state.answers.persona = tile.story;
  state.answers.museFlavor = buildMuseFlavor(tile.story);
  setTimeout(goNext, 180);
  render(true);
}

function buildMuseFlavor(finalStory) {
  const pickedTiles = state.musePicks.map(id => MUSE_TILES.find(t => t.id === id));
  const counts = {};
  pickedTiles.forEach(t => { counts[t.story] = (counts[t.story] || 0) + 1; });
  const distinctStories = Object.keys(counts);
  if (distinctStories.length <= 1) return null; // no tension to report
  const otherStories = distinctStories.filter(s => s !== finalStory);
  if (otherStories.length === 0) return null;
  const name = s => PATH_B_LANES[s].name;
  return `you were pulling toward ${otherStories.map(name).join(' and ')} too, but ${name(finalStory)} won when it came down to one.`;
}

/* ============================================================
   RENDER
   ============================================================ */
function render(skipMain) {
  renderProgress();
  if (skipMain) {
    // still need to refresh the live bits without a full re-render jump
    if (state.step === 'musePick') return refreshMusePick();
    return render(false);
  }

  if (state.step === 'welcome') return renderWelcome();
  if (state.step === 'contact') return renderContact();
  if (state.step === 'result') return renderResult();
  if (state.step === 'musePick') return renderMusePick();
  if (state.step === 'museFinal') return renderMuseFinal();
  return renderQuestion();
}

function renderProgress() {
  const bar = document.getElementById('quiz-progress');
  if (!bar) return;
  const total = totalSteps();
  const idx = progressIndex();
  bar.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const seg = document.createElement('div');
    seg.className = 'quiz-progress__seg' + (i < idx ? ' done' : i === idx ? ' active' : '');
    bar.appendChild(seg);
  }
}

function renderWelcome() {
  root.innerHTML = `
    <div class="quiz-welcome">
      <span class="label-tag">FACE FILES</span>
      <h1 class="display" style="font-size: clamp(34px,6vw,52px); color: var(--card); margin: 22px 0 16px;">
        Open a new file.
      </h1>
      <p style="color: var(--frost); max-width: 460px; margin: 0 auto 30px; line-height: 1.7; font-size: 16px;">
        okay so real talk. stop letting some girl on your fyp tell you how to do your makeup
        when her face isn't your face. this maps your actual undertone, your actual features,
        and your actual vibe, then hands you the exact routine for you. two minutes, promise.
      </p>
      <button class="btn btn-primary" onclick="goNext()">Let's Get Into It →</button>
    </div>
  `;
}

function thumbHtml(opt) {
  const bg = opt.img ? `background-image:url('${opt.img}'); background-color:${opt.swatch};` : `background:${opt.swatch};`;
  return `<span class="option-card__thumb" style="${bg}">${opt.img ? '' : '📷'}</span>`;
}

function renderQuestion() {
  const q = QUESTIONS.find(q => q.id === state.step);
  const selected = state.answers[q.id];

  root.innerHTML = `
    <span class="quiz-eyebrow">FILE ${String(currentIndex() + 1).padStart(2, '0')} OF ${visibleQuestions().length}</span>
    <h2 class="quiz-prompt">${q.prompt}</h2>
    <p class="quiz-subprompt">${q.sub}</p>
    <div class="quiz-options">
      ${q.options.map(opt => `
        <button class="option-card ${selected === opt.value ? 'selected' : ''}" onclick="selectAnswer('${q.id}','${opt.value}')">
          ${thumbHtml(opt)}
          <span class="option-card__text"><strong>${opt.label}</strong><span>${opt.desc}</span></span>
        </button>
      `).join('')}
    </div>
    <div class="quiz-nav">
      <button class="quiz-back" onclick="goBack()">← back</button>
    </div>
  `;
}

/* ---- muse pick (multi-select grid) ---- */
function renderMusePick() {
  root.innerHTML = `
    <span class="quiz-eyebrow">FILE ${String(currentIndex() + 1).padStart(2, '0')} OF ${visibleQuestions().length}</span>
    <h2 class="quiz-prompt">pick the pics that are giving YOU</h2>
    <p class="quiz-subprompt">grab at least 3 you're drawn to. don't overthink it, just go with your gut.</p>
    <div class="muse-count" id="muse-count"></div>
    <div class="muse-grid" id="muse-grid"></div>
    <div class="quiz-nav">
      <button class="quiz-back" onclick="goBack()">← back</button>
      <button class="btn btn-primary" id="muse-continue" style="display:none;" onclick="goNext()">Continue →</button>
    </div>
  `;
  refreshMusePick();
}

function refreshMusePick() {
  const grid = document.getElementById('muse-grid');
  if (!grid) return;
  grid.innerHTML = MUSE_TILES.map(t => {
    const picked = state.musePicks.includes(t.id);
    const bg = t.img ? `background-image:url('${t.img}');` : `background:${t.grad};`;
    return `
      <div class="muse-tile ${picked ? 'picked' : ''}" style="${bg}" onclick="toggleMuseTile('${t.id}')">
        <span class="muse-tile__check">${picked ? '✓' : ''}</span>
        <span class="muse-tile__label">${t.label}</span>
      </div>
    `;
  }).join('');

  const n = state.musePicks.length;
  document.getElementById('muse-count').innerHTML = `<strong>${n}</strong> picked. ${n < 3 ? 'grab at least ' + (3 - n) + ' more' : 'keep going or hit continue'}`;
  document.getElementById('muse-continue').style.display = n >= 3 ? 'inline-flex' : 'none';
}

/* ---- muse gut-check ---- */
function renderMuseFinal() {
  const tiles = state.musePicks.map(id => MUSE_TILES.find(t => t.id === id));
  root.innerHTML = `
    <span class="quiz-eyebrow">FILE ${String(currentIndex() + 1).padStart(2, '0')} OF ${visibleQuestions().length}</span>
    <h2 class="quiz-prompt">okay but if you could only keep ONE</h2>
    <p class="quiz-subprompt">no overthinking. just point.</p>
    <div class="muse-grid" style="grid-template-columns: repeat(${Math.min(tiles.length,3)}, 1fr);">
      ${tiles.map(t => {
        const bg = t.img ? `background-image:url('${t.img}');` : `background:${t.grad};`;
        return `<div class="muse-tile" style="${bg}" onclick="selectMuseFinal('${t.id}')">
                  <span class="muse-tile__label">${t.label}</span>
                </div>`;
      }).join('')}
    </div>
    <div class="quiz-nav">
      <button class="quiz-back" onclick="goBack()">← back</button>
    </div>
  `;
}

function renderContact() {
  root.innerHTML = `
    <span class="quiz-eyebrow">LAST FILE</span>
    <h2 class="quiz-prompt">where should we send it</h2>
    <p class="quiz-subprompt">your blueprint gets built the second you hit submit.</p>

    <form id="quiz-form" name="face-files-quiz" method="POST" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="face-files-quiz" />
      <p style="display:none;"><label>Don't fill this out: <input name="bot-field" /></label></p>

      <div class="field-row">
        <label for="qf-name">First name</label>
        <input id="qf-name" name="name" type="text" required />
      </div>
      <div class="field-row">
        <label for="qf-email">Email</label>
        <input id="qf-email" name="email" type="email" required />
      </div>

      <input type="hidden" name="answers" id="qf-answers" />

      <div class="quiz-nav">
        <button class="quiz-back" type="button" onclick="goBack()">← back</button>
        <button class="btn btn-primary" type="submit">Build My Beat Blueprint →</button>
      </div>
    </form>
  `;

  document.getElementById('quiz-form').addEventListener('submit', function (e) {
    e.preventDefault();
    state.answers.name = document.getElementById('qf-name').value;
    state.answers.email = document.getElementById('qf-email').value;
    document.getElementById('qf-answers').value = JSON.stringify(state.answers);

    const formData = new FormData(e.target);
    fetch('/', { method: 'POST', body: new URLSearchParams(formData) }).catch(() => {});

    state.step = 'result';
    render();
  });
}

function renderResult() {
  const r = deriveResult(state.answers);

  root.innerHTML = `
    <div style="text-align:center; margin-bottom: 30px;">
      <span class="label-tag">FILE COMPLETE</span>
      <h2 class="quiz-prompt" style="margin-top:18px;">your Face File is open.</h2>
    </div>

    <div style="display:flex; justify-content:center; margin-bottom: 36px;">
      <div class="id-card">
        <div class="id-card__header">
          <div class="id-card__brand">FACE FILES &amp; CO.</div>
          <div class="id-card__valid">VALID:<br>2026 – forever</div>
        </div>
        <div class="id-card__body">
          <div class="id-card__fields">
            <div class="id-card__field">
              <div class="id-card__field-label">Name</div>
              <div class="id-card__field-value">${escapeHtml(state.answers.name || 'You')}</div>
            </div>
            <div class="id-card__field">
              <div class="id-card__field-label">Your Lane</div>
              <div class="id-card__field-value">${r.lane}</div>
            </div>
            <div class="id-card__field">
              <div class="id-card__field-label">Believes In</div>
              <div class="id-card__field-value">${r.believesIn}</div>
            </div>
          </div>
          <div class="id-card__photo">
            <span class="corner tl"></span><span class="corner tr"></span>
            <span class="corner bl"></span><span class="corner br"></span>
          </div>
        </div>
        <div class="stamp">
          <svg viewBox="0 0 100 100">
            <defs><path id="stampCircle2" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"/></defs>
            <circle cx="50" cy="50" r="38" stroke-width="1.5"/>
            <circle cx="50" cy="50" r="30" stroke-width="1"/>
            <text><textPath href="#stampCircle2" startOffset="2%">CERTIFIED · YOUR FACE · YOUR FILE ·</textPath></text>
          </svg>
        </div>
      </div>
    </div>

    <p style="color:var(--frost); text-align:center; max-width: 480px; margin: 0 auto 10px; line-height:1.7;">
      ${r.laneDesc}
    </p>

    ${r.flavor ? `<p style="color:var(--lime); text-align:center; font-size:13.5px; max-width:460px; margin:0 auto 6px;">${r.flavor}</p>` : ''}

    ${r.goldenRule ? `<div class="golden-rule"><strong>the rule:</strong> ${r.goldenRule}</div>` : ''}

    <div style="margin-top: 30px;">
      ${r.breakdown.map(row => `
        <div class="result-row">
          <div class="result-row__page">${row.page === 'TBD' ? 'pg TBD' : 'PG ' + row.page}</div>
          <div class="result-row__body"><strong>${row.label}</strong><span>${row.note}</span></div>
        </div>
      `).join('')}
    </div>

    <p style="color:var(--frost); text-align:center; font-size:13px; margin-top:18px;">
      this whole breakdown is heading to your inbox right now. want the full vault instead of waiting around?
    </p>
    <div style="text-align:center; margin-top: 18px;">
      <a class="btn btn-primary" href="shop.html">Get The Full Vault →</a>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

render();
