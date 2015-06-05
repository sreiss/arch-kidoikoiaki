'use strict';
angular.module('kid')
  .controller('archSheetController', function($scope, $location, $mdToast, Sheet, $stateParams, $state, archSheetService)
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
  .controller('archSheetNewController', function($scope, $location, $mdToast, Sheet, $stateParams, $state, archTranslateService)
  {
    $scope.sheet = new Sheet();

    $scope.sanitizeReference = function()
    {
      $scope.sheet.she_reference = $scope.sheet.she_reference.replace(/[^\w]/gi, '');
    }

    $scope.newSheet = function()
    {
      $scope.sheet.she_path = $state.href('home', {}, {absolute: true}) + 'sheet/' + $scope.sheet.she_reference + '/';

      $scope.sheet.$save(function(result)
      {
        archTranslateService('SHEET_NEW_SUCCESS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          $state.transitionTo('sheet.home', {'idSheet' : result.data.she_reference})
        });
      },
      function(err)
      {
        var errMessage = err.data.error.message || '';
        if(errMessage == 'SHE_REFERENCE_ALREADY_USED')
        {
          archTranslateService('SHEET_NEW_FAIL_ALREADY_USED').then(function(translateValue)
          {
            $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          });
        }
        else if(errMessage == 'SHE_CREATION_DATE_TO_SOON')
        {
          archTranslateService('SHEET_NEW_FAIL_SPAM').then(function(translateValue)
          {
            $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          });
        }
        else
        {
          archTranslateService('SHEET_NEW_SUCCESS').then(function(translateValue)
          {
            $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          });
        }
      })
    };
  })
  .controller('archSheetEditController', function ($scope, Sheet, $state, $stateParams, $mdToast, archSheetService, archTranslateService)
  {
    $scope.sheet = new Sheet();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.sheet = sheet;
    })
    .catch(function()
    {
      archTranslateService('SHEET_ERROR_GET_SHEET').then(function(translateValue)
      {
        $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        $state.go('sheet.home');
      });
    });

    $scope.editSheet = function ()
    {
      Sheet.update({sheet:$scope.sheet}, function()
      {
        archTranslateService('SHEET_EDIT_SUCCESS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          $state.go('sheet.home');
        });
      },
      function()
      {
        archTranslateService('SHEET_EDIT_FAIL').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        });
      });
    }
  });
