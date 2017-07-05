var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var Jas = require("./js/jas");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "blog",
  port: "3306"
});
var handleError = function(err) {
  if (err) {
    // 如果是连接断开，自动重新连接
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      connect();
    } else {
      console.error(err.stack || err);
    }
  }
};
connection.connect(handleError);
connection.on("error", handleError);
//查询world表

/* GET home page. */

router.get("/", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  var data;
  var flow = new Jas();
  connection.query("SELECT * FROM users", function(err, rows, fields) {
    if (err) throw err;

    data = rows;
    flow.trigger("A");
  });

  flow.when(["A"], function() {
    
    res.send(data);
    // res.render("index", { title: "测试博客", sendData: data });
  });
});
// router.get("/edit", function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   var data;
//   var flow = new Jas();
//   connection.query("SELECT * FROM users", function(err, rows, fields) {
//     if (err) throw err;

//     data = rows;
//     flow.trigger("A");
//   });

//   flow.when(["A"], function() {
    
//     res.send(data);
//     // res.render("index", { title: "测试博客", sendData: data });
//   });
// });
module.exports = router;


