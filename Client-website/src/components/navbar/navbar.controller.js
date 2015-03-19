'use strict';

angular.module('kid')
  .controller('NavCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };
  }]);
