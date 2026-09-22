# Portfolio — Mindan Chen

Static site. No build step, no framework, no dependencies. Open `index.html`,
or serve it:

    python3 -m http.server 8000

## Files

    index.html          Home — hero + 12-column work grid
    about.html          About — bio, education, experience, publications

    initiator.html      The ten project pages, in home-page order.
    ml-move.html        All share one structure and css/project.css.
    labbridge.html      ← password-gated; source lives outside this folder
    agent-skills.html
    haier.html
    privis.html
    d-heart.html
    plus.html
    ecco.html
    chiara.html

    css/global.css      Tokens, reset, nav, type, buttons, motion, footer
    css/home.css        Home hero + work grid + project cards
    css/project.css     Case-study blocks, plus the About page
    js/main.js          Scroll reveal, header surface, active nav, footer year
    assets/<slug>/      8 image slots per project
    fonts/              For self-hosted fonts, if you drop the Helvetica stack

## Three systems — work inside them, don't write one-offs

**Spacing.** A section is `.project-section` (120px), `.major` (160px) or
`.compact` (80px). Pick one; never hand-set padding.

**Media width.** Every image sits in `.media` plus one of `.media-full`,
`.media-wide` (88%), `.media-medium` (68%), `.media-small` (48%) — or a grid:
`.media-pair`, `.media-triplet`, `.media-stack`. Never size an image inline.

**Home grid.** 12 columns; every row must total 12.

    .full                  →  12
    .large + .small        →  8 + 4
    (default) + (default)  →  6 + 6

Current rhythm:

    Initiator 8   + ML-Move 4
    LabBridge 12
    Agent Skills 6 + Haier 6
    Privis 4      + D-heart 8
    Plus 6        + Ecco 6
    Chiara 12

Reordering projects = moving whole `<a class="project-card">` blocks. Just keep
each row adding to 12, and fix the "Next project" links (below).

## Renaming a project

Three edits, always the same three:

1. Rename `oldname.html` → `newname.html`, and `assets/oldname/` →
   `assets/newname/`. Inside the page, update the eight `assets/oldname/...`
   image paths.
2. In `index.html`, update that card's `href` and its `<h2 class="project-title">`.
3. Fix the "Next project" link at the bottom of the **previous** project page,
   and the one at the bottom of the renamed page itself.

The chain is a loop — Chiara points back to Initiator.

## Adding your images

Drop real files into `assets/<slug>/`. The placeholders are SVGs named after
the file each slot expects, so the swap is:

    <img src="assets/privis/hero.svg">   →   <img src="assets/privis/hero.jpg">

Slots per project: `cover`, `hero`, `context`, `research-01`, `research-02`,
`system`, `feature-01`, `feature-02`. Size and crop are handled by CSS — you
never touch a width or height. Aim for ~2000px wide JPEGs under 400 KB.

Cover ratio is set per card by `.ratio-16-9` / `.ratio-4-3` / `.ratio-1-1` on
`.project-cover`, chosen so cards in a row end up roughly the same height.

## Motion

Restrained, and entirely optional to the page working.

- `data-reveal` — fades and rises 18px into place (0.65s).
- `data-reveal-image` — the picture settles from 1.06 back to 1 (1.1s) inside
  a frame that stays still.
- `data-delay="1|2|3"` — staggers siblings by 90ms.
- Header background and blur fade in past 40px of scroll.
- Project cards scale 1.015 on hover; the Next-project heading fades.

To animate something new, add `data-reveal` to it. That's the whole API.

Three guarantees built in:
- **JS off → nothing hidden.** The reveal styles are scoped to `.js`, a class
  set by an inline script in `<head>`, so without JS the page renders static.
- **Reduced motion → no animation.** `prefers-reduced-motion` shows the final
  state immediately.
- **Jump-proof.** `js/main.js` uses a rAF-throttled sweep rather than
  IntersectionObserver, because an observer can miss an element entirely when
  the page jumps (flick-scroll, End key, in-page anchor) and leave it stuck
  invisible. The sweep reveals anything whose top edge is above the trigger
  line, which includes everything a jump skipped past.

## Global dials — change these, not the rules under them

In `css/global.css`:

    --page-max: 1600px;        whole-site width
    --page-padding: 48px;      left/right margin
    --reading-width: 680px;    body measure (Apple-ish: 640–720px)
    --color-bg / --color-text / --color-secondary / --color-line
    --color-accent             unused by default

Bigger home headline:

    .display { font-size: clamp(54px, 6vw, 92px); }  →  clamp(60px, 6.8vw, 104px)

## Still to do

- `your@email.com` is in the nav of every page:

      LC_ALL=C sed -i '' 's/your@email\.com/real@email.com/g' *.html

- Six projects show `20XX` for the year and a discipline label inferred from
  the project name — each is marked `<!-- CHECK -->` in `index.html`. Known
  ones: Initiator 2026, LabBridge 2026, Haier 2025, Ecco 2025, Plus 2024.
- Nine of the ten project pages are scaffolding, marked `<!-- REPLACE -->` at
  the top. Structure: Hero → Info → 01 Context → 02 Research → Findings →
  03 System → two feature blocks → Quote → 04 Evaluation → Next project.
- `assets/about/portrait.jpg` for the About page.

## Publishing

Any static host. GitHub Pages: push this folder, then Settings → Pages →
deploy from `main`, root folder.
