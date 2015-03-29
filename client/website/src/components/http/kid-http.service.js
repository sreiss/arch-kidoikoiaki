angular.module('kid')
  .factory("Participants", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/participants/:she_id',{},{
      query : {
        isArray : false
      }
    });
  })
  .factory("Participant", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/participant/:prt_id',{},{
      save : {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });
  })
  .factory("Sheet", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/sheet/:she_id',{},{
      get : {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });
  })
  .factory("Transactions", function ($resource) {
    return $resource('http://localhost:3005/kidoikoiaki/transactions/:she_id',{},{
      query : {
        isArray : false
      }
    });
  });