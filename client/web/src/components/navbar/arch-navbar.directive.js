'use strict';

angular.module('kid').directive('archNavbar', function () {
    return {
      restrict: 'E',
      templateUrl: 'components/navbar/arch-navbar.html',
      controller: function($scope, $mdSidenav) {
        $scope.openLeftMenu = function()
        {
          $mdSidenav('left').toggle();
        }
      }
    };
  });
