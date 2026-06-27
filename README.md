# Build Your Beat, with Bella

## Deploy it
Drag this whole folder into Netlify (app.netlify.com → "Add new site" →
"Deploy manually"), or push it to a GitHub repo and connect that repo in
Netlify. No build step, no dependencies — it's plain HTML/CSS/JS.

## Things to swap before going live

**1. Gumroad — `shop.html`**
Search for `YOUR-PRODUCT-ID` and replace it with your real Gumroad
permalink. The `gumroad-button` class triggers the popup checkout —
don't remove it.

**2. Real photos — `quiz-data.js`**
Every option (brows, eyes, structure, aesthetic, the muse grid, etc.)
has a placeholder photo slot — right now it's just a colored square
with a camera icon. Two ways to add real photos:
   - **Muse grid tiles:** open `MUSE_TILES` near the top, set `img: ''`
     to `img: 'images/your-photo.jpg'` on any tile.
   - **Every other question's options:** each option object has a
     `swatch` color. Add `img: 'images/your-photo.jpg'` next to it the
     same way — the engine already knows to use it if it's there.
   Put your actual image files in an `images/` folder next to these
   files once you've got them.

**3. Page numbers — `quiz-data.js`**
Search for `PAGE_MAP`. Every `'TBD'` is a placeholder for an ebook page
that doesn't exist yet. Drop in the real page number once it's written.

**4. Path A lane names — `quiz-data.js`**
`PATH_A_LANES` has 9 placeholder names (Sharp Frost, Soft Glow, etc).
Rename any of them freely.

**5. Your hero photo**
`style.css` → `.polaroid__photo` is a gradient placeholder. Swap the
`background:` line for `background: url('images/you.jpg')
center/cover;` whenever you've got the shot.

**6. Socials**
Already linked to @bellapalk (TikTok) and @belluhlou (Instagram) in
`index.html`'s socials section. Update the `href`s there if either
ever changes.

## How the muse tie-break works
Path B shows 9 placeholder photo tiles (3 each for the 3 personas).
She picks at least 3 she's drawn to — just vibes, no pressure. Then one
follow-up screen shows only her picks and asks "if you could only keep
ONE." Whatever she picks there is the only thing that decides her
lane. The first 3 never get averaged or scored — they only feed a
flavor line in the result ("you were pulling toward X too, but Y won")
when her gut-check pick differs from the rest. Structurally cannot
land on a tie, because nothing is ever a count, it's always a single
final answer.

## File map
- `index.html` — homepage
- `quiz.html` — the quiz (loads `quiz-data.js` + `quiz-engine.js`)
- `shop.html` — standalone ebook sales page
- `style.css` — the whole design system
- `quiz-data.js` — every question, lane name, photo slot, and page
  number. This is the file you'll touch most.
- `quiz-engine.js` — the logic that runs the quiz, including the
  muse multi-pick and gut-check steps. Shouldn't need to touch this
  unless you're adding a new question type.
