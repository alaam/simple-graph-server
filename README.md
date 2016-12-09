# simple-graph-server
This an express server that connects to [IBM Graph](http://ibm.biz/ibm-graph) and is able to process gremlin queries. It sends back the data in different formats that can be used to visualize the returned data. It uses the [ibm-graph-client](https://www.npmjs.com/package/ibm-graph-client) module to connect to IBM Graph.

##Setup
Clone the repo

```
git clone git@github.com:alaam/simple-graph-server.git
```

#Install dependencies
```
cd simple-graph-server
npm install
```

#Add your service credentials
- Create a new file on the root of `simple-graph-server` and call credds.json
- Edit the file and add your service credentials json 
```
{
  "apiURL" : "<service apiURL>/g",
  "username" : "<Your username >",
  "password" : "<Your password>",
} 
```

#Loading the data
This code doesn't load data into the service yet (will do it soon). But you can easily add the data using bulkload API. Alternatively, you can just load the sample data from the service UI on Bluemix. Check the documentation for more details https://ibm-graph-docs.ng.bluemix.net/examples.html#node.js

Here's a sample of loading a graphml file

```
var bulkUploadOpts = {
    method: 'POST',
    headers: {'Authorization': sessionToken},
    uri: apiURL + '/bulkload/graphml',
    formData: {
      'graphml': fs.createReadStream(__dirname +  
          '/../public/sample_graphml.xml'),
      'type': 'application/xml'
    }
};
request(bulkUploadOpts).then(function (body){
    console.log('Our file was uploaded and the result was : ' +
        JSON.stringify(body.result.data[0]));
});
```

#Start the server
```
npm start
```

