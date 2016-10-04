'use strict';

angular.module('PGapp.searchreporthour', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/search_report_hour', {
            templateUrl: 'view/SreportHour/s_report_hour.html',
            controller: 'SreportHour'
        });
    }])

    .controller('SreportHour', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
        $scope.workOrder = {
        };
        var currentDt = new Date();
        $scope.maxDate = new Date(
            currentDt.getFullYear(),
            currentDt.getMonth(),
            currentDt.getDate());

        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            $window.history.back();
        };
        API.Facilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.facilities = res.Info.facilities;
                $scope.workOrder.facilities = 0;
            } else {

            }

        }, function (error) {
            alert(error);
        });

        API.Equipments.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.equipments = res.Info.equipments;
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

        $scope.$watch("datefrom", function (newValue, oldValue) {
            if (!angular.isUndefined($scope.datefrom)) {
                $scope.workOrder.wo_datefrom = new Date($scope.datefrom).valueOf();
            }
        });
        $scope.$watch("dateto", function (newValue, oldValue) {
            if (!angular.isUndefined($scope.dateto)) {
                $scope.workOrder.wo_dateto = new Date($scope.dateto).valueOf();
            }
        });
    }]);