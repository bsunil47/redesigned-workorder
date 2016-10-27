'use strict';

angular.module('PGapp.edituser', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/edituser/:id', {
            templateUrl: 'view/edituser/edit_user.html',
            controller: 'EditUserCtrl'
        });
    }])

    .controller('EditUserCtrl', ["$scope", "$cookies", "$location", '$routeParams', '$window', 'API', function ($scope, $cookies, $location, $routeParams, $window, API) {

        var edit_user_email = $routeParams.id;
        console.log("routeParams in edituserjs: " + $routeParams.id);
        $scope.EditUser = EditUser;
        $scope.user = {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            userrole: '',
            status: 1,
            password: ''
        };

        // if(!$cookies.get('userDetails')){
        //   $location.path('login');
        // }
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager') {
                $window.history.back();
            } else {
                $location.path("/");
            }
        };
        console.log("User Details: " + JSON.stringify(userdetail));

        API.Roles.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.roles = res.Info.roles;
                API.GetUserDetails.Recent({user_email: edit_user_email}, function (res) {
                    if (res.Code == 200) {
                        $scope.user = res.Info.user;
                        $scope.user.userrole = res.Info.user.userrole;
                    }
                }, function (error) {
                    alert(error);

                });

            } else {

            }

        }, function (error) {
            alert(error);
        });
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

        function EditUser() {
            $scope.user.username = $scope.user.firstname + ' ' + $scope.user.lastname;
            $scope.user._v = 0;
            if ($scope.EditUserForm.firstname.$valid && $scope.EditUserForm.lastname.$valid) {
                API.EditUser.User($scope.user, function (res) {
                    if (res.Code == 200) {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: "User details updated",
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        $location.path("/users");
                    } else {
                        $location.path("/users");
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }

        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        }
    }]);