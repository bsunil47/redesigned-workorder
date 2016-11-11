'use strict';

angular.module('PGapp.searchclosedreport', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/search_closed_report', {
            templateUrl: 'view/SreportClosed/s_report_closed.html',
            controller: 'SReportClosedCtrl'
        });
    }])

    .controller('SReportClosedCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
        $scope.workOrder = {};
        var currentDt = new Date();
        $scope.submitDisable = true;
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        $scope.redirectBack = function (reloc) {
            if (userdetail.role == 'manager' || userdetail.role == 'admin') {
                $location.path(reloc);
            } else {
                $location.path("/");
            }
        };
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
                $scope.workOrder.categories = "0";
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

        $scope.showDetails = function () {
            console.log('ad');
        }

        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };

        $scope.$watch("datefrom", function (newValue, oldValue) {
            $scope.submitDisable = true;
            if (!angular.isUndefined($scope.datefrom)) {
                if (isDate($scope.datefrom) && new Date($scope.datefrom).valueOf() > 0) {
                    console.log($scope.datefrom);
                    $scope.workOrder.wo_datefrom = new Date($scope.datefrom).valueOf();
                    $scope.minDate = new Date($scope.datefrom);
                    $scope.submitDisable = false;
                } else {
                    $scope.datefrom = "";
                }
            }
        });
        $scope.$watch("dateto", function (newValue, oldValue) {
            if (!angular.isUndefined($scope.dateto)) {
                if (isDate($scope.dateto) && new Date($scope.dateto).valueOf() > 0) {
                    $scope.workOrder.wo_dateto = new Date($scope.dateto).valueOf();
                    $scope.maxDate = new Date($scope.dateto);
                } else {
                    $scope.dateto = "";
                    $scope.workOrder.wo_dateto = "";
                }
            }
        })

    }]);

var isDate = function (date) {
    return (new Date(date) !== "Invalid Date" && !isNaN(new Date(date)) ) ? true : false;
}