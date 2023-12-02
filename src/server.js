import bodyParser from "body-parser"
import express from "express"
import viewEngine from "./config/viewEngine.js"
import initWebRoutes from "./route/web.js"
import authRoute from "./route/auth.js"
import { upload } from "../sampleData/addDataTour.js"

import connect from "./database/database.js"
import checkToken from "./authentication/auth.js"

//gg
import cookieSession from "cookie-session";
import passport from 'passport';
import passportStrategy from "./authentication/passport.js";
//

import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
let app = express();
// environment
import { port, mongoURL} from "./config/main.js";
//gg session
//
app.use(
    cookieSession({
        name: "session",
        keys: ["cyberwolve"],
        maxAge: 24 * 60 * 60 * 1000,
    })
);
app.use(passport.initialize());
app.use(passport.session());
//cors
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:6969',
    'http://127.0.0.1:6969',
  ];
  app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//import data
connect(mongoURL);
viewEngine(app);
initWebRoutes(app);
authRoute(app);  
const loadData = false;
if(loadData)
{
    upload();
    console.log('upload success');
}
app.listen(port, () =>{
    console.log('run on : ' + port);
})