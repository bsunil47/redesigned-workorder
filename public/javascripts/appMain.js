'use strict';

// Declare app level module which depends on views, and components
var PGapp = angular.module('PGapp', [
  'ngRoute',
  'ngAnimate', 'ngCookies', 'ngResource', 'ngAria', 'ngMaterial', 'dnTimepicker', 'mgcrea.ngStrap',
  'PGapp.login',
  'PGapp.dashboard',
  'PGapp.cworkorder',
  'PGapp.eworkorder',
  'PGapp.sorders',
  'PGapp.partslist',
  'PGapp.systemsettings',
  'PGapp.changepassword',
  'PGapp.users',
  'PGapp.createuser',
  'PGapp.createcategory',
  'PGapp.createclass',
  'PGapp.createequipment',
  'PGapp.createfacility',
  'PGapp.createpriority',
  'PGapp.createskills',
  'PGapp.categorylist',
  'PGapp.classlist',
  'PGapp.equipmentlist',
  'PGapp.facilitylist',
  'PGapp.prioritylist',
  'PGapp.skilllist',
  'PGapp.reportdashboard',
  'PGapp.searchreporthour',
  'PGapp.searchclosedreport',
  'PGapp.partsequipmentlist',
  'PGapp.createparts'

]);
PGapp.
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/login'});

}]);
