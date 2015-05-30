'use strict'

angular.module('kid')
  .factory('archCategoryService', function(Category, Categories, archHttpService, $q)
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
      }
    };
  });
