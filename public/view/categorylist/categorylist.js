'use strict';

angular.module('PGapp.categorylist', ['ngRoute', 'ngAnimate', 'ngCookies'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/categories', {
            templateUrl: 'view/categorylist/categorylist.html',
            controller: 'CategoryListCtrl'
        });
    }])

    .controller('CategoryListCtrl', ["$scope", "$cookies", "$location", "$filter", 'API', function ($scope, $cookies, $location, $filter, API) {
        if (!$cookies.get('userDetails')) {
            $location.path('login');
        }
        var userdetail = $cookies.getObject('userDetails');
        var facilities = $cookies.getObject('facilities');

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
            $cookies.remove('userDetails')
            $location.path("/");
        }
        $scope.redirectLoc = function (reloc) {
            $location.path(reloc);
        }
        $scope.showFacility = function (facility_number) {
            var found = $filter('getByFacilityNumber')('facility_number', facility_number, facilities);
            return found.facility_name
        }
    }]);

