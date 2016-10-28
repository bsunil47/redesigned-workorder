'use strict';

angular.module('PGapp.createuser', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/create_user', {
    templateUrl: 'view/createuser/create_user.html',
    controller: 'CreateUserCtrl'
  });
}])

    .controller('CreateUserCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
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
        $scope.$on('$locationChangeStart', function (event, next, current) {
            // Here you can take the control and call your own functions:
            ///alert('Sorry ! Back Button is disabled');
            // Prevent the browser default action (Going back):
            if (userdetail.role == 'manager') {
                $window.history.back();
            } else {
                $location.path("/");
            }
            event.preventDefault();
        });
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager') {
                $window.history.back();
            } else {
                $location.path("/");
            }
        };
    API.Facilities.Recent(userdetail.user, function (res) {
        if (res.Code == 200) {

            $scope.facilities = res.Info.facilities;
        } else {

        }

    }, function (error) {
        alert(error);
    });


  $scope.Logout = function () {
      $cookies.remove('userDetails');
    $location.path("/");
  };

  function CreateUser(){
    $scope.user._v = 0;
    if($scope.CreateUserForm.firstname.$valid && $scope.CreateUserForm.lastname.$valid){
      $scope.user_id = API.Create.User($scope.user,function(res){
        if(res.Code == 200){
            swal({
                title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                text: res.Info,
                width: "450px",
                confirmButtonText: 'Ok'
            });
          $location.path("/users");
        }else {
          swal({
            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
            text: res.Info,
            width: "450px",
            confirmButtonText: 'Ok'
          });
        }
      },function (error) {
          swal({
              title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
              text: 'Opps try sometime later',
              width: "450px",
              confirmButtonText: 'Ok'
          });
      });
    }
  }

    $scope.clearForm = function () {
        $scope.user = {};
    };

  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  }
}]);