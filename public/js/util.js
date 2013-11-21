// Color pallete that will be used throughout the app.
window.colors = [
  '#3E454C', // Charcoal
  '#2185C5', // Bright Blue
  '#7ECEFD', // Baby Blue
  '#FFF6E5', // Almost White
  '#FF7F66'  // Red
];


/**
 * Returns a value from an object with dot notation.
 *
 * @param {Object} o
 * @param {String} key
 * @return {Object}
 */
window.getValue = function(o, key) {
  var keys = key.split('.');
  var curr = o;

  for (var i = 0, len = keys.length; i < len; i++) {
    var value = curr[keys[i]];
    if (typeof value !== 'undefined') {
      curr = value;
    } else {
      return null;
    }
  }

  return curr;
};


/**
 * Aggregates seed data into an array of stat data.
 *
 * @param {String} key
 * @return {Object}
 *   {String} value
 *   {Number} count
 *   {String} percent
 *   {String} text
 */
window.aggregator = function(data, key) {
  var map = {};
  var total = 0;

  data.forEach(function(d) {
    var value = window.getValue(d.attributes, key);
    var values = typeof value === 'string'
      ? value.split(',').map(function(v) { return v.trim(); })
      : [value];

    values.forEach(function(value) {
      if (value) {
        if (map[value]) {
          map[value]++;
        } else {
          map[value] = 1;
        }
        total++;
      }
    });
  });

  var arr = [];
  var i = 0;
  for (var value in map) {
    var count = map[value];
    var p1 = count / total;
    var p2 = p1 * 100;
    var percent = (p2 % 0.5 === 0 ? Math.floor(p2) : Math.round(p2)) + '%';
    arr[i++] = {
      value: value,
      count: count,
      p: p1,
      percent: percent,
      text: value + ' (' + percent + ')'
    };
  }

  return arr;
};


/**
 * @param {String|RegExp} sep
 * @param {Array.<Object>} list
 * @param {String} key
 */
window.getWords = function(sep, list, key) {
  var arr = [];
  list.forEach(function(d) {
    arr = arr
      .concat(d.attributes[key]
        .split(sep)
        .map(function(v) { return v.trim(); })
        .filter(function(v) { return v; })
      );
  });
  return arr;
};
