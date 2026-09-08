# Study 1 Visuals Hub

A single self-contained HTML page for exploring Study 1's reflexive thematic
analysis (`RefineThematicHierarchy` sheet: 10 themes, 59 sub-themes).

## Open it

Just open **`study1_visuals_hub.html`** in any browser — double-click the
file, or use a local server / Live Server if you prefer. No build step, no
install, no internet connection required (D3.js and d3-sankey are bundled
inline in the file).

## What's inside

Three tabs at the top of the page:

| Tab | Shows |
|---|---|
| **Faceted Sankey** | One small Sankey diagram per theme: Theme → Sub-theme → Authority/Diaspora. Easiest to read at a glance. |
| **Simplified Sankey** | One diagram: Theme → Authority/Diaspora only, no sub-theme detail, using de-duplicated participant counts. |
| **Table** | The full sub-theme-level data (Theme, Sub-theme, Core Segments, % of Theme, Authority, Diaspora, Empirical Primary/Secondary Consideration) as a sortable, searchable HTML table. |

Hover any node or link in the Sankeys for a tooltip with exact values.
Click a table column header to sort by it; type in the search box to filter
by theme, sub-theme name, or consideration.

## Data notes

- **Core Segments** measures coding density (how many excerpts were coded
  under a sub-theme), not prevalence, consensus, or importance.
- **% Theme** = that sub-theme's Core Segments ÷ the sum of Core Segments
  for its parent theme.
- In the Sankeys, the Theme → Sub-theme tier conserves core segment counts
  within a theme, but the Sub-theme/Theme → Authority/Diaspora tier uses
  **participant counts** instead — a different unit — so link widths are
  not directly comparable across the two tiers.
- The Simplified Sankey's Authority/Diaspora counts are theme-level totals
  from the source's Presentation Summary sheet (already de-duplicated per
  person), not a sum of the per-sub-theme counts — summing would double
  count a participant coded under multiple sub-themes of the same theme.

## Regenerating

This file was generated from the `RefineThematicHierarchy` and
`Presentation Summary` sheets of `Study 1 - Reflextive Thematic_Analysis.xlsx`.
It is a static snapshot — if the source spreadsheet changes, this file needs
to be rebuilt; it does not auto-sync.
