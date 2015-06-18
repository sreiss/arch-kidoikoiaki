'use strict'

angular.module('kid')
  .controller('archCategoriesController', function ($scope, Categories, Category, Sheet, $stateParams, $state, archSheetService, archCategoryService, archToastService)
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
        archToastService.showToast('CATEGORY_ERROR_GET_CATEGORIES', 'error');
      });
    })
    .catch(function()
    {
      archToastService.showToast('SHEET_NEW_SHEET_REQUIRED', 'error');
      $state.go('sheet.home');
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
  .controller('archCategoryNewController', function ($scope, Category, $location, Sheet, $stateParams, $state, archSheetService, archToastService)
  {
    $scope.category = new Category();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.category.ctg_sheet = sheet._id;
    })
    .catch(function()
    {
      archToastService.showToast('SHEET_NEW_SHEET_REQUIRED', 'error');
      $state.go('sheet.home');
    });

    $scope.newCategory = function ()
    {
      $scope.category.$save(function()
      {
        archToastService.showToast('CATEGORY_NEW_SUCCESS', 'success');
        $state.go('sheet.categories');
      },
      function()
      {
        archToastService.showToast('CATEGORY_NEW_FAIL', 'error');
      })
    }
  })
  .controller('archCategoryEditController', function ($scope, Category, $state, $stateParams, archCategoryService, archToastService)
  {
    $scope.category = new Category();

    archCategoryService.getCategory($stateParams.idCategory).then(function(category)
    {
      $scope.category = category;
    })
    .catch(function()
    {
      archToastService.showToast('CATEGORY_ERROR_GET_CATEGORY', 'error');
      $state.go('sheet.categories');
    });

    $scope.editCategory = function ()
    {
      Category.update({category:$scope.category}, function()
      {
        archToastService.showToast('CATEGORY_EDIT_SUCCESS', 'success');
        $state.go('sheet.categories');
      },
      function()
      {
        archToastService.showToast('CATEGORY_EDIT_FAIL', 'error');
      });
    }
  });
