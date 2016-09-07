'use strict';

angular.module('PGapp.classlist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/classes', {
            templateUrl: 'view/classlist/classlist.html',
            controller: 'ClassListCtrl',
        });
    }])

    .controller('ClassListCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        API.Classes.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.classes = res.Info.classes;
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

