'use strict';

angular.module('kid').directive('archSidebar', function(archSheetService)
{
  return {
    restrict: 'E',
    templateUrl: 'components/sidebar/arch-sidebar.html',
    controller: function($scope)
    {
      $scope.$on('$stateChangeSuccess', function ()
      {
        archSheetService.getCurrentSheet().then(function(sheet)
        {
          if(sheet)
          {
            $scope.sheetExists = true;
            $scope.sheetIsPrivate = sheet.isPrivate;
          }
          else
          {
            $scope.sheetExists = false;
            $scope.sheetIsPrivate = false;
          }
        })
        .catch(function(eer)
        {
          $scope.sheetExists = false;
        });
      });
    }
  }
});
