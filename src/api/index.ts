import config = require('./../../config')
import cookieParser = require("cookie-parser");
import express = require("express");
import cors = require("cors");
import bodyParser = require("body-parser");
import http = require("http");
import * as requestService from "./services/requestServices"
const app = express();
var methodOverride = require('method-override');

// parse body, cookie
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.options('*', cors());

//set port
app.set("port", config.port);

//something to allow cors or headers?? -> make your selfe know what this is
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "Authorization");
    next();
});

require('./routes.js')(app); //loading all routes

//start server
let server = http.createServer(app);
server.listen(app.get("port"), () => {
    console.log(
        "App is running in %d in %s mode",
        app.get("port"),
        app.get("env")
    );
})
//Error Handling
app.use(methodOverride());
app.use(function (err, req, res, next) {
    requestService.sendResponse(res, "error", 400, err)
});

export default server;