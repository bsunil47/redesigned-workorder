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
            if (userdetail.role == 'manager' || userdetail.role == 'admin') {
                $location.path(reloc);
            } else {
                $location.path("/");
            }
        };

        API.SFacilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {
                if(userdetail.role != 'admin'){
                    console.log(res.Info.facilities);
                    $scope.workOrder.wo_facility = res.Info.facilities[0].facility_number;
                    $scope.facilities = res.Info.facilities;
                    console.log("$scope.facilities : " + JSON.stringify($scope.facilities));
                    $scope.selected_facility = res.Info.facilities[0].facility_number;
                    console.log("$scope.selected_facility: "+ $scope.selected_facility);
                }
                else{
                     API.Facilities.Recent(userdetail.user, function (res) {
                if (res.Code == 200) {

                    $scope.facilities = res.Info.facilities;
                    $scope.workOrder.facilities = 0;
                } else {

                }

            }, function (error) {
                alert(error);
            });
                }
                
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
            //     if (isDate($scope.datefrom) && new Date($scope.datefrom).valueOf() > 0) {
            //         console.log($scope.datefrom);
                     $scope.workOrder.wo_datefrom = new Date($scope.datefrom).valueOf();
            //         $scope.minDate = new Date($scope.datefrom);
                    $scope.submitDisable = false;
            //     } else {
            //         $scope.datefrom = "";
            //     }
            }
        });
        $scope.$watch("dateto", function (newValue, oldValue) {
             if (!angular.isUndefined($scope.dateto)) {
            //     if (isDate($scope.dateto) && new Date($scope.dateto).valueOf() > 0) {
                     $scope.workOrder.wo_dateto = new Date($scope.dateto).valueOf();
            //         $scope.maxDate = new Date($scope.dateto);
            //     } else {
            //         $scope.dateto = "";
            //         $scope.workOrder.wo_dateto = "";
            //     }
             }
        })
        $scope.$watch("facility", function (newValue, oldValue) {
            if (!angular.isUndefined($scope.facility)) {
                $scope.selected_facility = $scope.facility;
                // API.SCategory.Recent({facility_number: $scope.selected_facility}, function (res) {
                //     if (res.Code == 200) {

                //         $scope.categories = res.Info.categories;
                //         console.log($scope.categories);
                //         //$scope.workOrder.categories = "0";
                //         //$cookies.put('userDetails',res)
                //     } else {

                //     }

                // }, function (error) {
                //     alert(error);
                // });
                // API.SEquipment.Recent({facility_number: $scope.selected_facility}, function (res) {
                //     if (res.Code == 200) {
                //         $scope.equipments = res.Info.equipments;
                //     } else {

                //     }

                // }, function (error) {
                //     alert(error);
                // });
            }
        })
    }]);