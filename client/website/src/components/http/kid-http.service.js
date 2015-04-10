angular.module('kid')
  .factory("Participants", function ($resource,httpConstant) {
    return $resource(httpConstant.apiUrl+'/kidoikoiaki/participants/:she_id', {}, {
      query: {
        isArray: false
      }
    });
  })
  .factory("Participant", function ($resource,httpConstant) {
    return $resource(httpConstant.apiUrl + '/kidoikoiaki/participant/:id', {  }, {
      save: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      update: {
        method: 'PUT'
      }
    });
  })
  .factory("Sheet", function ($resource,httpConstant) {
    return $resource(httpConstant.apiUrl + '/kidoikoiaki/sheet/:she_id', {}, {
      get: {
        method: 'GET'
      }
    });
  })
  .factory("Transactions", function ($resource,httpConstant) {
    return $resource(httpConstant.apiUrl + '/kidoikoiaki/transactions/:she_id', {}, {
      query: {
        isArray: false
      }
    });
  })
  .factory("Transaction", function ($resource,httpConstant) {
    return $resource(httpConstant.apiUrl + '/kidoikoiaki/transaction/:id', {}, {
      save: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });
  })
  .factory("Category", function ($resource,httpConstant) {
    return $resource(httpConstant.apiUrl + '/kidoikoiaki/category/:id', {}, {
      save: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });
  })
  .factory("Categories", function ($resource,httpConstant) {
    return $resource(httpConstant.apiUrl + '/kidoikoiaki/category/', {}, {
      query: {
        isArray: false
      }
    });
  })
  .factory("Bilan", function ($resource,httpConstant) {
    return $resource(httpConstant.apiUrl + '/kidoikoiaki/bilan/:she_id', {}, {
      query: {
        isArray: false
      }
    });
  });
