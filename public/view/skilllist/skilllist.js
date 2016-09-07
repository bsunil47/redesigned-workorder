'use strict';

angular.module('PGapp.skilllist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/skills', {
            templateUrl: 'view/skilllist/skilllist.html',
            controller: 'SkillListCtrl'
        });
    }])

    .controller('SkillListCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        API.Skills.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.skills = res.Info.skills;
                //$cookies.put('userDetails',res)
            } else {

            }

        }, function (error) {
            alert(error);
        });

        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };
        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };
        var facilities = $cookies.getObject('facilities');
        $scope.showFacility = function (facility_number) {
            var found = $filter('getByFacilityNumber')('facility_number', facility_number, facilities);
            return found.facility_name
        }
    }]);

