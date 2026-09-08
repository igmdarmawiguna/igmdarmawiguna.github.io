// js/models/dataModel.js
// Model layer: the only place that touches the raw data globals
// (window.SUB_THEME_DATA / window.THEME_DATA / window.TABLE_DATA / window.THEME_COLORS).
// Views and the controller should go through DataModel, not the globals directly.

window.DataModel = (function () {

  function getSubThemeData() {
    return window.SUB_THEME_DATA;
  }

  function getThemeData() {
    return window.THEME_DATA;
  }

  function getTableData() {
    return window.TABLE_DATA;
  }

  function getThemeColor(themeId) {
    return window.THEME_COLORS[themeId] || '#666';
  }

  // Themes in natural order: C1, C2, ... C10 (not alphabetical, which would put C10 before C2)
  function getThemeOrder() {
    const ids = new Set(getSubThemeData().map(d => d.theme_id));
    return Array.from(ids).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  }

  function getSubThemesForTheme(themeId) {
    return getSubThemeData().filter(d => d.theme_id === themeId);
  }

  function searchTableRows(rows, query) {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter(d =>
      d.theme_id.toLowerCase().includes(q) ||
      d.sub_id.toLowerCase().includes(q) ||
      d.sub_name.toLowerCase().includes(q) ||
      d.captures.toLowerCase().includes(q) ||
      d.guardrail.toLowerCase().includes(q) ||
      d.emp_primary.toLowerCase().includes(q) ||
      d.emp_secondary.toLowerCase().includes(q)
    );
  }

  function sortTableRows(rows, key, ascending) {
    if (!key) return rows;
    return [...rows].sort((a, b) => {
      const av = a[key], bv = b[key];
      if (typeof av === 'number') return ascending ? av - bv : bv - av;
      return ascending
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }

  return {
    getSubThemeData,
    getThemeData,
    getTableData,
    getThemeColor,
    getThemeOrder,
    getSubThemesForTheme,
    searchTableRows,
    sortTableRows
  };
})();
