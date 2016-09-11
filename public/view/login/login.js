'use strict';

angular.module('PGapp.login', ['ngRoute','ngAnimate', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'view/login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ["$scope","$cookies","$location",'API',function($scope,$cookies,$location,API) {
    $scope.Login = Login;
    $scope.user = {
        username:'',
        password:''
    };
    if($cookies.get('userDetails')){
        $location.path('dashboard');
    }
    function Login(){
        if($scope.loginForm.username.$valid && $scope.loginForm.password.$valid){
            $scope.user_id = API.Login.login($scope.user,function(res){
                if(res.Code == 200){
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 1);
                    $cookies.putObject('userDetails',res.Info,{'expires': expireDate});


                    $location.path('dashboard');


                    //$cookies.put('userDetails',res)
                }else {
                    $scope.loginForm.username.error = true;
                }

            },function (error) {
                alert(error);
            });
        }


    }
}]);