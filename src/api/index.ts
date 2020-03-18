require("dotenv/config")
import express = require("express");
import cors = require("cors");
import cookieParser = require("cookie-parser");
import bodyParser = require("body-parser");
import morgan = require("morgan");
import fs = require("fs");
import https = require("https");
import config = require('./../../config')

const app = express();
const privateKey  = fs.readFileSync('certs/server.key', 'utf8'); // find a better way
const certificate = fs.readFileSync('certs/server.cert', 'utf8'); // find a better way
const credentials = {key: privateKey, cert: certificate};
const httpsServer = https.createServer(credentials, app);

// parse body, cookie and use morgan
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'))
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.options('*', cors());

//set port
app.set("port", config.port_api);

//something to allow cors or headers?? -> make your selfe know what this is
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "Authorization");
    next();
});

require('./routes.js')(app); //loading all routes

//start https server
const server = httpsServer.listen(app.get("port"), () => {
    console.log(
            "App is running on https://localhost:%d in %s mode",
            app.get("port"),
            app.get("env")
    );
});

export default server;