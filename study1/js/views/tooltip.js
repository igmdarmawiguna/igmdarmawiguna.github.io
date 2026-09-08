// js/views/tooltip.js
// Tiny shared helper so both Sankey views don't duplicate tooltip show/hide logic.

window.Tooltip = (function () {
  const el = d3.select('#tooltip');

  function show(html, event) {
    el.style('opacity', 1).html(html)
      .style('left', (event.pageX + 12) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  }

  function hide() {
    el.style('opacity', 0);
  }

  return { show, hide };
})();
