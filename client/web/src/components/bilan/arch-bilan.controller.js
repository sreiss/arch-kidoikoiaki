'use strict'

angular.module('kid')
  .controller('archBilanController', function ($scope, Sheet ,$stateParams, $mdToast, $state, archSheetService, Bilan)
  {
    $scope.debts = new Array();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.debts = Bilan.query({id: sheet._id});
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
      $state.go('sheet.home');
    });
  });

