
var https = require('http://0.0.0.0:8100/ionic-lab');

var options = {
  host: 'www.igdb.com',
  path: '/api/v1/games',
  port: '443',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Token token="yC9uAoX29mhvOl_CQEWBM192zoYHnIpSMlDbffXffgM"'
  }
};

callback = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
};

var req = https.request(options, callback);
req.end();
