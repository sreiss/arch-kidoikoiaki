'use strict'

angular.module('kid')
  .controller('archBilanController', function ($scope, Sheet ,$stateParams, $state, archToastService, archSheetService, archBilanService)
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

            archBilanService.getBalanceChart(sheet._id, debts).then(function(chart)
            {
              $scope.balanceChart = chart;
            })
          })
          .catch(function()
          {
            archToastService.showToast('BILAN_ERROR_GET_DEBTS', 'error');
          });
        })
        .catch(function()
        {
          archToastService.showToast('BILAN_ERROR_GENERATE_BILAN', 'error');
        });
      })
      .catch(function()
      {
        archToastService.showToast('BILAN_ERROR_DELETE_PREVIOUS_DEBTS', 'error');
      });
    })
    .catch(function()
    {
      archToastService.showToast('SHEET_NEW_SHEET_REQUIRED', 'error');
      $state.go('sheet.home');
    });
  });

