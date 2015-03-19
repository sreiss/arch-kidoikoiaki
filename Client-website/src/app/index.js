'use strict';

angular.module('kid', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngRoute', 'ngMaterial'])
  .config(function ($routeProvider,$mdThemingProvider) {
    $mdThemingProvider
      .theme('default')
      .primaryPalette('deep-orange')
      .accentPalette('teal',{
        'default': '500'
      })


    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html'
      })
      .when('/depenses',{
        templateUrl:'components/transaction/transaction.html',
        controller: 'TransCtrl'
      })
      .when('/participants',{
        templateUrl:'components/participant/participant.html',
        controller: 'PartsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      })
  });
