'use strict'
angular.module('kid')
  .factory('archCategoryService', function(Category, archHttpService, $q, httpConstant, $stateParams)
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
            deferred.reject(new Erro());
          }
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
      }
    };
  });
