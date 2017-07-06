const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const Jas = require("./js/jas");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "blog",
  port: "3306"
});
const handleError = (err)=> {
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
/* GET users listing. */

router.get('/', (req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "*");
  let data;
  let flow = new Jas();
  connection.query("SELECT * FROM users_info", (err, rows, fields) =>{
    if (err) throw err;

    data = rows;
    flow.trigger("A");
  });

  flow.when(["A"], ()=> {
    
    res.send(data);
    // res.render("index", { title: "测试博客", sendData: data });
  });
});

router.get('/users_info', (req, res, next) =>{
  res.header("Access-Control-Allow-Origin", "*");
  let data;
  let flow = new Jas();
  let user_id = req.query.user_id;
  if(!user_id){
      res.send('没有user_id');
  }
  connection.query("SELECT * FROM users_info where user_id="+user_id, (err, rows, fields) =>{
    if (err) throw err;

    data = rows;
    flow.trigger("A");
  });

  flow.when(["A"], ()=> {
    
    res.send(data);
    // res.render("index", { title: "测试博客", sendData: data });
  });
});

module.exports = router;
