'use strict'

angular.module('kid')
  .controller('archTransactionsController', function ($scope, Transactions, Sheet, $stateParams, Transaction, $state, archSheetService, archTransactionService, archToastService)
  {
    $scope.transactions = new Array();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      archTransactionService.getTransactions(sheet._id).then(function(transactions)
      {
        $scope.transactions = transactions;

        archTransactionService.getRepartitionChart(sheet._id, transactions).then(function(chart)
        {
          $scope.repartitionChart = chart;
        })
      })
      .catch(function()
      {
        archToastService.showToast('TRANSACTION_ERROR_GET_TRANSACTIONS', 'error');
      });

      $scope.transactions = Transactions.query({id: sheet._id});
    })
    .catch(function()
    {
      archToastService.showToast('SHEET_NEW_SHEET_REQUIRED', 'error');
      $state.go('sheet.home');
    });

    $scope.deleteTransaction = function(transactionId)
    {
      archTransactionService.showDeleteDialog(transactionId);
    };

    $scope.editTransaction = function(id)
    {
      $state.go('sheet.transactionEdit', {'idTransaction' : id});
    };
  })
  .controller('archTransactionNewController', function($scope, Participants, Categories, Transaction, $location, Sheet, $stateParams, $state, archSheetService, archParticipantService, archCategoryService, archToastService)
  {
    $scope.allBeneficiaries = false;
    $scope.transaction = new Transaction();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      archCategoryService.getCategories(sheet._id).then(function(categories)
      {
        $scope.categories = categories;
      })
      .catch(function()
      {
        archToastService.showToast('CATEGORY_ERROR_GET_CATEGORIES', 'error');
        $state.go('sheet.transactions');
      });

      $scope.transaction.trs_sheet = sheet._id;

      archParticipantService.getParticipants(sheet._id).then(function(participants)
      {
        $scope.participants = participants;
        $scope.beneficiaries = {};
        $scope.weights = {};

        angular.forEach(participants, function(participant)
        {
          var beneficiary = participant;
          beneficiary.isActive = false;
          $scope.beneficiaries[participant._id] = beneficiary;

          $scope.weights[participant._id] = participant.prt_share;
        });
      })
      .catch(function()
      {
        archToastService.showToast('PARTICIPANT_ERROR_GET_PARTICIPANTS', 'error');
        $state.go('sheet.transactions');
      });
    })
    .catch(function()
    {
      archToastService.showToast('SHEET_NEW_SHEET_REQUIRED', 'error');
      $state.go('sheet.home');
    });

    $scope.newTransaction = function()
    {
      $scope.transaction.trs_beneficiaries = new Array();

      angular.forEach($scope.beneficiaries, function(beneficiary)
      {
        if(beneficiary.isActive)
        {
          var tmpBeneficiary =
          {
            trs_participant : beneficiary._id,
            trs_weight : $scope.weights[beneficiary._id]
          };
          $scope.transaction.trs_beneficiaries.push(tmpBeneficiary);
        }
      });

      if($scope.transaction.trs_beneficiaries.length > 0)
      {
        $scope.transaction.$save(function()
        {
          archToastService.showToast('TRANSACTION_NEW_SUCCESS', 'success');
          $state.go('sheet.transactions');
        },
        function()
        {
          archToastService.showToast('TRANSACTION_NEW_FAIL', 'error');
        })
      }
      else
      {
        archToastService.showToast('TRANSACTION_NEW_FAIL_NO_BENEFICIARIES', 'error');
      }
    }

    $scope.selectAllBeneficiaries = function()
    {
      $scope.allBeneficiaries = !$scope.allBeneficiaries;

      angular.forEach($scope.beneficiaries, function(beneficiary)
      {
        beneficiary.isActive = $scope.allBeneficiaries;
      });
    }
  })
  .controller('archTransactionEditController', function($scope, Participants, Categories, Transaction, $location, Sheet, $stateParams, $state, archSheetService, archTransactionService, archCategoryService, archParticipantService, archToastService)
  {
    $scope.allBeneficiaries = false;
    $scope.transaction = new Transaction();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      archTransactionService.getTransaction($stateParams.idTransaction).then(function(transaction)
      {
        $scope.transaction = transaction;

        archCategoryService.getCategories(sheet._id).then(function(categories)
        {
          $scope.categories = categories;
        })
        .catch(function()
        {
          archToastService.showToast('CATEGORY_ERROR_GET_CATEGORIES', 'error');
          $state.go('sheet.transactions');
        });

        archParticipantService.getParticipants(sheet._id).then(function(participants)
        {
          $scope.participants = participants;
          $scope.beneficiaries = {};
          $scope.weights = {};

          angular.forEach(participants, function(participant)
          {
            var beneficiary = participant;
            beneficiary.isActive = false;
            $scope.beneficiaries[participant._id] = beneficiary;
            $scope.weights[participant._id] = participant.prt_share;
          });

          angular.forEach($scope.transaction.trs_beneficiaries, function(beneficiary)
          {
            $scope.beneficiaries[beneficiary.trs_participant._id].isActive = true;
            $scope.weights[beneficiary.trs_participant._id] = beneficiary.trs_weight;
          });
        })
        .catch(function()
        {
          archToastService.showToast('PARTICIPANT_ERROR_GET_PARTICIPANTS', 'error');
          $state.go('sheet.transactions');
        });
      })
      .catch(function()
      {
        archToastService.showToast('TRANSACTION_ERROR_GET_TRANSACTION', 'error');
        $state.go('sheet.transactions');
      });
    })
    .catch(function()
    {
      archToastService.showToast('SHEET_NEW_SHEET_REQUIRED', 'error');
      $state.go('sheet.home');
    });

    $scope.editTransaction = function ()
    {
      $scope.transaction.trs_beneficiaries = new Array();

      angular.forEach($scope.beneficiaries, function(beneficiary)
      {
        if(beneficiary.isActive)
        {
          var tmpBeneficiary =
          {
            trs_participant : beneficiary._id,
            trs_weight : $scope.weights[beneficiary._id]
          };
          $scope.transaction.trs_beneficiaries.push(tmpBeneficiary);
        }
      });

      if($scope.transaction.trs_beneficiaries.length > 0)
      {
        Transaction.update({transaction:$scope.transaction}, function()
        {
          archToastService.showToast('TRANSACTION_EDIT_SUCCESS', 'success');
          $state.go('sheet.transactions');
        },
        function()
        {
          archToastService.showToast('TRANSACTION_EDIT_FAIL', 'error');
        });
      }
      else
      {
        archToastService.showToast('TRANSACTION_NEW_FAIL_NO_BENEFICIARIES', 'error');
      }
    }

    $scope.selectAllBeneficiaries = function()
    {
      $scope.allBeneficiaries = !$scope.allBeneficiaries;

      angular.forEach($scope.beneficiaries, function(beneficiary)
      {
        beneficiary.isActive = $scope.allBeneficiaries;
      });
    }
  });

