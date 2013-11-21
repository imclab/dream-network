window.worldMap = function(selector) {
  // Width and height
  var width = 800;
  var height = 400;

  // Map projection
  var projection = d3.geo.mercator()
    .scale([500])
    .translate([width/2, height/2]);

  var path = d3.geo.path()
    .projection(projection);

  var color = d3.scale.quantize()
    .range(['rgb(237,248,233)','rgb(186,228,179)','rgb(116,196,118)','rgb(49,163,84)','rgb(0,109,44)']);

  var svg = d3.select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  d3.csv('/data/birthlocation.csv', function(data) {
    color.domain([
      d3.min(data, function(d) { return d.value; }),
      d3.max(data, function(d) { return d.value; })
    ]);

    d3.json('/data/countries.geo.json', function(json) {

    //Combine the current location data and GeoJSON
    for (var i = 0; i < data.length; i++) {
  
      var dataState = data[i].country;
      var dataValue = parseFloat(data[i].value);
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name;
        if (dataState === jsonState) {
          json.features[j].properties.value = dataValue;
          break;
        }
      }
    }

    //Bind the data and create a path per GeoJSON feature
    svg.selectAll('path')
       .data(json.features)
       .enter()
       .append('path')
       .attr('d', path)
       .style('fill', function(d) {
          var value = d.properties.value;
          if (value) {
            return color(value);
          } else {
            return '#ccc';
          }
        })
      .append('svg:title')
      .text(function(d) { return d.properties.name; });
    });
  });
};
