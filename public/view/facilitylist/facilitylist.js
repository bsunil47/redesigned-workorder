'use strict';

angular.module('PGapp.facilitylist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/facilities', {
            templateUrl: 'view/facilitylist/facilitylist.html',
            controller: 'FacilityListCtrl'
        });
    }])

    .controller('FacilityListCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        API.Facilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.facilities = res.Info.facilities;
                $cookies.putObject('facilities', res.Info.facilities);
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
        }
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
        $scope.showStatus = function (status_number) {
            var found = $filter('getByFacilityNumber')('status_number', status_number, status_list);
            if (angular.isUndefined(found) || found === null) {
                return null;
            }
            return found.status_name;
        }

    }]);

