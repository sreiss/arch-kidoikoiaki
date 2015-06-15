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

      getBalanceChart: function(sheetId, debts)
      {
        var deferred = $q.defer();

        var repartitions = new Array();
        var categories = new Array();
        var balance = new Array();

        debts.forEach(function(debt)
        {
          if(repartitions[debt.dbt_giver._id] === undefined)
          {
            repartitions[debt.dbt_giver._id] = {name : debt.dbt_giver.prt_fname + ' ' + debt.dbt_giver.prt_lname, amount : debt.dbt_amount};
          }
          else
          {
            repartitions[debt.dbt_giver._id].amount += debt.dbt_amount;
          }

          if(repartitions[debt.dbt_taker._id] === undefined)
          {
            repartitions[debt.dbt_taker._id] = {name : debt.dbt_taker.prt_fname + ' ' + debt.dbt_taker.prt_lname, amount : -debt.dbt_amount};
          }
          else
          {
            repartitions[debt.dbt_taker._id].amount -= debt.dbt_amount;
          }
        });

        for(var participantId in repartitions)
        {
          categories.push(repartitions[participantId].name);
          balance.push(parseFloat(parseFloat(repartitions[participantId].amount).toFixed(2)));
        }

        var chart =
        {
          options:
          {
            chart:
            {
              type: 'column'
            }
          },
          title:
          {
            text: ''
          },
          xAxis:
          {
            categories: categories
          },
          yAxis:
          {
            title:
            {
              text: 'Montant en euro (€)'
            }
          },
          legend:
          {
            enabled: false
          },
          tooltip:
          {
            pointFormat: '{series.name}: <b>{point.y:.1f}€</b>'
          },
          series: [
          {
            name: 'Balance',
            colorByPoint: true,
            data: balance
          }]
        }

        deferred.resolve(chart);

        return deferred.promise;
      }
    };
  });
