'use strict';

angular.module('PGapp.categorylist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/categories', {
            templateUrl: 'view/categorylist/categorylist.html',
            controller: 'CategoryListCtrl'
        });
    }])

    .controller('CategoryListCtrl', ["$scope", "$cookies", "$location", "$filter", "$window", 'API', function ($scope, $cookies, $location, $filter, $window, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            $window.history.back();
        };

        var facilities;
        API.Facilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.facilities = res.Info.facilities;
                //$cookies.putObject('facilities', res.Info.facilities);
                facilities = $cookies.getObject('facilities');
                //$cookies.put('userDetails',res)
            } else {

            }

        }, function (error) {
            alert(error);
        });



        API.Categories.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.categories = res.Info.categories;
                //$cookies.put('userDetails',res)
            } else {

            }

        }, function (error) {
            alert(error);
        });
        var status_list;
        API.Status.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                status_list = res.Info.status_list;
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
        $scope.showFacility = function (facility_number) {
            var facilities_numbers = "";
            var facility_length = facility_number.length;
            for (var faci in facility_number) {
                var found = $filter('getByFacilityNumber')('facility_number', facility_number[faci].facility_number, facilities);
                if (angular.isUndefined(found) || found === null) {
                    facilities_numbers = facilities_numbers
                } else {
                    if (facility_length - 1 <= faci) {
                        facilities_numbers = facilities_numbers + found.facility_name;
                    } else {
                        facilities_numbers = facilities_numbers + found.facility_name + ", ";
                    }
                }
            }
            return facilities_numbers;
        };
        $scope.showStatus = function (status_number) {
            var found = $filter('getByFacilityNumber')('status_number', status_number, status_list);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.status_name;
        }
    }]);

