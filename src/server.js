import bodyParser from "body-parser"
import express from "express"
import viewEngine from "./config/viewEngine.js"
import initWebRoutes from "./route/web.js"

import connect from "./database/database.js"
import checkToken from "./authentication/auth.js"

import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config();
let app = express();
// environment
import { port, mongoURL} from "./config/main.js";
//check token
app.use(checkToken);
app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

connect(mongoURL);
viewEngine(app);
initWebRoutes(app);

app.listen(port, () =>{
    console.log('run on : ' + port);
})