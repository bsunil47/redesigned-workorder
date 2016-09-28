'use strict';

angular.module('PGapp.createcategory', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create_category', {
            templateUrl: 'view/createcategory/create_category.html',
            controller: 'CreateCategoryCtrl'
        });
    }])

    .controller('CreateCategoryCtrl', ["$scope", "$cookies", "$location", 'API', function ($scope, $cookies, $location, API) {
        $scope.CreateCategory = CreateCategory;
        $scope.category = {
            category_name: "",
            facility_number: ""
        };

        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');

        $scope.Logout = function () {
            $cookies.remove('userDetails');
            $location.path("/");
        };

        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        };
        API.Facilities.Recent(userdetail.user, function (res) {
            if (res.Code == 200) {

                $scope.facilities = res.Info.facilities;
            } else {

            }

        }, function (error) {
            alert(error);
        });

        function CreateCategory() {
            if ($scope.CreateCategoryForm.category_name.$valid && $scope.CreateCategoryForm.facility_number.$valid) {
                $scope.category_id = API.CreateCategory.Category($scope.category, function (res) {
                    if (res.Code == 200) {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: 'Sucessfully created category',
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        $location.path("/categories");
                    } else {
                        swal({
                            title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                            text: 'Error creating category',
                            width: "450px",
                            confirmButtonText: 'Ok'
                        });
                        //$scope.CreateUserForm.email.error = true;
                    }
                }, function (error) {
                    swal({
                        title: '<a href="javascript:void(0)"><img src="/images/logo.png" alt="Prysmian Group"><br>',
                        text: "Oop's.. Something went worng.. Try again later",
                        width: "450px",
                        confirmButtonText: 'Ok'
                    });
                });
            }
        }

        $scope.clearForm = function () {
            $scope.category = {};
        };

    }]);