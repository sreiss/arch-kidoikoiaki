'use strict';

angular.module('kid')
  .controller('NavCtrl', function($scope, $mdSidenav){
    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };
  });
