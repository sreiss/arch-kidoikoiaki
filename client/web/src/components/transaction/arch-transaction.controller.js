'use strict'

angular.module('kid')
  .controller('archTransactionsController', function ($scope, Transactions, Sheet, $stateParams, Transaction, $mdToast, $state, archSheetService, archTransactionService)
  {
    $scope.transactions = new Array();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
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
  .controller('archTransactionNewController', function($scope, Participants, Categories, Transaction, $location, $mdToast, Sheet, $stateParams, $state, archSheetService)
  {
    $scope.transaction = new Transaction();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      $scope.beneficiaries = {};
      $scope.participants = Participants.query({id: sheet._id});
      $scope.categories = Categories.query({id: sheet._id});
      $scope.transaction.trs_sheet = sheet._id;
    })
    .catch(function()
    {
      $mdToast.show($mdToast.simple().content('Veuillez au préalable créer une nouvelle feuille.').position('top right').hideDelay(3000));
      $state.go('sheet.home');
    });

    $scope.newTransaction = function()
    {
      $scope.transaction.trs_beneficiaries = new Array();

      angular.forEach($scope.beneficiaries, function(weight, participantId)
      {
        var beneficiary =
        {
          trs_participant : participantId,
          trs_weight : weight
        };
        $scope.transaction.trs_beneficiaries.push(beneficiary);
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
  .controller('archTransactionEditController', function($scope, Participants, Categories, Transaction, $location, $mdToast, Sheet, $stateParams, $state, archSheetService, archTransactionService)
  {
    $scope.transaction = new Transaction();

    archSheetService.getCurrentSheet().then(function(sheet)
    {
      archTransactionService.getTransaction($stateParams.idTransaction).then(function(transaction)
      {
        $scope.transaction = transaction;
        $scope.participants = Participants.query({id: sheet._id});
        $scope.categories = Categories.query({id: sheet._id});
        $scope.beneficiaries = new Array();

        angular.forEach(transaction.trs_beneficiaries, function(participant)
        {
          $scope.beneficiaries[participant._id] = participant.trs_weight;
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

