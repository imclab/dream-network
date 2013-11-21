angular.module('dreamnetwork', ['ngResource', 'ngRoute', 'infinite-scroll'])
  .constant('publicUrls', ['/home', '/login', '/signup'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider.
      when('/home', {templateUrl: 'html/home.html', controller: HomeCtrl}).
      when('/profile/:userId', {templateUrl: 'html/profile.html', controller: ProfileCtrl}).
      when('/search', {templateUrl: 'html/search.html', controller: SearchCtrl}).
      when('/information', {templateUrl: 'html/information.html', controller: InformationCtrl}).
      when('/about', {templateUrl: 'html/about.html', controller: AboutCtrl}).
      when('/signup', {templateUrl: 'html/signup.html', controller: UserCtrl}).
      when('/login', {templateUrl: 'html/login.html', controller: UserCtrl}).
      otherwise({redirectTo: '/home'});
  }])
  .run(function($rootScope, userSrv) {
    var currentUser = Parse.User.current();
    if (currentUser) {
      $rootScope.userLoggedIn = true;
      $rootScope.userId = currentUser.id;
      userSrv.currentUser = currentUser;
    } else {
      $rootScope.userLoggedIn = false;
    }
  });
