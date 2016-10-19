'use strict';

angular.module('PGapp.searchpmtask', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/search_PM_task', {
            templateUrl: 'view/SPMTask/s_pm_task.html',
            controller: 'SPMTaskCtrl'
        });
    }])

    .controller('SPMTaskCtrl', ["$scope", "$cookies", "$location", "$window", 'API', function ($scope, $cookies, $location, $window, API) {
        $scope.workOrder = {
            wo_datefrom: ""
        };
        $scope.submitDisable = true;
        var currentDt = new Date();
        /*$scope.maxDate = new Date(
            currentDt.getFullYear(),
            currentDt.getMonth(),
         currentDt.getDate());*/
        ///$scope.maxDate = new Date();
        $scope.datefrom;
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