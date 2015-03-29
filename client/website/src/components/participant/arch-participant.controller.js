angular.module('kid')
  .controller('archParticipantController', function($scope, Participants,Sheet,$stateParams){
    Sheet.get({she_id:$stateParams.idSheet},function(sheet) {
      $scope.participants = Participants.query({she_id : sheet.data._id});
      console.log(sheet.data._id);
    });
  })
  .controller('archParticipantEditController', function($scope, Participant){
    $scope.participants = Participant
      .get({ sheetReference: 'prout' });
  })
.controller('archParticipantNewController', function($scope, Participant,$location,$mdToast, Sheet,$stateParams, $state,$animate){
    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };
    $scope.participant = new Participant();
    Sheet.get({she_id:$stateParams.idSheet},function(sheet) {
      $scope.participant.prt_sheet = sheet.data._id;
      console.log(sheet.data._id);
    });
    $scope.newParticipant = function() {
        $scope.participant.$save(function(){
            $mdToast.show(
              $mdToast.simple()
                .content('Participants crée')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
        });
      $state.go('sheet.participants');
    }
});
