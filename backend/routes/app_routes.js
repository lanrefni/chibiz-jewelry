const fileUpload = require("express-fileupload");
const indexRouter = require("./index");
const uploadR = require("./upload");
const usersR = require("./users");
const authR = require("./auth");
const prodsR = require("./prods");

exports.routesInit = (app) => {
  app.use("/", indexRouter);
  app.use("/upload", uploadR);
  app.use("/api/users", usersR);
  app.use("/api/auth", authR);
  app.use("/api/prods", prodsR);

  app.use((req, res) => {
    res.status(404).json({ msg: "404 url page not found" })
  })
}

exports.originCorsAccess = (app) => {
  app.all('*', (req, res, next) => {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE,PATCH");
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,x-auth-token');
    next();
  });
}