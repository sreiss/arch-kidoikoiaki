'use strict'

angular.module('kid')
  .controller('archBilanController', function ($scope, Sheet ,$stateParams, $mdToast, $state, archSheetService, archBilanService)
  {
    $scope.debts = new Array();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      archBilanService.getDebts(sheet._id).then(function(debts)
      {
        $scope.debts = debts;
      })
      .catch(function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue lors de la récupération du bilan.').position('top right').hideDelay(3000));
      });
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
      $state.go('sheet.home');
    });
  });

