function HomeCtrl($scope, $routeParams) {
  var query = new Parse.Query(Parse.User);
  query.count({
    success: function(number) {
      $scope.$apply(function() {
        $scope.userCount = number;
        $scope.goal = 100;
        $scope.progressPercent = number * 100 / $scope.goal;
      });
    }
  });
}

function ProfileCtrl($scope, $routeParams, userSrv) {
  //Check if profile is self
  $scope.editable = userSrv.currentUser.id == $routeParams.userId ? true : false;

  //Setup profile info
  var query = new Parse.Query(Parse.User);
  query.get($routeParams.userId).then(function(user) {
    $scope.$apply(function () {
      $scope.user = {
        name: user.get('name'),
        major: user.get('major'),
        fbUsername : user.get('fb_username'),
        description: user.get('description'),
        high_school: user.get('high_school'),
        college: user.get('college'),
        industry: user.get('industry'),
        nationality: user.get('nationality'),
        interests: user.get('interests'),
        gender: user.get('gender'),
        state: user.get('state'),
        age: user.get('age'),
        languages: user.get('languages'),
        support_reason: user.get('support_reason'),
        coverPhotoUrl : user.get("pic_cover").source
      }

      //setup watches
      $scope.$watch('user', function(newValue, oldValue){
        userSrv.currentUser.set('major', newValue.major);
        userSrv.currentUser.set('description', newValue.description);
        userSrv.currentUser.set('high_school', newValue.high_school);
        userSrv.currentUser.set('college', newValue.college);
        userSrv.currentUser.set('industry', newValue.industry);
        userSrv.currentUser.set('nationality', newValue.nationality);
        userSrv.currentUser.set('interests', newValue.interests);
        userSrv.currentUser.set('languages', newValue.languages);
        userSrv.currentUser.set('support_reason', newValue.support_reason);
        userSrv.currentUser.save();
      }, true);
    });
  });
}

function SearchCtrl($scope, $routeParams) {
  $scope.users = [];
  $scope.displayingResults=false;
  $scope.choices = "interests";

  $scope.searchUser = function() {
    var query = new Parse.Query(Parse.User);
    query.select("name","description", "fb_username","interests","nationality", "pic_cover");
    var queryResult = query.contains($scope.choices, $scope.query).find();
    queryResult.then(function(results) {
      $scope.$apply(function(){
        $scope.users = [];
        $scope.displayingResults = true;
        results.forEach(function(object) {
          $scope.users.push({
            id : object.id,
            description : object.get("description"),
            fbUsername : object.get("fb_username"),
            name : object.get("name"),
            interests : object.get("interests"),
            nationality : object.get("nationality")
          });
        });
      });
    });
  }
}

function InformationCtrl($scope, $routeParams) {
}

function AboutCtrl($scope, $routeParams) {
}

function UserCtrl($http, $location, $scope, $rootScope, userSrv) {
  //signup
  $scope.signup = function() {
    userSrv.login();
  }
  //login
  $scope.login = function() {
    userSrv.login();
  }
  //logout
  $scope.logout = function() {
    userSrv.logout();
  }
}

function PieCtrl($http, $location, $scope, $rootScope, userSrv) {
  var width = 520;
  var height = 360;
  var radius = Math.min(width, height) / 2;

  var colors = [
    '#3E454C', // Charcoal
    '#2185C5', // Bright Blue
    '#7ECEFD', // Baby Blue
    '#FFF6E5', // Almost White
    '#FF7F66'  // Red
  ];
  var color = d3.scale.ordinal().range(colors);

  var keys = [
    'age',
    'gender',
    'industry',
    'birthLoc.country',
    'currentLoc.state'
  ];

  var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var $container = $('.pie');
  keys.forEach(function(key) {
    var $div = $('<div class="pie"><h4></h4><div class="graph"></div><div class="list"></div></div>');
    $div.find('h4').text(key);
    var mydata = aggregator(key);
    mydata.sort(function(a, b) { return b.count - a.count; });

    // Add the pie chart.
    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.count; });

    var svg = d3.select($div.find('.graph')[0]).append('svg')
        .attr('width', width)
        .attr('height', height)
      .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var g = svg.selectAll('.arc')
      .data(pie(mydata))
      .enter().append('g')
        .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', function(d) { return color(d.data.value); });

    g.filter(function(d) {
        return d.data.p > 0.05;
      })
      .append('text')
      .attr('transform', function(d) {
        var c = arc.centroid(d);
        var r = 2.35;
        return 'translate(' + (c[0] * r) + ', ' + (c[1] * r) + ')';
      })
      .attr('dy', '.35em')
      .style('text-anchor', 'left')
      .text(function(d) { return d.data.text; });

    // Add a list of all values to the right.
    var $list = $div.find('.list');
    mydata.forEach(function(d) {
      var $item = $('<div class="item"></div>');
      $item.text(d.text);
      $item.css('background-color', color(d.value));
      $list.append($item);
    });

    $container.append($div);
  });
}


/**
 * Returns a value from an object with dot notation.
 *
 * @param {Object} o
 * @param {String} key
 * @return {Object}
 */
function getValue(o, key) {
  var keys = key.split('.');
  var curr = o;

  for (var i = 0, len = keys.length; i < len; i++) {
    curr = curr[keys[i]];
  }

  return curr;
}


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
function aggregator(key) {
  var map = {};
  var total = 0;

  window.data.forEach(function(d) {
    var value = getValue(d, key);
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
}
