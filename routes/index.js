const express = require("express");
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
const handleError = function(err) {
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
//列出
router.get("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  let data;
  let flow = new Jas();
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
//编辑
router.get("/edit", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  let data;
  let flow = new Jas();
    //   console.log(req);
  let params = req.query;
  console.log(params);
  let user_id = req.query.user_id;
  console.log(user_id);
  let password = req.query.password || '无';
  let question = req.query.question || '无';
  let answer = req.query.answer || '无';

  connection.query(
    "update users set password='" +
      password +
      "',question='" +
      question +
      "',answer='" +
      answer +
      "' where user_id=" +
      user_id,
    (err, rows, fields) => {
      if (err) throw err;

      data = rows;
      flow.trigger("A");
    }
  );

  flow.when(["A"], () => {
    res.send('success');
    // res.render("index", { title: "测试博客", sendData: data });
  });
});
//删除
router.get("/delete", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  let user_id = req.query.user_id;
  console.log(user_id)
  let flow = new Jas();
  connection.query("delete FROM users where user_id= "+user_id, function(err) {
    if (err) throw err;
    flow.trigger("A");
  });

  flow.when(["A"], function() {
    res.send('sucess');
    // res.render("index", { title: "测试博客", sendData: data });
  });
});
module.exports = router;
