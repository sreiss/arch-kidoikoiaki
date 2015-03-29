/**
 * Created by Brian on 29/03/2015.
 */
angular.module('kid')
  .controller('archCategoriesController', function ($scope, Categories, Sheet, $stateParams) {
    Sheet.get({she_id: $stateParams.idSheet},
      function (sheet) {
        $scope.categories = Categories.query({she_id: sheet.data._id});
      },
      function (responseError){
        if (responseError.status === 400) {
          console.log(responseError);
        }
      }
    )
  })
  .controller('archCategoryNewController', function ($scope, Category, $location, $mdToast, Sheet, $stateParams, $state, $animate) {
    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function () {
      return Object.keys($scope.toastPosition)
        .filter(function (pos) {
          return $scope.toastPosition[pos];
        })
        .join(' ');
    };
    $scope.category = new Category();
    $scope.newCategory = function () {
      $scope.category.$save(
        function (value) {
          $scope.category.$save(function () {
            $mdToast.show(
              $mdToast.simple()
                .content('Catégorie créee')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
          });
          $state.go('sheet.categories');
        }
        ,
        function (responseError) {
          if (responseError.status === 400) {
            console.log(responseError);
          }
        }
      )
    }
  });
