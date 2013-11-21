angular.module('dreamnetwork')
  .factory('userSrv', function($rootScope, $location) {
    var service = {};

    service.login = function () {
      var currentUser = Parse.User.current();
      if (currentUser) {
        $rootScope.userLoggedIn = true;
        $rootScope.userId = currentUser.id;
        service.currentUser = currentUser;
        $location.path('profile/' + currentUser.id);
      } else {

        Parse.FacebookUtils.logIn("user_location,user_hometown, \
                                  user_interests,user_education_history, \
                                  user_about_me,user_birthday", {
          success: function(user) {
           $rootScope.$apply(function () {
              $rootScope.userLoggedIn = true;
              $rootScope.userId = user.id;
              service.currentUser = user;

	      var query = new Parse.Query(Parse.User);
	      query.get(user.id).then(function(user) {
                if (!user.get('first_time')) {
                 FB.api({
                   method: 'fql.multiquery',
                   queries: {
                       'query1': "SELECT name, sex, birthday, current_location, \
                          education, about_me, interests, username, \
                          pic_cover, hometown_location, languages \
                          FROM user WHERE uid = me()",
                       'query2': 'SELECT url FROM profile WHERE id = me()'
                    }
                 }, function(response) {
                   userResponse = response[0].fql_result_set[0];
                   profileResponse = response[1].fql_result_set[0];

                   user.set("first_time", true);
                   user.set('name', userResponse.name);
                   user.set('gender', userResponse.sex);
                   user.set("age", getAge(userResponse.birthday));
                   user.set('state', userResponse.current_location.state);
                   user.set('education', getFBEducation(userResponse.education));
                   user.set('major', getFBMajors(userResponse.education));
                   user.set('interests', userResponse.interests);
                   user.set('description', userResponse.about_me);
                   user.set('fb_username', userResponse.username);
                   user.set('high_school', getFBEducation(userResponse.education, "High School"));
                   user.set('college', getFBEducation(userResponse.education, "College"));
                   user.set('pic_cover', userResponse.pic_cover);
                   user.set('fb_url', profileResponse.url);
                   user.set('languages', getFBLanguages(profileResponse.languages));
                   user.set('home_country', getFBHomeCountry(profileResponse.hometown_location));

                   user.save(null, {
                     success: function(data) {
                      $rootScope.$apply(function() {
                        $location.path('profile/' + $rootScope.userId);
                       });
                     },
                      error: function(data, error) {
                      console.log(error);
                     }
                    });
                  });
                } else {
                  $rootScope.$apply(function() {
                    $location.path('profile/' + $rootScope.userId);
                   });
                }
               });
            });
          },
          error: function(user, error) {
          }
        });
      }
    }

    service.logout = function () {
      Parse.User.logOut();
      FB.logout();
      $rootScope.userLoggedIn = false;
      service = {};
      $location.path('/home');
    }
    return service;
  })
;


function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
