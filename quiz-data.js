/* ============================================================
   FACE FILES — quiz data model
   Edit the sections marked 🔁 — everything else is engine logic.
   ============================================================ */

/* 🔁 PATH A — Natural Alignment lane names.
   3 undertones × 3 contrasts = 9 outcomes. Placeholder names,
   rename any cell, the engine just reads whatever string is here. */
const PATH_A_LANES = {
  cool:    { high: 'Sharp Frost',  medium: 'Soft Frost',  low: 'Faded Frost'  },
  neutral: { high: 'Sharp Static', medium: 'Soft Static', low: 'Faded Static' },
  warm:    { high: 'Sharp Glow',   medium: 'Soft Glow',   low: 'Faded Glow'   },
};

/* 🔁 PATH A — starter color-theory notes per lane. */
const PATH_A_NOTES = {
  cool:    { high: 'crisp jewel tones and true black, no orange-based anything, it will fight you.',
             medium: 'cool berries, plums, silvery taupes. blends the most natural on you.',
             low: 'soft cool pastels and icy neutrals. anything louder and it overpowers you.' },
  neutral: { high: 'true reds, deep browns, most metals. your undertone barely fights anything.',
             medium: 'rosy nudes and balanced browns, your easiest zone, basically foolproof.',
             low: 'muted dusty neutrals over anything saturated, that\'s your sweet spot.' },
  warm:    { high: 'rich terracotta, warm brown, gold, let your natural warmth pop instead of fighting it.',
             medium: 'peachy, honeyed, olive-leaning shades, the most natural extension of you.',
             low: 'soft peaches and warm taupe, close to your natural tone, never heavy-handed.' },
};

/* 🔁 PATH B — locked personas. */
const PATH_B_LANES = {
  deepWinter:       { name: 'Deep Winter Vixen',
                       desc: 'high contrast, cool-toned. sharp blacks, deep berries, icy tones, full glam canvas.' },
  goldenAutumn:     { name: 'Golden Autumn Goddess',
                       desc: 'medium contrast, warm-toned. rich olive, terracotta, spiced pumpkin, warm chocolate brown.' },
  softSpringSummer: { name: 'Soft Spring/Summer Angel',
                       desc: 'low contrast, muted and bright. soft pink, pale peach, light taupe, airy blurred edges.' },
};

/* 🔁 MUSE PHOTO POOL — Path B's picker. 3 tiles per color story so a
   3-pick spreads naturally. These are placeholder gradients standing
   in for real photos — swap the `img` field for a real image path
   whenever you've got one, the `grad` fallback just disappears once
   `img` actually loads. */
const MUSE_TILES = [
  { id: 'dw1', story: 'deepWinter', label: 'sharp & sultry', img: '', grad: 'linear-gradient(160deg,#16121c,#3a1530 70%)' },
  { id: 'dw2', story: 'deepWinter', label: 'icy glam', img: '', grad: 'linear-gradient(160deg,#1b1b2e,#5b1d4a 70%)' },
  { id: 'dw3', story: 'deepWinter', label: 'high contrast', img: '', grad: 'linear-gradient(160deg,#0e0e14,#421f3d 70%)' },
  { id: 'ga1', story: 'goldenAutumn', label: 'spiced & warm', img: '', grad: 'linear-gradient(160deg,#6b3a1c,#c9802f 70%)' },
  { id: 'ga2', story: 'goldenAutumn', label: 'golden hour', img: '', grad: 'linear-gradient(160deg,#7a4a1f,#e0a44d 70%)' },
  { id: 'ga3', story: 'goldenAutumn', label: 'olive & terracotta', img: '', grad: 'linear-gradient(160deg,#4d3a1e,#a9692f 70%)' },
  { id: 'ss1', story: 'softSpringSummer', label: 'soft & airy', img: '', grad: 'linear-gradient(160deg,#f3cdd6,#fbe8e0 70%)' },
  { id: 'ss2', story: 'softSpringSummer', label: 'pale & pretty', img: '', grad: 'linear-gradient(160deg,#f6d9e6,#fff2e8 70%)' },
  { id: 'ss3', story: 'softSpringSummer', label: 'blurred edges', img: '', grad: 'linear-gradient(160deg,#eecbe0,#f8e3d9 70%)' },
];

/* 🔁 PAGE MAP — links each answer to an ebook page. 'TBD' = not written yet. */
const PAGE_MAP = {
  brow:      { thin: 'TBD', thick: 'TBD', fluffy: 'TBD', laminated: 'TBD' },
  eye:       { hooded: 15, downturned: 'TBD', almond: 'TBD' },
  structure: { chin: 22, nose: 'TBD', forehead: 'TBD', undereye: 'TBD', balanced: 'TBD' },
  personaB:  { deepWinter: 8, goldenAutumn: 'TBD', softSpringSummer: 'TBD' },
};

/* ============================================================
   QUESTION DEFINITIONS
   type: 'single' (default) | 'musePick' (multi-select photos) | 'museFinal' (gut-check)
   path: 'all' | 'A' | 'B'
   ============================================================ */
const QUESTIONS = [
  {
    id: 'fork', path: 'all',
    prompt: 'okay bestie, pick your lane',
    sub: 'before we touch a single brush. this decides how the rest of this goes, so actually think about it.',
    options: [
      { value: 'A', swatch: 'var(--frost)', label: 'Work With My Natural Stuff',
        desc: 'I want my actual undertone and contrast to finally make sense. no gimmicks.' },
      { value: 'B', swatch: 'var(--magenta)', label: 'Let Me Pick A Whole Vibe',
        desc: 'I want a specific aesthetic, even if it\'s not 100% "me" on paper.' },
    ],
  },
  {
    id: 'undertone', path: 'A',
    prompt: 'girl, what\'s your undertone',
    sub: 'flip your wrist over, check your veins in actual daylight. your bathroom light is lying to you.',
    options: [
      { value: 'cool', swatch: '#8fb6e8', label: 'Cool', desc: 'veins are blue/purple, you burn before you tan, gold jewelry kind of clashes.' },
      { value: 'warm', swatch: '#e8b06b', label: 'Warm', desc: 'veins look greenish, you tan in five minutes flat, gold jewelry just glows on you.' },
      { value: 'neutral', swatch: '#c9bfaf', label: 'Neutral', desc: 'it\'s giving both honestly, depends on the season.' },
    ],
  },
  {
    id: 'contrast', path: 'A',
    prompt: 'now be honest about your contrast',
    sub: 'how far apart are your skin, hair, and eyes. like actually, no rounding up.',
    options: [
      { value: 'high', swatch: '#1a1a1a', label: 'High contrast', desc: 'your features just pop. dark hair, light skin energy, or the reverse.' },
      { value: 'medium', swatch: '#9b7a55', label: 'Medium contrast', desc: 'balanced. nothing\'s screaming over anything else.' },
      { value: 'low', swatch: '#d8cdb8', label: 'Low contrast', desc: 'everything blends. hair, skin, eyes all sitting close in depth.' },
    ],
  },
  {
    id: 'musePick', path: 'B', type: 'musePick',
    prompt: 'pick the pics that are giving YOU',
    sub: 'grab at least 3 you\'re drawn to. don\'t overthink it, just go with your gut.',
  },
  {
    id: 'museFinal', path: 'B', type: 'museFinal',
    prompt: 'okay but if you could only keep ONE',
    sub: 'no overthinking. just point.',
  },
  {
    id: 'aesthetic', path: 'all',
    prompt: 'what kind of girl are you, fr',
    sub: 'pick whatever\'s calling your name right now.',
    options: [
      { value: 'cleanGirl', swatch: '#e9ddc8', label: 'Clean Girl', desc: 'slicked bun, gold hoops, one lip oil doing the absolute most.' },
      { value: 'alt', swatch: '#2b2b35', label: 'Alt', desc: 'you would die before owning a beige anything.' },
      { value: 'emo', swatch: '#3a1f2e', label: 'Emo', desc: 'eyeliner is a personality trait. every playlist has a sad bridge.' },
      { value: 'whimsical', swatch: '#d9c2e8', label: 'Whimsical', desc: 'one bad day from buying a fairy costume and wearing it to target.' },
    ],
  },
  {
    id: 'brow', path: 'all',
    prompt: 'girl, what are the brows giving',
    sub: 'forget what you\'ve got right now. what brow is part of the rebrand.',
    options: [
      { value: 'thin', swatch: '#cbb892', label: 'Thin Brow Girl', desc: 'soft, barely-there, downtown model who skipped breakfast.' },
      { value: 'thick', swatch: '#6b5538', label: 'Thick Brow Girl', desc: 'full, a little wild, zero filling required.' },
      { value: 'fluffy', swatch: '#9c8462', label: 'Fluffy Brow Girl', desc: 'brushed up, undone on purpose, soap brow\'s whole personality.' },
      { value: 'laminated', swatch: '#caa86b', label: 'Laminated Brow Girl', desc: 'salon-lift look, glossy, set in place all damn day.' },
    ],
  },
  {
    id: 'eye', path: 'all',
    prompt: 'now be real about your eye shape',
    sub: 'an eyeshadow look goes muddy on you if it wasn\'t built for your actual lid.',
    options: [
      { value: 'hooded', swatch: 'var(--lavender)', label: 'Hooded / monolid', desc: 'crease basically disappears when your eyes are open.' },
      { value: 'downturned', swatch: 'var(--cyan)', label: 'Downturned / deep-set', desc: 'outer corners dip down, or your eyes sit back a little.' },
      { value: 'almond', swatch: 'var(--pink)', label: 'Almond / round', desc: 'full crease, tons of lid space to actually play with.' },
    ],
  },
  {
    id: 'structure', path: 'all',
    prompt: 'pick your one thing',
    sub: 'the one feature you actually want your makeup working for you on.',
    options: [
      { value: 'chin', swatch: '#d6a4c4', label: 'Recessed chin', desc: 'projecting that jaw forward, no more weak chin angles.' },
      { value: 'nose', swatch: '#c4d6a4', label: 'Nose focus', desc: 'softening, streamlining, less center of attention.' },
      { value: 'forehead', swatch: '#a4c4d6', label: 'Big forehead', desc: 'visually lowering the hairline, balancing things out.' },
      { value: 'undereye', swatch: '#cfa4d6', label: 'Under-eye hollows', desc: 'the tired, no-sleep look isn\'t the vibe, let\'s fix it.' },
      { value: 'balanced', swatch: '#d6cba4', label: 'Nothing, I\'m good', desc: 'just cheekbones and a glow, no correcting needed.' },
    ],
  },
  {
    id: 'maintenance', path: 'all',
    prompt: 'how much effort are we actually giving',
    sub: 'be honest, this isn\'t a test and nobody\'s judging you either way.',
    options: [
      { value: 'high', swatch: 'var(--magenta)', label: 'I\'m built for the process', desc: '30 to 45 minutes, setting spray, precision. make it bulletproof.' },
      { value: 'lowmed', swatch: 'var(--frost)', label: '10 minutes or I\'m out', desc: 'hourly touch ups and I\'m simply not doing it.' },
    ],
  },
  {
    id: 'budget', path: 'all',
    prompt: 'where are we shopping',
    sub: 'no judgment either way, just be real.',
    options: [
      { value: 'drugstore', swatch: 'var(--lime)', label: 'Drugstore girlies', desc: 'find me the gems hiding at cvs and target.' },
      { value: 'highend', swatch: 'var(--lavender)', label: 'Treat myself', desc: 'sephora, ulta, the whole splurge.' },
    ],
  },
];

/* 🔁 Fun flavor notes for the "what kind of girl" question — shown in
   the result, no ebook page tied to these, just personality seasoning. */
const VIBE_NOTES = {
  cleanGirl: 'minimal, dewy, your whole bag fits in a zip pouch and that\'s on purpose.',
  alt: 'texture, depth, a little grunge, in the best possible way.',
  emo: 'liner sharp enough to cut glass, moody undertones, no notes.',
  whimsical: 'sparkle, color, whatever feels like main character energy that day.',
};

/* ============================================================
   DERIVE RESULT from collected answers
   ============================================================ */
function deriveResult(answers) {
  const path = answers.fork;
  let lane, laneDesc, goldenRule = null, flavor = null;

  if (path === 'A') {
    lane = PATH_A_LANES[answers.undertone][answers.contrast];
    laneDesc = PATH_A_NOTES[answers.undertone][answers.contrast];
  } else {
    const p = PATH_B_LANES[answers.persona];
    lane = p.name;
    laneDesc = p.desc;
    goldenRule = `you locked into ${p.name}, so you're committed to ${p.desc.split(',')[0]}. no sneaking in tones from a different lane, that's exactly what turns a look muddy.`;
    flavor = answers.museFlavor || null;
  }

  const believesIn = answers.maintenance === 'high' ? 'The full ritual' : '10 min, max';

  const breakdown = [
    { label: 'Brow plan', note: browNote(answers.brow), page: PAGE_MAP.brow[answers.brow] },
    { label: 'Eye technique', note: eyeNote(answers.eye), page: PAGE_MAP.eye[answers.eye] },
    { label: 'Structural fix', note: structureNote(answers.structure), page: PAGE_MAP.structure[answers.structure] },
    { label: 'Budget lane', note: answers.budget === 'drugstore' ? 'Drugstore shopping list' : 'Luxury staples shopping list', page: 'TBD' },
    { label: 'Your whole vibe', note: VIBE_NOTES[answers.aesthetic], page: 'TBD' },
  ];

  if (path === 'B' && PAGE_MAP.personaB[answers.persona]) {
    breakdown.unshift({ label: 'Cohesion rule', note: 'how to wear this lane no matter your natural coloring', page: PAGE_MAP.personaB[answers.persona] });
  }

  return { path, lane, laneDesc, goldenRule, believesIn, breakdown, flavor };
}

function browNote(v) {
  return { thin: 'soft pencil strokes, barely-there finish', thick: 'full natural shape, just a clear gel', fluffy: 'brushed up with tinted soap, undone on purpose', laminated: 'salon-lift gloss, set hard, lasts all day' }[v];
}
function eyeNote(v) {
  return { hooded: 'high-placement blending technique', downturned: 'lifting cat-eye correction', almond: 'classic contouring, standard technique' }[v];
}
function structureNote(v) {
  return {
    chin: 'highlight and contour to project the jaw forward',
    nose: 'strategic shading to streamline the shape',
    forehead: 'shade to visually lower the hairline',
    undereye: 'targeted correction for volume and shadow',
    balanced: 'clean cheekbone sculpt and glow, nothing corrective',
  }[v];
}
