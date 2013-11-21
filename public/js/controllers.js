function HomeCtrl($scope, $location, $routeParams) {
  $scope.fetchRandomDreamer = function () {
    var query = new Parse.Query(Parse.User);
    query.count({
      success: function(number) {
        $scope.$apply(function() {
          $scope.userCount = number;
          $scope.goal = 100;
          $scope.progressPercent = number * 100 / $scope.goal;
          var randomUserIndex = Math.floor(Math.random()*$scope.userCount);
          var randUserQuery = new Parse.Query(Parse.User);
          query.select("id","name","description", "fb_username","interests","nationality");
          $('#load-container').css('display','block');
          $('.userContent').css('display','none');
          $('#shell').css('height','200px');
          randUserQuery.skip(randomUserIndex).first({
            success: function(object) {
              $scope.$apply(function() {
                $scope.randomUser = {
                  id : object.id,
                  description : object.get("description"),
                  fbUsername : object.get("fb_username"),
                  name : object.get("name"),
                  interests : object.get("interests"),
                  nationality : object.get("nationality")
                };
              });
              $('#load-container').css('display','none');
              $('#shell').css('height','0');
              $('.userContent').css('display','block');
            }
          });
        });
      }
    });
  }

  $scope.fetchRandomDreamer();

  $scope.signUp = function () {
    $location.path('/signup');
  }

  USMap('.us-map');
  worldMap('.world-map');
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

  var busy = false;
  var tid;
  $scope.$watch("query", function(query) {
    if (typeof query !== "undefined") {
      if (!busy) {
        $scope.searchUser();
      } else {
        clearTimeout(tid);
        tid = setTimeout(function() {
          $scope.searchUser();
          busy = false;
        }, 500);
      }
      busy = true;
    }
  });

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
    var interests = [];
    var query = new Parse.Query(Parse.User);
    query.select("interests");
    query.each(function(result) {
        interests = interests.concat(result.attributes.interests.split(','))
    }).then(function() {
            var fill = d3.scale.category20();
            d3.layout.cloud().size([850, 300])
                .words(interests.map(function(d) {
                        return {text: d, size: 1 + Math.random() * 90};
                    }))
                .padding(3)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();

            function draw(words) {
                d3.select("div#hobbies").append("svg")
                    .attr("width", 850)
                    .attr("height", 400)
                    .append("g")
                    .attr("transform", "translate(150,150)")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", function(d) { return d.size + "px"; })
                    .style("font-family", "Impact")
                    .style("fill", function(d, i) { return fill(i); })
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) { return d.text; });
            }
        });

  var width = 520;
  var height = 400;
  var radius = Math.min(width, height) / 2.3;
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
    var $div = $('<div class="pie-chart"><h4></h4><div class="graph"></div><div class="pieList"></div></div>');
    $div.find('h4').text(key);
    var mydata = aggregator(window.data, key);
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
    var $list = $div.find('.pieList');
    mydata.forEach(function(d) {
      var $item = $('<div class="item"></div>');
      $item.text(d.text);
      $item.css('background-color', color(d.value));
      $item.css('width',200*d.p+"px");
      $list.append($item);
    });

    $container.append($div);
  });

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
