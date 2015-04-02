angular.module('kid')
  .factory("Participants", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/participants/:she_id', {}, {
      query: {
        isArray: false
      }
    });
  })
  .factory("Participant", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/participant/:id', {  }, {
      save: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      'test' : {
        method: 'DELETE',
        headers: {
          'Access-Control-Allow-Origin': "http://localhost:3005/",
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
        }
      }
    });
  })
  .factory("Sheet", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/sheet/:she_id', {}, {
      get: {
        method: 'GET'
      }
    });
  })
  .factory("Transactions", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/transactions/:she_id', {}, {
      query: {
        isArray: false
      }
    });
  })
  .factory("Transaction", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/transaction/:id', {}, {
      save: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });
  })
  .factory("Category", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/category/:id', {}, {
      save: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });
  })
  .factory("Categories", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/category/', {}, {
      query: {
        isArray: false
      }
    });
  });
