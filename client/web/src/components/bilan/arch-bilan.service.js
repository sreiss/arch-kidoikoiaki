'use strict'

angular.module('kid')
  .factory('archBilanService', function(Bilan, Debt, archHttpService, $q)
  {
    return {
      deleteDebts: function(id)
      {
        var deferred = $q.defer();

        Debt.delete({id: id}, function(result)
        {
          deferred.resolve(result.data);
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      generateBilan: function(id)
      {
        var deferred = $q.defer();

        Bilan.get({id: id}, function(result)
        {
          deferred.resolve(result.data);
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      getDebts: function(id)
      {
        var deferred = $q.defer();

        Debt.get({id: id}, function(result)
        {
            deferred.resolve(result.data);
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      getBalanceChart: function(sheetId)
      {
        var deferred = $q.defer();

        var chart =
        {
          options: {
            chart: {
              type: 'column'
            }
          },
          title: {
            text: ''
          },
          xAxis: {
            categories: ['Pierre', 'Cédric', 'Benoît', 'Pascal']
          },
          credits: {
            enabled: false
          },
          series: [{
            name: ''
            data: [45, -35, -15, 5]
          }]
        }

        deferred.resolve(chart);

        return deferred.promise;
      }
    };
  });
