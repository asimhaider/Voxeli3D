# Voxelis 3D Solutions — website

A componentized React + Vite site. Every section is its own file, so you can
edit content, swap sections, or restyle pieces independently.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build in `dist/`.

## Where things live

```
src/
  index.css                  ← design tokens: colors, fonts, spacing (edit here first)
  App.jsx                    ← page assembly — reorder or remove sections here
  components/
    Header.jsx                ← nav bar (edit NAV_LINKS array to change menu items)
    Hero.jsx                   ← headline + intro (edit HEADLINE_LINES for the big title)
    LayerRail.jsx               ← the scroll-linked "Z-height" rail (signature element)
    StatsSection.jsx            ← the 4-number credibility strip (edit STATS array)
    VerticalsSection.jsx        ← the 4 business-line cards (edit VERTICALS array)
    VerticalCard.jsx             ← single reusable card used by VerticalsSection
    ProcessSection.jsx          ← "how an order runs" steps (edit STEPS array)
    GallerySection.jsx          ← recent work / portfolio grid (edit WORK array)
    CTASection.jsx               ← bottom contact form / call to action
    Footer.jsx                    ← footer nav + address (edit FOOTER_LINKS)
    icons/
      LogoMark.jsx                ← the "V" logo mark
      PrintIllustration.jsx        ← hero SVG illustration
      VerticalIcons.jsx            ← the 4 icons used on vertical cards
```

## Common edits

- **Change colors**: edit the `:root` variables at the top of `src/index.css`
  (`--color-yellow`, `--color-black`, etc). Every component reads from these
  tokens, so one edit re-themes the whole site.
- **Change fonts**: swap the Google Fonts URL and `--font-display` /
  `--font-body` / `--font-mono` values in `src/index.css`.
- **Add a fifth vertical**: add one object to the `VERTICALS` array in
  `VerticalsSection.jsx` — the grid re-flows automatically (though the CSS
  is tuned for 2 or 4 items; adjust `.verticals__grid` if you go to 3 or 5).
- **Replace placeholder gallery shapes with real photos**: in
  `GallerySection.jsx`, swap the `<svg>` shape for an `<img src="..." />`.
- **Wire up the contact form**: `CTASection.jsx` currently shows an alert on
  submit — point it at your backend, or a service like Formspree or Resend.

## Next steps (not yet included)

- Pricing section
- Team / about page
- React Router for multi-page navigation (currently a single scrolling page
  with anchor links)
