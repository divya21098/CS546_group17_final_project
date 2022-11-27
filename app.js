const express = require("express");
const app = express();
const configRoutes = require("./routes");

app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
// let data = require('npm-nationality-list')
// const x  = data.getList()

// for(i=0;i<x.length;i++){
//   console.log(x[i]['nationality'])
// }