'use strict'

angular.module('kid')
  .controller('archBilanController', function ($scope, Sheet ,$stateParams, $mdToast, $state, archTranslateService, archSheetService, archBilanService)
  {
    $scope.debts = new Array();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      archBilanService.deleteDebts(sheet._id).then(function()
      {
        archBilanService.generateBilan(sheet._id).then(function()
        {
          archBilanService.getDebts(sheet._id).then(function(debts)
          {
            $scope.debts = debts;
          })
          .catch(function()
          {
            archTranslateService('BILAN_ERROR_GET_DEBTS').then(function(translateValue)
            {
              $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
            });
          });
        })
        .catch(function()
        {
          archTranslateService('BILAN_ERROR_GENERATE_BILAN').then(function(translateValue)
          {
            $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          });
        });
      })
      .catch(function()
      {
        archTranslateService('BILAN_ERROR_DELETE_PREVIOUS_DEBTS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        });
      });
    })
    .catch(function()
    {
      archTranslateService('SHEET_NEW_SHEET_REQUIRED').then(function(translateValue)
      {
        $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        $state.go('sheet.home');
      });
    });
  });

