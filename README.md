# simple-graph-server
This an express server that connects to IBM Graph and is able to process gremlin queries. It sends back the data in different formats that can be used to visualize the returned data.

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

#Start the server
```
npm start
```

