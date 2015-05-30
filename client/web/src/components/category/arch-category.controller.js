'use strict'

angular.module('kid')
  .controller('archCategoriesController', function ($scope, Categories, Category, Sheet, $stateParams, $state, $mdToast, archSheetService, archCategoryService, archTransactionService)
  {
    $scope.categories = new Array();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.sheet = sheet;

      archCategoryService.getCategories(sheet._id).then(function(categories)
      {
        $scope.categories = categories;
      })
      .catch(function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue lors de la récupération des catégories.').position('top right').hideDelay(3000));
      });
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
      $state.go('sheet.home');
    });

    $scope.deleteCategory = function(id)
    {
      if(confirm('Souhaitez-vous réellement supprimer cette catégorie ?'))
      {
        var isLinked = false;

        archTransactionService.getTransactions($scope.sheet._id).then(function(transactions)
        {
          transactions.forEach(function(transaction)
          {
            if(transaction.trs_category._id == id)
            {
              isLinked = true;
            }
          });

          if(!isLinked)
          {
            archCategoryService.deleteCategory(id).then(function()
            {
              $mdToast.show($mdToast.simple().content('Catégorie supprimée avec succés.').position('top right').hideDelay(3000));
              $state.go($state.current, {}, {reload: true});
            })
            .catch(function()
            {
              $mdToast.show($mdToast.simple().content('Une erreur est survenue à la suppression de la catégorie.').position('top right').hideDelay(3000));
            });
          }
          else
          {
            $mdToast.show($mdToast.simple().content('Impossible de supprimer cette catégorie, celle-ci est liée à une dépense.').position('top right').hideDelay(3000));
          }
        })
        .catch(function()
        {
          $mdToast.show($mdToast.simple().content('Une erreur est survenue lors de la vérification des dépendances.').position('top right').hideDelay(3000));
        });
      }
    };

    $scope.editCategory = function(id)
    {
      $state.go('sheet.categoryEdit', {'idCategory' : id});
    };
  })
  .controller('archCategoryNewController', function ($scope, Category, $location, $mdToast, Sheet, $stateParams, $state, archSheetService)
  {
    $scope.category = new Category();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.category.ctg_sheet = sheet._id;
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
      $state.go('sheet.home');
    });

    $scope.newCategory = function ()
    {
      $scope.category.$save(function()
      {
        $mdToast.show($mdToast.simple().content('Catégorie créée avec succés.').position('top right').hideDelay(3000));
        $state.go('sheet.categories');
      },
      function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue à la création de la catégorie.').position('top right').hideDelay(3000));
      })
    }
  })
  .controller('archCategoryEditController', function ($scope, Category, $state, $stateParams, $mdToast, archCategoryService)
  {
    $scope.category = new Category();

    archCategoryService.getCategory($stateParams.idCategory).then(function(category)
    {
      $scope.category = category;
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Une erreur est survenue à la récupération de la catégorie.').position('top right').hideDelay(3000));
      $state.go('sheet.categories');
    });

    $scope.editCategory = function ()
    {
      Category.update({category:$scope.category}, function()
      {
        $mdToast.show($mdToast.simple().content('Catégorie modifiée avec succés.').position('top right').hideDelay(3000));
        $state.go('sheet.categories');
      },
      function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue à la modification de la catégorie.').position('top right').hideDelay(3000));
      });
    }
  });
