'use strict';
angular.module('kid')
  .controller('archSheetController', function($scope, $location, $mdToast, Sheet, $stateParams, $state, archSheetService)
  {
    console.log('archSheetController');

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.sheet = sheet;
      $scope.sheet.she_path = $state.href($state.current.name, $state.params, {absolute: true})

      console.log('getCurrentSheet');
      console.log($scope.sheet);
    });

    $scope.editSheet = function(id)
    {
      $state.go('sheet.sheetEdit', {'idSheet' : id});
    };
  })
  .controller('archSheetNewController', function($scope, $location, $mdToast, Sheet, $stateParams, $state, archSheetService)
  {
    $scope.sheet = new Sheet();

    archSheetService.getSheet().then(function(sheet)
    {
      $scope.sheet.she_reference = sheet.she_reference;
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Une erreur est survenue à la génération de la référence de la feuille.').position('top right').hideDelay(3000));
      $state.go('sheet.home');
    });

    $scope.newSheet = function()
    {
      Sheet.update({sheet:$scope.sheet}, function()
      {
        $mdToast.show($mdToast.simple().content('Feuille créée avec succés.').position('top right').hideDelay(3000));
        $state.transitionTo('sheet.home', {'idSheet' : $scope.sheet.she_reference})
      },
      function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue à la création de la feuille.').position('top right').hideDelay(3000));
      })
    };
  })
  .controller('archSheetEditController', function ($scope, Sheet, $state, $stateParams, $mdToast, archSheetService)
  {
    $scope.sheet = new Sheet();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.sheet = sheet;
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Une erreur est survenue à la récupération de la feuille.').position('top right').hideDelay(3000));
      $state.go('sheet.home');
    });

    $scope.editSheet = function ()
    {
      Sheet.update({sheet:$scope.sheet}, function()
      {
        $mdToast.show($mdToast.simple().content('Feuille modifiée avec succés.').position('top right').hideDelay(3000));
        $state.go('sheet.home');
      },
      function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue à la modification de la feuille.').position('top right').hideDelay(3000));
      });
    }
  });
