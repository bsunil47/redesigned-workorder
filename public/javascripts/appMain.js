'use strict';

// Declare app level module which depends on views, and components
var PGapp = angular.module('PGapp', [
  'ngRoute',
  'ngAnimate', 'ngCookies','ngResource','ngAria','ngMaterial',
  'PGapp.login',
  'PGapp.dashboard',
  'PGapp.cworkorder',
  'PGapp.eworkorder',
  'PGapp.sorders',
  'PGapp.partslist',
  'PGapp.systemsettings',
  'PGapp.changepassword',
    'PGapp.users',
  'PGapp.createuser'
]);
PGapp.
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/login'});

}]);
