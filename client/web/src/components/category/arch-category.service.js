'use strict'

angular.module('kid')
  .factory('archCategoryService', function(Category, Categories, archHttpService, $q, $state, $mdDialog)
  {
    return {
      getCategory: function(id)
      {
        var deferred = $q.defer();

        Category.get({id: id}, function(result)
        {
          if(result.count > 0)
          {
            deferred.resolve(result.data);
          }
          else
          {
            deferred.reject(new Error());
          }
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      getCategories: function(id)
      {
        var deferred = $q.defer();

        Categories.get({id: id}, function(result)
        {
          deferred.resolve(result.data);
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      deleteCategory: function(id)
      {
        var deferred = $q.defer();

        Category.delete({id: id}, function(result)
        {
          if(result.count > 0)
          {
            deferred.resolve(result.data);
          }
          else
          {
            deferred.reject(new Error());
          }
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      showDeleteDialog: function(sheetId, categoryId)
      {
        return $mdDialog.show({
          templateUrl: 'components/category/arch-category-delete-dialog.html',
          controller: function($scope, archCategoryService, archTransactionService, archToastService)
          {
            $scope.sheetId = sheetId;
            $scope.categoryId = categoryId;

            $scope.deleteCategory = function()
            {
               var isLinked = false;

               archTransactionService.getTransactions($scope.sheetId).then(function(transactions)
               {
                 transactions.forEach(function(transaction)
                 {
                   if(transaction.trs_category._id == $scope.categoryId)
                   {
                     isLinked = true;
                   }
                 });

                 if(!isLinked)
                 {
                   archCategoryService.deleteCategory($scope.categoryId).then(function()
                   {
                     archToastService.showToast('CATEGORY_DELETE_SUCCESS', 'success');
                     $state.go($state.current, {}, {reload: true});
                   })
                   .catch(function()
                   {
                     archToastService.showToast('CATEGORY_DELETE_FAIL', 'error');
                   });
                 }
                 else
                 {
                   archToastService.showToast('CATEGORY_DELETE_FAIL_LINKED', 'error');
                 }
               })
               .catch(function()
               {
                 archToastService.showToast('CATEGORY_DELETE_FAIL_CHECK_DEPENDENCIES', 'error');
               });

              $mdDialog.cancel();
            };

            $scope.cancel = function()
            {
              $mdDialog.cancel();
            };
          }
        });
      }
    };
  });
