'use strict'

angular.module('kid')
  .controller('archCategoriesController', function ($scope, Categories, Category, Sheet, $stateParams, $state, $mdToast, archSheetService, archCategoryService, archTransactionService, archTranslateService)
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
        archTranslateService('CATEGORY_ERROR_GET_CATEGORIES').then(function(translateValue)
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

    $scope.deleteCategory = function(sheetId, categoryId)
    {
      archCategoryService.showDeleteDialog(sheetId, categoryId);
    };

    $scope.editCategory = function(id)
    {
      $state.go('sheet.categoryEdit', {'idCategory' : id});
    };
  })
  .controller('archCategoryNewController', function ($scope, Category, $location, $mdToast, Sheet, $stateParams, $state, archSheetService, archTranslateService)
  {
    $scope.category = new Category();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.category.ctg_sheet = sheet._id;
    })
    .catch(function()
    {
      archTranslateService('SHEET_NEW_SHEET_REQUIRED').then(function(translateValue)
      {
        $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        $state.go('sheet.home');
      });
    });

    $scope.newCategory = function ()
    {
      $scope.category.$save(function()
      {
        archTranslateService('CATEGORY_NEW_SUCCESS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          $state.go('sheet.categories');
        });
      },
      function()
      {
        archTranslateService('CATEGORY_NEW_FAIL').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        });
      })
    }
  })
  .controller('archCategoryEditController', function ($scope, Category, $state, $stateParams, $mdToast, archCategoryService, archTranslateService)
  {
    $scope.category = new Category();

    archCategoryService.getCategory($stateParams.idCategory).then(function(category)
    {
      $scope.category = category;
    })
    .catch(function()
    {
      archTranslateService('CATEGORY_ERROR_GET_CATEGORY').then(function(translateValue)
      {
        $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        $state.go('sheet.categories');
      });
    });

    $scope.editCategory = function ()
    {
      Category.update({category:$scope.category}, function()
      {
        archTranslateService('CATEGORY_EDIT_SUCCESS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          $state.go('sheet.categories');
        });
      },
      function()
      {
        archTranslateService('CATEGORY_EDIT_FAIL').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        });
      });
    }
  });
