'use strict';

angular.module('PGapp.createskills', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_skill', {
            templateUrl: 'view/createskills/create_skills.html',
            controller: 'CreateSkillsCtrl'
        });
    }])

    .controller('CreateSkillsCtrl', ["$scope", "$cookies", "$location", 'API', function ($scope, $cookies, $location, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');

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
        function CreateSkill() {
            if ($scope.CreateSkillForm.skill_name.$valid && $scope.CreateSkillForm.facility_number.$valid) {
                $scope.skill_id = API.CreateSkill.Skill($scope.skill, function (res) {
                    if (res.Code == 200) {
                        $location.path("/skills");
                    } else {
                        //$scope.CreateUserForm.email.error = true;
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }
    }]);