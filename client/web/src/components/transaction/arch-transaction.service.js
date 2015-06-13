'use strict'

angular.module('kid')
  .factory('archTransactionService', function(Transaction, Transactions, archHttpService, archCategoryService, $q, $state, $mdToast, $mdDialog)
  {
    return {
      getTransaction: function(id)
      {
        var deferred = $q.defer();

        Transaction.get({id: id}, function(result)
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

      getTransactions: function(id)
      {
        var deferred = $q.defer();

        Transactions.query({id: id}, function(result)
        {
          deferred.resolve(result.data);
        },
        function(responseError)
        {
          deferred.reject(responseError);
        });

        return deferred.promise;
      },

      deleteTransaction: function(id)
      {
        var deferred = $q.defer();

        Transaction.delete({id: id}, function(result)
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

      showDeleteDialog: function(transactionId)
      {
        return $mdDialog.show({
          templateUrl: 'components/transaction/arch-transaction-delete-dialog.html',
          controller: function ($scope, archTransactionService, archTranslateService)
          {
            $scope.transactionId = transactionId;

            $scope.deleteTransaction = function()
            {
              archTransactionService.deleteTransaction($scope.transactionId).then(function()
              {
                archTranslateService('TRANSACTION_DELETE_SUCCESS').then(function(translateValue)
                {
                  $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
                  $state.go($state.current, {}, {reload: true});
                });
              })
              .catch(function()
              {
                archTranslateService('TRANSACTION_DELETE_FAIL').then(function(translateValue)
                {
                  $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
                });
              });

              $mdDialog.cancel();
            };

            $scope.cancel = function ()
            {
              $mdDialog.cancel();
            };
          }
        });
      },

      getRepartitionChart: function(sheetId, transactions)
      {
        var deferred = $q.defer();

        var amount = 0;
        var repartitions = new Array();
        var data = new Array();

        archCategoryService.getCategories(sheetId).then(function(categories)
        {
          transactions.forEach(function(transaction)
          {
            amount = amount + transaction.trs_amount;

            categories.forEach(function(category)
            {
              if(category._id == transaction.trs_category._id)
              {
                if(repartitions[category._id] === undefined)
                {
                  repartitions[category._id] = {name : category.ctg_name, amount : transaction.trs_amount};

                }
                else
                {
                  repartitions[category._id].amount += transaction.trs_amount;
                }
              }
            });
          });

          for(var categoryId in repartitions)
          {
            data.push(new Array(repartitions[categoryId].name, parseFloat((repartitions[categoryId].amount/amount)*100).toFixed(2)));
          }

          data = JSON.stringify(data);
          console.log(data);
          data = data.replace(',"', ',');
          data = data.replace('"]', ']');
          console.log(data);

          var chart = {
            chart:
            {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false
            },
            title:
            {
              text: ''
            },
            tooltip:
            {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions:
            {
              pie:
              {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels:
                {
                  enabled: false
                },
                showInLegend: true
              }
            },
            series:
            [{
              type: 'pie',
              name: 'Browser share',
              data: data
            }]
          }

          deferred.resolve(chart);
        })
        .catch(function(err)
        {
          deferred.reject(err);
        })

        return deferred.promise;
      }
    };
  });
