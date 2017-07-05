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

router.get('/', (req, res, next) =>{
  try{ res.header("Access-Control-Allow-Origin", "*");
  let data;
  let flow = new Jas();
  if(!req.query.user_id){
      res.send('没有user_id');
      return;
  }
  connection.query("SELECT * FROM blogs where user_id="+req.query.user_id, (err, rows, fields) =>{
    if (err) throw err;

    data = rows;
    console.log(data);
    flow.trigger("A");
  });

  flow.when(["A"], ()=> {
    
    res.send(data);
    // res.render("index", { title: "测试博客", sendData: data });
  });} catch(e){
      console.log(e);
      console.log(e.stack);
      try {
        res.end(e.stack);
      } catch (e) {}
  } 
 
});

module.exports = router;
