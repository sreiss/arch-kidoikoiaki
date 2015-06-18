'use strict';
angular.module('kid')
  .controller('archSheetController', function($scope, $location, Sheet, $stateParams, $state, archSheetService)
  {
    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.sheet = sheet;
      $scope.sheet.she_path = $state.href($state.current.name, $state.params, {absolute: true})
    });

    $scope.editSheet = function(id)
    {
      $state.go('sheet.sheetEdit', {'idSheet' : id});
    };
  })
  .controller('archSheetNewController', function($scope, $location, Sheet, $stateParams, $state, archToastService, httpConstant)
  {
    $scope.sheet = new Sheet();

    $scope.updateReference = function()
    {
      $scope.sheet.she_reference = $scope.sheet.she_name.replace(/[^\w]/gi, '');
    }

    $scope.sanitizeReference = function()
    {
      $scope.sheet.she_reference = $scope.sheet.she_reference.replace(/[^\w]/gi, '');
    }

    $scope.newSheet = function()
    {
      $scope.sheet.she_path = httpConstant.clientUrl;

      $scope.sheet.$save(function(result)
      {
        archToastService.showToast('SHEET_NEW_SUCCESS', 'success');
        $state.transitionTo('sheet.home', {'idSheet' : result.data.she_reference})
      },
      function(err)
      {
        var errMessage = err.data.error.message || '';
        if(errMessage == 'SHE_REFERENCE_ALREADY_USED')
        {
          archToastService.showToast('SHEET_NEW_FAIL_ALREADY_USED', 'error');
        }
        else if(errMessage == 'SHE_CREATION_DATE_TO_SOON')
        {
          archToastService.showToast('SHEET_NEW_FAIL_SPAM', 'error');
        }
        else
        {
          archToastService.showToast('SHEET_NEW_FAIL', 'error');
        }
      })
    };
  })
  .controller('archSheetEditController', function ($scope, Sheet, $state, $stateParams, archSheetService, archToastService)
  {
    $scope.sheet = new Sheet();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.sheet = sheet;
    })
    .catch(function()
    {
      archToastService.showToast('SHEET_ERROR_GET_SHEET', 'error');
      $state.go('sheet.home');
    });

    $scope.editSheet = function ()
    {
      Sheet.update({sheet:$scope.sheet}, function()
      {
        archToastService.showToast('SHEET_EDIT_SUCCESS', 'success');
        $state.go('sheet.home');
      },
      function()
      {
        archToastService.showToast('SHEET_EDIT_FAIL', 'error');
      });
    }
  });
