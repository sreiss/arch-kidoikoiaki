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
  .controller('archSheetNewController', function($scope, $location, $mdToast, Sheet, $stateParams, $state, archSheetService)
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
        $mdToast.show($mdToast.simple().content('Feuille créée avec succés.').position('top right').hideDelay(3000));
        $state.transitionTo('sheet.home', {'idSheet' : result.data.she_reference})
      },
      function(err)
      {
        var errMessage = err.data.error.message || '';
        if(errMessage == 'SHE_REFERENCE_ALREADY_USED')
        {
          $mdToast.show($mdToast.simple().content('Une feuille utilisant cette référence existe déjà.').position('top right').hideDelay(3000));
        }
        else if(errMessage == 'SHE_CREATION_DATE_TO_SOON')
        {
          $mdToast.show($mdToast.simple().content("Une feuille vient d'être créée, veuillez patienter 5 secondes avant une nouvelle tentative.").position('top right').hideDelay(3000));
        }
        else
        {
          $mdToast.show($mdToast.simple().content('Une erreur est survenue à la création de la feuille.').position('top right').hideDelay(3000));
        }
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
