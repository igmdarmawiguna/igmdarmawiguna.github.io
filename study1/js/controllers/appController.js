// js/controllers/appController.js
// The only place that wires DOM events to Model + View calls.
// Views never read the DOM for state (search text, sort key) themselves —
// they just render whatever the controller hands them.

window.AppController = (function () {

  let sortKey = null;
  let sortAscending = true;

  function init() {
    bindTabs();
    bindTableControls();

    FacetedSankeyView.render();
    SimplifiedSankeyView.render();
    refreshTable();
  }

  function bindTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('view-' + btn.dataset.view).classList.add('active');
      });
    });
  }

  function bindTableControls() {
    document.getElementById('search').addEventListener('input', refreshTable);

    document.querySelectorAll('#hierarchy-table th').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.key;
        if (sortKey === key) {
          sortAscending = !sortAscending;
        } else {
          sortKey = key;
          sortAscending = true;
        }
        refreshTable();
      });
    });
  }

  function refreshTable() {
    const query = document.getElementById('search').value;
    let rows = DataModel.getTableData();
    rows = DataModel.searchTableRows(rows, query);
    rows = DataModel.sortTableRows(rows, sortKey, sortAscending);
    TableView.render(rows);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', AppController.init);
