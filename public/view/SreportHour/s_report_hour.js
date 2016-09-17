'use strict';

angular.module('PGapp.searchreporthour', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/search_report_hour', {
            templateUrl: 'view/SreportHour/s_report_hour.html',
            controller: 'SreportHour'
        });
    }])

    .controller('SreportHour', ["$scope", "$cookies", "$location", 'API', function ($scope, $cookies, $location, API) {
        $scope.workOrder = {
            wo_datefrom: ""
        };

        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        API.Facilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.facilities = res.Info.facilities;
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
        }
        $scope.$watch("datefrom", function (newValue, oldValue) {
            if (!angular.isUndefined($scope.datefrom)) {
                var currentDt = new Date($scope.datefrom);
                var mm = currentDt.getMonth() + 1;
                mm = (mm < 10) ? '0' + mm : mm;
                var dd = currentDt.getDate();
                var yyyy = currentDt.getFullYear();
                var date = mm + '/' + dd + '/' + yyyy;
                $scope.workOrder.wo_datefrom = date;
            }
        });
        $scope.$watch("dateto", function (newValue, oldValue) {

            if (!angular.isUndefined($scope.dateto)) {
                console.log($scope.dateto);
                var currentDt = new Date($scope.dateto);
                var mm = currentDt.getMonth() + 1;
                mm = (mm < 10) ? '0' + mm : mm;
                var dd = currentDt.getDate();
                var yyyy = currentDt.getFullYear();
                var date = mm + '/' + dd + '/' + yyyy;
                $scope.workOrder.wo_dateto = date;
            }

        });
    }]);