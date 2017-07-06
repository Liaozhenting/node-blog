const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const Jas = require("./js/jas");
const bodyParser = require("body-parser");
let multipart = require("connect-multiparty");
let multipartMiddleware = multipart();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "blog",
  port: "3306"
});
const handleError = err => {
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
router.use(bodyParser.json({ limit: "3mb" })); //这里指定参数使用 json 格式
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);
//获取文章列表
router.get("/", (req, res, next) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    let data;
    let flow = new Jas();
    if (!req.query.user_id) {
      res.send("没有user_id");
      return;
    }
    let firstResult = req.query.firstResult || 0;
    connection.query(
      "SELECT tid,title,decoration,create_time,alter_time,state FROM blogs where user_id=" +
        req.query.user_id +
        " order by user_id DESC limit " +
        firstResult +
        "," +
        15,
      (err, rows, fields) => {
        if (err) throw err;

        data = rows;
        console.log(req.query);
        flow.trigger("A");
      }
    );

    flow.when(["A"], () => {
      res.send(data);
      // res.render("index", { title: "测试博客", sendData: data });
    });
  } catch (e) {
    console.log(e);
    console.log(e.stack);
    try {
      res.end(e.stack);
    } catch (e) {}
  }
});

//获取文章内容
router.get("/getBlog", (req, res, next) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    let data;
    let flow = new Jas();
    if (!req.query.tid) {
      res.send("没有tid");
      return;
    }
    let tid = req.query.tid;
    connection.query(
      "SELECT tid,title,decoration,create_time,alter_time,state,read_count,upvote,text FROM blogs where tid=" +
        tid,
      (err, rows, fields) => {
        if (err) throw err;

        data = rows;
        console.log(req.query);
        flow.trigger("A");
      }
    );

    flow.when(["A"], () => {
      res.send(data);
    });
  } catch (e) {
    console.log(e);
    console.log(e.stack);
    try {
      res.end(e.stack);
    } catch (e) {}
  }
});

//新增文章
router.post("/addBlog", (req, res, next) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);

    let data;
    let flow = new Jas();
    if (!req.query.tid) {
      res.send("没有tid");
      return;
    }
    let tid = req.body.tid;
    connection.query(
      "insert into blogs (title,decoration,create_time,alter_time,state,read_count,upvote,text) values (" +
        req.body.title +
        "," +req.body.decoration+
        ","+req.body.create_time+
        ","+req.body.alter_time+
        ","+req.body.state+
        ","+req.body.read_count+
        ","+req.body.upvote+
        ","+req.body.text+
        +")",
      (err, rows, fields) => {
        if (err) throw err;

        data = rows;
        console.log(req.query);
        flow.trigger("A");
      }
    );

    flow.when(["A"], () => {
      res.send('success');
    });
  } catch (e) {
    console.log(e);
    console.log(e.stack);
    try {
      res.end(e.stack);
    } catch (e) {}
  }
});

//修改文章
router.post("/editBlog", (req, res, next) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);

    let data;
    let flow = new Jas();
    if (!req.query.tid) {
      res.send("没有tid");
      return;
    }
    let tid = req.body.tid;
    connection.query(
      "update  blogs set title="+req.body.title +
        ",decoration="+req.body.decoration+
        ",alter_time="+req.body.alter_time+
        ",state="+req.body.state+
        ",text="+req.body.text+
        " where tid="+tid,
      (err, rows, fields) => {
        if (err) throw err;

        data = rows;
        console.log(req.query);
        flow.trigger("A");
      }
    );

    flow.when(["A"], () => {
      res.send('success');
    });
  } catch (e) {
    console.log(e);
    console.log(e.stack);
    try {
      res.end(e.stack);
    } catch (e) {}
  }
});
module.exports = router;
