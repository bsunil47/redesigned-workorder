'use strict';

angular.module('PGapp.createuser', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/create_user', {
    templateUrl: 'view/createuser/create_user.html',
    controller: 'CreateUserCtrl'
  });
}])

.controller('CreateUserCtrl', ["$scope","$cookies","$location",'API',function($scope,$cookies,$location,API) {
  $scope.CreateUser = CreateUser;
  $scope.user = {
    username:'',
    firstname:'',
    lastname:'',
    email:'',
    userrole:'',
    status: 1,
    password:''
  };
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }
  var userdetail = $cookies.getObject('userDetails');



  $scope.Logout = function () {
    $cookies.remove('userDetails')
    $location.path("/");
  }

  function CreateUser(){
    $scope.user.username = $scope.user.firstname + ' '+$scope.user.lastname;
    $scope.user._v = 0;
    if($scope.CreateUserForm.firstname.$valid && $scope.CreateUserForm.lastname.$valid){
      $scope.user_id = API.Create.User($scope.user,function(res){
        if(res.Code == 200){
          $location.path("/users");
        }else {
          $scope.CreateUserForm.email.error = true;
        }
      },function (error) {
        alert(error);
      });
    }
  }
}]);