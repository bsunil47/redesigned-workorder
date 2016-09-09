'use strict';

angular.module('PGapp.users', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users', {
    templateUrl: 'view/userlist/userlist.html',
    controller: 'UserListCtrl'
  });
}])

.controller('UserListCtrl', ["$scope","$cookies","$location","$filter",'API',function($scope,$cookies,$location,$filter,API) {
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  var userdetail = $cookies.getObject('userDetails');
  $scope.showRole = function(role_id){
    var found = $filter('getById')('_id', role_id, $scope.user_list.roles);
    return found.role_name
  };

  API.Users.Recent(userdetail,function(res){
    if(res.Code == 200){

      $scope.user_list = res.Info;
      //$cookies.put('userDetails',res)
    }else {
      $scope.loginForm.username.error = true;
    }

  },function (error) {
    alert(error);
  });

  $scope.Logout = function () {
      $cookies.remove('userDetails');
    $location.path("/");
  };
  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  }
    $scope.showFacility = function (facility_number) {
        var facilities_numbers = "";
        var facility_length = facility_number.length;
        for (var faci in facility_number) {
            var found = $filter('getByFacilityNumber')('facility_number', facility_number[faci].facility_number, facilities);
            if (facility_length - 1 < faci) {
                facilities_numbers = facilities_numbers + found.facility_name + ",";
            } else {
                facilities_numbers = facilities_numbers + found.facility_name;
            }
        }
        return facilities_numbers;
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
    var i = 0, len = collection.length;
    for (i; i < len; i++) {
      if (collection[i][propertyName] == propertyValue) {
        return collection[i];
      }
    }
    return null;
  }
});