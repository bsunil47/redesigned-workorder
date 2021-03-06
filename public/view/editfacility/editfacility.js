'use strict';

angular.module('PGapp.editfacility', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/editfacility/:id', {
            templateUrl: 'view/editfacility/edit_facility.html',
            controller: 'EditFacilityCtrl'
        });
    }])

    .controller('EditFacilityCtrl', ["$scope", "$cookies", "$location", '$routeParams', '$window', 'API', function ($scope, $cookies, $location, $routeParams, $window, API) {
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
        var edit_facility_number = $routeParams.id;

        $scope.EditFacility = EditFacility;
        $scope.facility = {
            facility_number: "",
            facility_name: ""
        };

        API.GetFacility.Recent({facility_number: edit_facility_number}, function (res) {
            if (res.Code == 200) {
                console.log("Get Facility: " + JSON.stringify(res.Info.facility));
                $scope.facility = res.Info.facility;
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

        function EditFacility() {
            if (!$cookies.get('userDetails')) {
                $location.path('login');
            }
            if ($scope.EditFacilityForm.facility_name.$valid && $scope.EditFacilityForm.facility_number.$valid) {
                //$scope.facility_id =
                API.EditFacility.Facility($scope.facility, function (res) {

                    if (res.Code == 200) {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: "Facility details updated",
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        $location.path("/facilities");
                    } else {

                        $location.path("/facilities");
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }
    }]);