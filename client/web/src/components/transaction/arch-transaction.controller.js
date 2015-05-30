'use strict'

angular.module('kid')
  .controller('archTransactionsController', function ($scope, Transactions, Sheet, $stateParams, Transaction, $mdToast, $state, archSheetService, archTransactionService)
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
        $mdToast.show($mdToast.simple().content('Une erreur est survenue à la récupération des dépenses.').position('top right').hideDelay(3000));
      });

      $scope.transactions = Transactions.query({id: sheet._id});
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
      $state.go('sheet.home');
    });

    $scope.deleteTransaction = function(id)
    {
      if(confirm('Souhaitez-vous réellement supprimer cette dépense ?'))
      {
        archTransactionService.deleteTransaction(id).then(function()
        {
          $mdToast.show($mdToast.simple().content('Dépense supprimée avec succés.').position('top right').hideDelay(3000));
          $state.go($state.current, {}, {reload: true});
        })
        .catch(function()
        {
          $mdToast.show($mdToast.simple().content('Une erreur est survenue à la suppression de la dépense.').position('top right').hideDelay(3000));
        });
      }
    };

    $scope.editTransaction = function(id)
    {
      $state.go('sheet.transactionEdit', {'idTransaction' : id});
    };
  })
  .controller('archTransactionNewController', function($scope, Participants, Categories, Transaction, $location, $mdToast, Sheet, $stateParams, $state, archSheetService, archParticipantService, archCategoryService)
  {
    $scope.transaction = new Transaction();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      archCategoryService.getCategories(sheet._id).then(function(categories)
      {
        $scope.categories = categories;
      })
      .catch(function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue lors de la récupération des catégories.').position('top right').hideDelay(3000));
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
        $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
        $state.go('sheet.home');
      });
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
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

      $scope.transaction.$save(function()
      {
        $mdToast.show($mdToast.simple().content('Dépense créée avec succés.').position('top right').hideDelay(3000));
        $state.go('sheet.transactions');
      },
      function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue à la création de la dépense.').position('top right').hideDelay(3000));
      })
    }
  })
  .controller('archTransactionEditController', function($scope, Participants, Categories, Transaction, $location, $mdToast, Sheet, $stateParams, $state, archSheetService, archTransactionService, archCategoryService, archParticipantService)
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
          $mdToast.show($mdToast.simple().content('Une erreur est survenue lors de la récupération des catégories.').position('top right').hideDelay(3000));
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
        });
      })
      .catch(function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue à la récupération de la dépense.').position('top right').hideDelay(3000));
        $state.go('sheet.transactions');
      });
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
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

      Transaction.update({transaction:$scope.transaction}, function()
      {
        $mdToast.show($mdToast.simple().content('Dépense modifiée avec succés.').position('top right').hideDelay(3000));
        $state.go('sheet.transactions');
      },
      function()
      {
        $mdToast.show($mdToast.simple().content('Une erreur est survenue à la modification de la dépense.').position('top right').hideDelay(3000));
      });
    }
  });

