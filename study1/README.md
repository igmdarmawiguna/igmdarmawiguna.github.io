# Study 1 Visuals Hub

Same app as before (Sub-theme Breakdown Sankey, Participant Reach Sankey,
searchable/sortable table) — now split into a small MVC-style structure
instead of one giant HTML file.

## Run it

Unzip, then open `index.html` in any browser. No build step, no server,
no internet connection needed — the folder structure must stay intact
(the HTML loads the JS/CSS files by relative path), so don't move
`index.html` out on its own.

## Structure

```
index.html                     ← thin shell: markup + <script src> tags only, no logic
css/
  styles.css                   ← all styling
js/
  lib/                         ← vendor libraries (unmodified)
    d3.min.js
    d3-sankey.min.js
  data/                        ← raw data, as window globals (Model's data source)
    subThemeData.js            ← window.SUB_THEME_DATA  (59 rows, one per sub-theme)
    themeData.js               ← window.THEME_DATA      (10 rows, de-duplicated per theme)
    tableData.js                ← window.TABLE_DATA       (59 rows, full table columns)
    themeColors.js              ← window.THEME_COLORS     (C1–C10 → hex colour)
  models/
    dataModel.js                ← DataModel: the only thing that reads the data
                                   globals directly. Exposes getters, search, sort.
  views/
    tooltip.js                  ← Tooltip: shared show/hide helper (both Sankeys use it)
    facetedSankeyView.js        ← FacetedSankeyView.render() → fills #grid
    simplifiedSankeyView.js     ← SimplifiedSankeyView.render() → fills #chart-simplified
    tableView.js                ← TableView.render(rows) → fills the table body
                                   (pure rendering; no sorting/filtering logic here)
  controllers/
    appController.js            ← AppController: wires up tab clicks, the search box,
                                   and column-header clicks to Model + View calls.
                                   The only place that owns UI state (current sort key,
                                   current tab).
```

## Why this split

- **Model** (`js/models/dataModel.js`) is the only code that touches
  `window.SUB_THEME_DATA` / `THEME_DATA` / `TABLE_DATA` / `THEME_COLORS`
  directly. Everything else asks the model for data instead of poking the
  globals — so if the data source changes shape later, only the model
  needs to change.
- **Views** (`js/views/*.js`) only know how to draw something into the DOM
  given data they're handed. They don't read `document.getElementById('search')`
  or decide what's currently sorted — that's the controller's job. This
  means a view can be reused or tested without the rest of the page.
- **Controller** (`js/controllers/appController.js`) is the only file that
  attaches `addEventListener`. It reads UI state (search text, which
  column was clicked), asks the model to filter/sort, and hands the result
  to the view to render.

## Updating the data

If the source spreadsheet changes, regenerate the three files in
`js/data/` (`subThemeData.js`, `themeData.js`, `tableData.js`) — each is
just `window.SOMETHING = [...]` and can be replaced wholesale. Nothing
else needs to change unless the column names themselves change, in which
case update `dataModel.js` (search/sort logic) and the matching view.
