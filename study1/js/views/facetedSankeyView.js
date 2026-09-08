// js/views/facetedSankeyView.js
// Renders one small Sankey per theme into #grid.
// Depends on: DataModel, Tooltip (js/views/tooltip.js), D3 + d3-sankey.

window.FacetedSankeyView = (function () {

  function render() {
    const grid = d3.select('#grid');
    grid.selectAll('*').remove();

    const themeOrder = DataModel.getThemeOrder();

    themeOrder.forEach(themeId => renderThemePanel(grid, themeId));
  }

  function renderThemePanel(grid, themeId) {
    const rows = DataModel.getSubThemesForTheme(themeId);
    const themeName = rows[0].theme;
    const color = DataModel.getThemeColor(themeId);

    const panel = grid.append('div').attr('class', 'panel');
    panel.append('h3').text(`${themeId} — ${themeName}`);

    const { nodes, links } = buildGraph(themeId, themeName, rows, color);

    const width = 460;
    const height = Math.max(160, rows.length * 30);

    const svg = panel.append('svg')
      .attr('width', width).attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const sankeyGen = d3.sankey()
      .nodeWidth(10)
      .nodePadding(8)
      .extent([[1, 5], [width - 60, height - 5]])
      .nodeAlign(d => (d.id === 'AUTH' || d.id === 'DIAS') ? 2 : (d.id.includes('.') ? 1 : 0));

    const graph = sankeyGen({
      nodes: nodes.map(d => Object.assign({}, d)),
      links: links.map(d => Object.assign({}, d))
    });

    drawLinks(svg, graph.links);
    drawNodes(svg, graph.nodes, width, color);
  }

  function buildGraph(themeId, themeName, rows, color) {
    const nodeIndex = new Map();
    const nodes = [];
    const links = [];

    function getNode(id, label, tip) {
      if (!nodeIndex.has(id)) {
        nodeIndex.set(id, nodes.length);
        nodes.push({ id, label, tip: tip || label });
      }
      return nodeIndex.get(id);
    }

    const themeN = getNode(themeId, themeId, `${themeId} — ${themeName}`);

    rows.forEach(d => {
      const subN = getNode(d.sub_id, d.sub_id, `${d.sub_id} — ${d.sub_name}`);
      links.push({
        source: themeN, target: subN, value: d.core,
        tooltip: `${d.sub_id} — ${d.sub_name}<br>Core segments: ${d.core} (${d.pct}% of ${themeId})`,
        color
      });
      if (d.auth > 0) {
        const a = getNode('AUTH', 'Auth');
        links.push({ source: subN, target: a, value: d.auth, tooltip: `${d.sub_id} &#8594; Authority: ${d.auth}`, color: '#999' });
      }
      if (d.dias > 0) {
        const dn = getNode('DIAS', 'Diasp');
        links.push({ source: subN, target: dn, value: d.dias, tooltip: `${d.sub_id} &#8594; Diaspora: ${d.dias}`, color: '#bbb' });
      }
    });

    return { nodes, links };
  }

  function drawLinks(svg, links) {
    svg.append('g').selectAll('path').data(links).join('path')
      .attr('class', 'link')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => Math.max(1, d.width))
      .on('mousemove', (event, d) => Tooltip.show(d.tooltip, event))
      .on('mouseleave', Tooltip.hide);
  }

  function drawNodes(svg, nodes, width, color) {
    const node = svg.append('g').selectAll('g').data(nodes).join('g');

    node.append('rect')
      .attr('x', d => d.x0).attr('y', d => d.y0)
      .attr('height', d => Math.max(1, d.y1 - d.y0)).attr('width', d => d.x1 - d.x0)
      .attr('fill', d => (d.id === 'AUTH' || d.id === 'DIAS') ? '#888' : color)
      .on('mousemove', (event, d) => Tooltip.show(d.tip, event))
      .on('mouseleave', Tooltip.hide);

    node.append('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 5 : d.x0 - 5)
      .attr('y', d => (d.y0 + d.y1) / 2).attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .text(d => d.label);
  }

  return { render };
})();
