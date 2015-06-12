'use strict'

angular.module('kid')
  .controller('archTransactionsController', function ($scope, Transactions, Sheet, $stateParams, Transaction, $mdToast, $state, archSheetService, archTransactionService, archTranslateService)
  {
    $scope.transactions = new Array();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      archTransactionService.getTransactions(sheet._id).then(function(transactions)
      {
        $scope.transactions = transactions;
      })
      .catch(function()
      {
        archTranslateService('TRANSACTION_ERROR_GET_TRANSACTIONS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        });
      });

      $scope.transactions = Transactions.query({id: sheet._id});
    })
    .catch(function()
    {
      archTranslateService('SHEET_NEW_SHEET_REQUIRED').then(function(translateValue)
      {
        $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        $state.go('sheet.home');
      });
    });

    $scope.deleteTransaction = function(id)
    {
      archTranslateService('TRANSACTION_DELETE_CONFIRM').then(function(translateValue)
      {
        if(confirm(translateValue))
        {
          archTransactionService.deleteTransaction(id).then(function()
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
        }
      });
    };

    $scope.editTransaction = function(id)
    {
      $state.go('sheet.transactionEdit', {'idTransaction' : id});
    };
  })
  .controller('archTransactionNewController', function($scope, Participants, Categories, Transaction, $location, $mdToast, Sheet, $stateParams, $state, archSheetService, archParticipantService, archCategoryService, archTranslateService)
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
        archTranslateService('CATEGORY_ERROR_GET_CATEGORIES').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          $state.go('sheet.transactions');
        });
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
        archTranslateService('PARTICIPANT_ERROR_GET_PARTICIPANTS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          $state.go('sheet.transactions');
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
          archTranslateService('TRANSACTION_NEW_SUCCESS').then(function(translateValue)
          {
            $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
            $state.go('sheet.transactions');
          });
        },
        function()
        {
          archTranslateService('TRANSACTION_NEW_FAIL').then(function(translateValue)
          {
            $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          });
        })
      }
      else
      {
        archTranslateService('TRANSACTION_NEW_FAIL_NO_BENEFICIARIES').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        });
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
  .controller('archTransactionEditController', function($scope, Participants, Categories, Transaction, $location, $mdToast, Sheet, $stateParams, $state, archSheetService, archTransactionService, archCategoryService, archParticipantService, archTranslateService)
  {
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
          archTranslateService('CATEGORY_ERROR_GET_CATEGORIES').then(function(translateValue)
          {
            $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
            $state.go('sheet.transactions');
          });
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
          archTranslateService('PARTICIPANT_ERROR_GET_PARTICIPANTS').then(function(translateValue)
          {
            $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
            $state.go('sheet.transactions');
          });
        });
      })
      .catch(function()
      {
        archTranslateService('TRANSACTION_ERROR_GET_TRANSACTION').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          $state.go('sheet.transactions');
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

      Transaction.update({transaction:$scope.transaction}, function()
      {
        archTranslateService('TRANSACTION_EDIT_SUCCESS').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
          $state.go('sheet.transactions');
        });
      },
      function()
      {
        archTranslateService('TRANSACTION_EDIT_FAIL').then(function(translateValue)
        {
          $mdToast.show($mdToast.simple().content(translateValue).position('top right').hideDelay(3000));
        });
      });
    }
  });

