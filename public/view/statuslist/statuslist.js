'use strict';

angular.module('PGapp.statuslist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/status', {
            templateUrl: 'view/statuslist/statuslist.html',
            controller: 'StatusListCtrl'
        });
    }])

    .controller('StatusListCtrl', ["$scope", "$cookies", "$location", "$filter", "$window", 'API', function ($scope, $cookies, $location, $filter, $window, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            $window.history.back();
        };
        API.Status.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.allstatus = res.Info.status_list;
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
        // var status_list;
        // API.Status.Recent(userdetail.user, function (res) {
        //     if (res.Code == 200) {

        //         status_list = res.Info.status_list;
        //         //$cookies.put('userDetails',res)
        //     } else {

        //     }

        // }, function (error) {
        //     alert(error);
        // });
        // $scope.showStatus = function (status_number) {
        //     var found = $filter('getByFacilityNumber')('status_number', status_number, status_list);
        //     if (angular.isUndefined(found) || found === null) {
        //         return null;
        //     }
        //     return found.status_name;
        // }
    }]);

