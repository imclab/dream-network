window.wordCloud = function(selector, words) {
  var fill = d3.scale.category20();
  d3.layout.cloud().size([850, 300])
    .words(words.map(function(d) {
      return { text: d, size: 1 + Math.random() * 90 };
    }))
    .padding(3)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .font('Impact')
    .fontSize(function(d) { return d.size; })
    .on('end', function draw(words) {
      d3.select(selector).append('svg')
        .attr('width', 850)
        .attr('height', 400)
        .append('g')
        .attr('transform', 'translate(150,150)')
        .selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', function(d) { return d.size + 'px'; })
        .style('font-family', 'Impact')
        .style('fill', function(d, i) { return fill(i); })
        .attr('text-anchor', 'middle')
        .attr('transform', function(d) {
          return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
        })
        .text(function(d) { return d.text; });
    })
    .start();
};
