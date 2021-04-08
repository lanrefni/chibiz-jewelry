const express = require("express");
const path = require("path");

const mongoConnect = require("./db/mongoConnect")
const { routesInit, originCorsAccess, fileUploadAccess } = require("./routes/app_routes");

let app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")))
originCorsAccess(app);
fileUploadAccess(app)
routesInit(app);


let port = process.env.PORT || 3000;
app.listen(port);
