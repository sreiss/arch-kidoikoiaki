'use strict';

angular.module('kid').controller('archSheetNewController', function($scope, $location, $mdToast, Sheet,$stateParams, $state)
{
  $scope.toastPosition =
  {
    bottom: false,
    top: true,
    left: false,
    right: true
  };

  $scope.getToastPosition = function ()
  {
    return Object.keys($scope.toastPosition).filter(function (pos)
    {
      return $scope.toastPosition[pos];
    })
    .join(' ');
  };

  $scope.newSheet = function()
  {
    Sheet.get({}, function(result)
    {
      if(result.count > 0)
      {
        $state.transitionTo('sheet.participants', {'idSheet' : result.data.she_reference})
      }
      else
      {
        $mdToast.show($mdToast.simple()
          .content('Une erreur est survenue à la création de la feuille.')
          .position($scope.getToastPosition())
          .hideDelay(3000)
        );
      }
    },
    function(responseError)
    {
      $mdToast.show($mdToast.simple()
        .content('Une erreur est survenue à la création de la feuille.')
        .position($scope.getToastPosition())
        .hideDelay(3000)
      );
    });
  };
});
