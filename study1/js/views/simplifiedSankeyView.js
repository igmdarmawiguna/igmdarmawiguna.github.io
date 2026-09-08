// js/views/simplifiedSankeyView.js
// Renders the single Theme -> Authority/Diaspora Sankey into #chart-simplified.
// Depends on: DataModel, Tooltip, D3 + d3-sankey.

window.SimplifiedSankeyView = (function () {

  function render() {
    const container = d3.select('#chart-simplified');
    container.selectAll('*').remove();

    const { nodes, links } = buildGraph();

    const width = 900, height = 700;
    const svg = container.append('svg')
      .attr('width', width).attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const sankeyGen = d3.sankey()
      .nodeWidth(16)
      .nodePadding(14)
      .extent([[1, 5], [width - 220, height - 5]])
      .nodeAlign(d => d.id.includes('_') ? 1 : 0);

    const graph = sankeyGen({
      nodes: nodes.map(d => Object.assign({}, d)),
      links: links.map(d => Object.assign({}, d))
    });

    drawLinks(svg, graph.links);
    drawNodes(svg, graph.nodes, width);
  }

  function buildGraph() {
    const nodeIndex = new Map();
    const nodes = [];
    const links = [];

    function getNode(id, label, group) {
      if (!nodeIndex.has(id)) {
        nodeIndex.set(id, nodes.length);
        nodes.push({ id, label, group });
      }
      return nodeIndex.get(id);
    }

    DataModel.getThemeData().forEach(d => {
      const themeN = getNode(d.theme_id, `${d.theme_id} — ${d.theme}`, d.theme_id);
      const color = DataModel.getThemeColor(d.theme_id);

      if (d.auth > 0) {
        const a = getNode(d.theme_id + '_AUTH', `${d.theme_id} Authority`, d.theme_id);
        links.push({
          source: themeN, target: a, value: d.auth, color,
          tooltip: `${d.theme_id} &#8594; Authority: ${d.auth} of 3 participants`
        });
      }
      if (d.dias > 0) {
        const dn = getNode(d.theme_id + '_DIAS', `${d.theme_id} Diaspora`, d.theme_id);
        links.push({
          source: themeN, target: dn, value: d.dias, color,
          tooltip: `${d.theme_id} &#8594; Diaspora: ${d.dias} of 6 participants`
        });
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

  function drawNodes(svg, nodes, width) {
    const node = svg.append('g').selectAll('g').data(nodes).join('g');

    node.append('rect')
      .attr('x', d => d.x0).attr('y', d => d.y0)
      .attr('height', d => Math.max(1, d.y1 - d.y0)).attr('width', d => d.x1 - d.x0)
      .attr('fill', d => DataModel.getThemeColor(d.group));

    node.append('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y0 + d.y1) / 2).attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .text(d => d.label);
  }

  return { render };
})();
