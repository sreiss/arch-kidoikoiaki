/**
 * Created by Brian on 28/03/2015.
 */
angular.module('kid')
  .controller('archTransactionsController', function($scope, Transactions,Sheet,$stateParams) {
    Sheet.get({she_id: $stateParams.idSheet}, function (sheet) {
      $scope.transactions = Transactions.query({she_id: sheet.data._id});
      console.log(sheet.data._id);
    });
  });
