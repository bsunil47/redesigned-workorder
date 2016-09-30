'use strict';

angular.module('PGapp.users', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users', {
    templateUrl: 'view/userlist/userlist.html',
    controller: 'UserListCtrl'
  });
}])

    .controller('UserListCtrl', ["$scope", "$cookies", "$location", "$filter", "$window", 'API', function ($scope, $cookies, $location, $filter, $window, API) {
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            $window.history.back();
        };
  $scope.showRole = function(role_id){
    var found = $filter('getById')('_id', role_id, $scope.user_list.roles);
    return found.role_name
  };



  $scope.Logout = function () {
      $cookies.remove('userDetails');
    $location.path("/");
  };
  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  };
        var facilities;
        API.allFacilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                facilities = res.Info.facilities;
                API.Users.Recent(userdetail, function (res) {
                    if (res.Code == 200) {

                        $scope.user_list = res.Info;
                        //$cookies.put('userDetails',res)
                    } else {
                        $scope.loginForm.username.error = true;
                    }

                }, function (error) {
                    alert(error);
                });
                //$cookies.put('userDetails',res)
            } else {

            }
        }, function (error) {
            alert(error);
        });
        $scope.showFacility = function (facility_number) {
            var found = $filter('getByFacilityUserID')('facility_users', facility_number, facilities);
            console.log(found);
            return found.facility_name;
    };
    var status_list;
    $scope.editUser = function (user_email) {
        console.log("User emailin userlist js: " + user_email);
        $location.path('edituser/' + user_email);
    };
    API.Status.Recent(userdetail.user, function (res) {
        if (res.Code == 200) {

            status_list = res.Info.status_list;
            //$cookies.put('userDetails',res)
        } else {

        }
    }, function (error) {
        alert(error);
    });
    $scope.showStatus = function (status_number) {
        var found = $filter('getByFacilityNumber')('status_number', status_number, status_list);
        return found.status_name;
    }
}]);

PGapp.filter('getById', function() {
  //console.log(input);
  return function(propertyName, propertyValue, collection) {
    var i=0, len=collection.length;
    for (i; i<len; i++) {
      if (collection[i][propertyName] == propertyValue) {
        return collection[i];
      }
    }
    return null;
  }
});

PGapp.filter('getByFacilityNumber', function () {
    //console.log(input);
    return function (propertyName, propertyValue, collection) {
        try {
            if (collection != 'undefined') {
                var i = 0,
                    len = collection.length;
                for (i; i < len; i++) {
                    if (collection[i][propertyName] == propertyValue) {
                        return collection[i];
                    }
                }
            }
        } catch (err) {
            return null;
        }


    }
});

PGapp.filter('getByFacilityUserID', function () {
    //console.log(input);
    return function (propertyName, propertyValue, collection) {
        try {
            if (collection != 'undefined') {
                var i = 0,
                    len = collection.length;
                for (i; i < len; i++) {
                    var j = 0,
                        lena = collection[i][propertyName].length;
                    for (j; j < lena; j++) {
                        if (collection[i][propertyName][j].user_id == propertyValue) {
                            console.log(collection[i])
                            return collection[i];
                        }
                    }
                }
            }
        } catch (err) {
            return null;
        }


    }
});

PGapp.filter('setPadZeros', function () {
    //console.log(input);
    return function (num, size) {
        try {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        } catch (err) {
            return null;
        }


    }
});