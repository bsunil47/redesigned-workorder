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

        function CreateCategory() {
            if ($scope.CreateCategoryForm.category_name.$valid && $scope.CreateCategoryForm.facility_number.$valid) {
                $scope.category_id = API.CreateCategory.Category($scope.category, function (res) {
                    if (res.Code == 200) {
                        $location.path("/categories");
                    } else {
                        //$scope.CreateUserForm.email.error = true;
                    }
                }, function (error) {
                    alert(error);
                });
            }
        }

    }]);