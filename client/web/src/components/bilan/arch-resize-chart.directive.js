'use strict';

angular.module('kid').directive('archResizeChart', function () {
    return {
      restrict: 'A',
      link: function(scope, element, attributes)
      {
        var parents = element.parent();

        for(var i = 0; i < parents.length; i++)
        {
          element.css('min-width', parents[i].offsetWidth-40 + 'px');
          element.css('width', parents[i].offsetWidth-40 + 'px');
          break;
        }
      }
    };
  });
