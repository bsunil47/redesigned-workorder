'use strict';
var userdetail;
angular.module('PGapp.changepassword', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/change_password', {
    templateUrl: 'view/changepassword/changepassword.html',
    controller: 'ChangePasswordCtrl'
  });
}])

    .controller('ChangePasswordCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
  $scope.ChangePassword = ChangePassword;
  if(!$cookies.get('userDetails')){
    $location.path('login');
  }

  userdetail = $cookies.getObject('userDetails');
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
  $scope.user = {
    id:userdetail.user._id,
    p_password:'',
    password:'',
    c_password:''
  };
  $scope.Logout = function () {
      $cookies.remove('userDetails');
    $location.path("/");
  };
  function ChangePassword(){
    $scope.user_id = API.ChangePassword.save($scope.user,function(res){
      if(res.Code == 200){
        swal({
          title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
          text: 'Successfully Changed password',
          width: "450px",
          confirmButtonText: 'Ok'
        });
        $location.path("/");
      }else {
        swal({
          title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
          text: 'Error with changing Password',
          width: "450px",
          confirmButtonText: 'Ok'
        });
        $scope.ChangePasswordForm.password.error = true;
      }
    },function (error) {
      swal({
        title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
        text: "Oop's.. Something went worng.. Try again later",
        width: "450px",
        confirmButtonText: 'Ok'
      });
      console.log(error)
    });
  }

  $scope.redirectLoc = function (reloc) {
    $location.path(reloc);
  }
}]);

PGapp.directive('passwordMatch', [function () {
  return {
    restrict: 'A',
    scope:true,
    require: 'ngModel',
    link: function (scope, elem , attrs,control) {
      var checker = function () {

        //get the value of the first password
        var e1 = scope.$eval(attrs.ngModel);

        //get the value of the other password
        var e2 = scope.$eval(attrs.passwordMatch);
        return e1 == e2;
      };
      scope.$watch(checker, function (n) {

        //set the form control to valid if both
        //passwords are the same, else invalid
        control.$setValidity("unique", n);
      });
    }
  };
}]);

PGapp.directive('equalPassword', [function () {
  return {
    require:'ngModel',
    restrict:'A',
    link:function (scope, el, attrs, ctrl) {

      //TODO: We need to check that the value is different to the original

      //using push() here to run it as the last parser, after we are sure that other validators were run
      ctrl.$parsers.push(function (viewValue) {
        /*if (viewValue == userdetail.user.password) {
          Users.query({email:viewValue}, function (users) {
            if (users.length === 0) {
              ctrl.$setValidity('equalPassword', true);
            } else {
              ctrl.$setValidity('equalPassword', false);
            }
          });
          return viewValue;
        }*/

        if (viewValue == userdetail.user.password) {
              ctrl.$setValidity('equalPassword', true);
        }else {
            ctrl.$setValidity('equalPassword', false);
      }
        return viewValue;
      });
    }
  };
}]);