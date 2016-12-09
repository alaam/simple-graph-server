var ibmGraph = require('ibm-graph-client');
var creds = require('./creds.json');
var schema = require('./schema.json');

var graph;
var g = new ibmGraph(creds);

// Get the session token
g.session(function (err, data) {
  if (err) {
    console.log(err);
  } else {
    g.config.session = data;
    console.log('Your session token is ' + data);
  }
});

//Create a new graph
// g.graphs().create(function (err, data) {
//   if (err) {
//     console.log("error");
//     console.log(err);
//   } else {
//     graph = data.graphId;
//     console.log('Graph Created: ' + data.graphId);
//   }
// });

//Check for the new graph
g.graphs().get(function (err, data) {
  if (err) {
    console.log("error");
    console.log(err);
  } else {
    console.log('Graphs ' + data);
  }
});

//Get the new graph url
// g.graph.url = g.config.url.substr(0, g.config.url.lastIndexOf('/') + 1) + graph;

g.schema().set(schema, function (err, data) {
  if (err) {
    console.log('Error setting the schema' + err);
  } else {
    console.log(JSON.stringify(data));
  }
});

gremlin = 'def gt = graph.traversal();gt.V().hasLabel(\"attendee\").has(\"gender\",\"male\").outE(\"bought_ticket\").inV().hasLabel(\"band\").path();'

function getNodeColor(label) {
  switch (label) {
    case "attendee":
      return "rgb(255,180,180)";
    case "venue":
      return "rgb(180,255,180)";
    case "band":
      return "rgb(180,180,255)";
  }
  return "rgb(180,180,180)"
}

//Map the returned data to keylines
function addItem(data, item) {
  if (item.type === 'vertex') {
    data.push({
      id: '' + item.id,
      type: 'node',
      c: getNodeColor(item.label),
      // t: item.label,
      t: item.properties.name[0].value,
      d: item
    });
  } else {
    data.push({
      id: '' + item.id,
      type: `link`,
      c: 'rgb(255,0,0)',
      t: item.label,
      id1: '' + item.inV,
      id2: '' + item.outV,
    });
  }
}

function addElement(e,g,edges,i) {
  var nodeExits = false;

  if ( e.type === 'vertex') {
    g.nodes.forEach(function (n) {
      if (n.id === e.id) {
        nodeExits = true;
      }
    });
    if (!nodeExits) {
      g.nodes.push({
        id: e.id,
        label: e.label,
        x: Math.random(),
        y: Math.random(),
        size: 50,
        color: getNodeColor(e.label)
      });
    }
  } else
      if (e.type === 'edge') {
        edges.push({
          id: 'e' + i,
          source: e.inV,
          target: e.outV,
          size: Math.random(),
          color: '#ccc'
        });
      }
}

function getLinkuriousData(Graphdata) {
  var edges = [];
  var g = {
    nodes: [],
    edges: []
  };
  console.log(Graphdata);
  for (var i = 0; i < Graphdata.length; i++) {
    // Push node object in KeyLines format onto the items array
    if (Graphdata[i].objects) {
      Graphdata[i].objects.forEach( function (e) {
        addElement(e,g,edges,i);
      });
    }
    else 
        addElement(e,g,edges,i);
  }

  edges.forEach(function (e) {
    var n1, n2;
    n1 = n2 = false;
    g.nodes.forEach(function (v) {
      if (v.id === e.source)
        n2 = true;
      if (v.id === e.target)
        n1 = true;
    });
    if (n1 && n2) {
      g.edges.push(e);
    } else {
      console.log(!n1 ? e.source : e.target + "does not exist");
    }
  });
  return g;
}

function getKeyLinesData(graphData) {
  var data = [];
  for (var i = 0; i < graphData.length; i++) {
    console.log('successfully found this vertex : ' +
      JSON.stringify(graphData[i]));
    // For pathy queries the results for each path is in the objects object
    if (graphData[i].objects) {
      for (j = 0; j < graphData[i].objects.length; j++) {
        addItem(data, graphData[i].objects[j]);
      }
    }
    // For non-pathy queries the results are right on the data object itself
    else {
      addItem(data, graphData[i]);
    }
  }
  return data;
}

module.exports.getData = function getData(q, format, callback) {
  g.gremlin(q ? q : gremlin, function (err, data) {
    if (err) {
      console.log(err);
    }
    console.log(JSON.stringify(data));
    if (format === "linkurious") {
      data = getLinkuriousData(data.result.data);
    } else
      if (format === "keylines") {
        data = getKeyLinesData(data.result.data);
      }

    callback(data);
  });
};