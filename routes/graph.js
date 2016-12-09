var express = require('express');
var url = require('url');
var ibmGraph = require('../ibm_graph');

var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  var urlParts = url.parse(req.url,true);
  var q = urlParts.query.q; //query
  var f = urlParts.query.f; //format
  console.log('url parts'+JSON.stringify(urlParts));
  console.log('query is '+q);
  console.log('format is '+f);
  ibmGraph.getData(q,f, function(data) { 
      res.json(data);
  });
  // res.send('graph data');
});

module.exports = router;
