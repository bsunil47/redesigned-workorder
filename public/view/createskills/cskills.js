'use strict';

angular.module('PGapp.createskills', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_skill', {
            templateUrl: 'view/createskills/create_skills.html',
            controller: 'CreateSkillsCtrl'
        });
    }])

    .controller('CreateSkillsCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager') {
                $window.history.back();
            } else {
                $location.path("/");
            }
        };
        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };

        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };
        $scope.CreateSkill = CreateSkill;
        $scope.skill = {
            facility_number: "",
            skill_name: ""
        };
        API.Facilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.facilities = res.Info.facilities;
            } else {

            }

        }, function (error) {
            alert(error);
        });
        function CreateSkill() {
            if ($scope.CreateSkillForm.skill_name.$valid && $scope.CreateSkillForm.facility_number.$valid) {
                $scope.skill_id = API.CreateSkill.Skill($scope.skill, function (res) {
                    if (res.Code == 200) {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: res.Info,
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        $location.path("/skills");
                    } else {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: res.Info,
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        //$scope.CreateUserForm.email.error = true;
                    }
                }, function (error) {
                    swal({
                        title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                        text: "Oops try after sometime",
                        width: "450px",
                        confirmButtonText: 'Ok'
                    });
                });
            }
        }

        $scope.clearForm = function () {
            $scope.skill = {};
        };
    }]);