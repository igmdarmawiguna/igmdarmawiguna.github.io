// js/views/tableView.js
// Pure rendering: given a list of rows, draws <tr>s into #hierarchy-table tbody.
// Sorting/searching/state live in the controller + model, not here.

window.TableView = (function () {

  function render(rows) {
    const tbody = d3.select('#hierarchy-table tbody');
    tbody.selectAll('tr').remove();

    const trs = tbody.selectAll('tr').data(rows).join('tr')
      .style('background-color', d => {
        const c = d3.color(DataModel.getThemeColor(d.theme_id));
        c.opacity = 0.14;
        return c.formatRgb();
      });

    trs.append('td').text(d => d.theme_id);
    trs.append('td').text(d => d.sub_id);
    trs.append('td').text(d => d.sub_name);
    trs.append('td').attr('class', 'wrap').text(d => d.captures);
    trs.append('td').attr('class', 'num').text(d => d.core);
    trs.append('td').attr('class', 'num').text(d => d.pct_theme + '%');
    trs.append('td').attr('class', 'num').text(d => d.auth);
    trs.append('td').attr('class', 'num').text(d => d.dias);
    trs.append('td').attr('class', 'wrap').text(d => d.guardrail);
    trs.append('td').text(d => d.emp_primary);
    trs.append('td').text(d => d.emp_secondary);
  }

  return { render };
})();
