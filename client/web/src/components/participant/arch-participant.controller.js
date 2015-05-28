angular.module('kid')
  .controller('archParticipantController', function ($scope, Participants, Sheet, $stateParams, Participant,$state,$mdToast)
  {
    if($stateParams.idSheet.length == 0)
    {
      // Avoid navigate without sheetReference.
      $mdToast.show($mdToast.simple()
        .content('Veuillez au préalable créer une nouvelle feuille.')
        .position('top right')
        .hideDelay(3000)
      );
      $state.go('sheet.home');
    }
    else
    {
      Sheet.get({she_id: $stateParams.idSheet}, function (result)
      {
        if(result.count > 0)
        {
          $scope.participants = Participants.query({she_id: result.data._id});
        }
      },
      function (responseError)
      {
      });
    }

    $scope.deleteParticipant = function (id) {
      if(confirm('Souhaitez-vous réellement supprimer ce participant ?')) {
        Participant.delete({id: id}, function (result) {
            if (result.count > 0) {
              $mdToast.show($mdToast.simple()
                  .content('Participant supprimé avec succés.')
                  .position('top right')
                  .hideDelay(3000)
              );
              $state.go($state.current, {}, {reload: true});
            }
            else {
              $mdToast.show($mdToast.simple()
                  .content('Une erreur est survenue à la suppression du participant.')
                  .position('top right')
                  .hideDelay(3000)
              );
            }
          },
          function (responseError) {
            $mdToast.show($mdToast.simple()
                .content('Une erreur est survenue à la suppression du participant.')
                .position('top right')
                .hideDelay(3000)
            );
          });
      }
    };
    $scope.editParticipant = function (id) {
      $state.go('sheet.participantEdit', {she_id: $stateParams.idSheet,'idParticipant' : id})
    }
  })
  .controller('archParticipantEditController', function ($scope, Participant,$stateParams,$mdToast) {
    $scope.toastPosition =
    {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    $scope.getToastPosition = function () {
      return Object.keys($scope.toastPosition).filter(function (pos) {
        return $scope.toastPosition[pos];
      })
        .join(' ');
    };

    Participant.get({id: $stateParams.idParticipant}, function (result) {
        if (result.count > 0) {
          $scope.participant = result.data;
        }
      },
      function (responseError) {
      }
    );

    $scope.editParticipant = function () {

      Participant.get({id: $stateParams.idParticipant}, function (result) {
          if (result.count > 0) {
            $scope.participant.prt_sheet = result.data.prt_sheet._id;
            $scope.participant.prt_sheet = result.data._id;
          }
        },
        function (responseError) {
        }
      );
      $scope.participant.$save( function (result) {
          if (result.count > 0) {
            $mdToast.show($mdToast.simple()
                .content('Participant créé avec succés.')
                .hideDelay(3000)
            );
            $state.go('sheet.participants');
          }
          else {
            $mdToast.show($mdToast.simple()
                .content('Une erreur est survenue à la création du participant.')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
          }
        },
        function (responseError) {
          $mdToast.show($mdToast.simple()
              .content('Une erreur est survenue à la création du participant.')
              .position($scope.getToastPosition())
              .hideDelay(3000)
          );
        });
    };
  })
  .controller('archParticipantNewController', function ($scope, Participant, $location, $mdToast, Sheet, $stateParams, $state) {

    $scope.participant = new Participant();
    Sheet.get({she_id: $stateParams.idSheet}, function (result) {
        if (result.count > 0) {
          $scope.participant.prt_sheet = result.data._id;
        }
      },
      function (responseError) {
      }
    );
    $scope.newParticipant = function () {
      $scope.participant.$save( function (result) {
          if (result.count > 0) {
            $mdToast.show($mdToast.simple()
                .content('Participant créé avec succés.')
                .position('top right')
                .hideDelay(3000)
            );
            $state.go('sheet.participants');
          }
          else {
            $mdToast.show($mdToast.simple()
                .content('Une erreur est survenue à la création du participant.')
                .position('top right')
                .hideDelay(3000)
            );
          }
        },
        function (responseError) {
          $mdToast.show($mdToast.simple()
              .content('Une erreur est survenue à la création du participant.')
              .position('top right')
              .hideDelay(3000)
          );
        });
    };
  });
