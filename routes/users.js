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
let data=['中国','Time','Bob','Mobile']
router.get('/', (req, res, next)=> {
  res.send(data);
});

router.get('/users_info', (req, res, next) =>{
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

module.exports = router;
