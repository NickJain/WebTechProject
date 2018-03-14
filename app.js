var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var logger = require("morgan");
var MongoClient = require('mongodb').MongoClient;

var app = express();

app.use(logger("short"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var publicPath = path.resolve(__dirname,"public");
app.use(express.static(publicPath));

app.post("/reg_data",function(req,res){
  response = {
    user: req.body.user,
    email: req.body.email,
    pwd: req.body.password
  };
  MongoClient.connect('mongodb://127.0.0.1:27017/proj', function(err, db){
    if(err) throw err;
    db.collection('users').insert(response,function(err,result){
      if(err) throw err;
      console.log("Record added");
      res.status(200).redirect("/signup.html");
    });
  });
});

app.post("/log_check",function(req,res){
  var user = req.body.user;
  var pwd = req.body.password;
  MongoClient.connect('mongodb://127.0.0.1:27017/proj',function(err, db){
    db.collection('users').findOne({user: user,pwd: pwd},function(err,result){
      if(err){
        console.log(err);
        return res.status(500).send();
      }
      if(!result){
        return res.status(404).redirect("login.html");
      }
      return res.status(200).send("User exists");
    });
  });
});
app.listen(3000);
