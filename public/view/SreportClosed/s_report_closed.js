'use strict';

angular.module('PGapp.searchclosedreport', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/search_closed_report', {
            templateUrl: 'view/SreportClosed/s_report_closed.html',
            controller: 'SReportClosedCtrl'
        });
    }])

    .controller('SReportClosedCtrl', ["$scope", "$cookies", "$location", 'API', function ($scope, $cookies, $location, API) {
        $scope.workOrder = {
            wo_datefrom: ""
        };
        $scope.datefrom;
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

        API.Categories.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.categories = res.Info.categories;
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
        $scope.changeDate = function () {
            $scope.workOrder.wo_datefrom = $scope.workOrder.wo_datefrom;
        };
        $scope.$watch("datefrom", function (newValue, oldValue) {
            if (!angular.isUndefined($scope.dateto)) {
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