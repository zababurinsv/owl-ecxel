import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import helmet from "helmet";
import excel from "./modules/index.mjs";
import fs from 'fs';

const app = express()
app.use(bodyParser.json({limit: '40mb'}))
app.use(bodyParser.urlencoded({limit: '40mb', extended: true, parameterLimit: 40000}))
app.use(cors())
app.use(cookieParser())
app.use(express.static('static'))
app.use(fileUpload({ }))
app.use(helmet())

app.get('/', async (req, res, next) => {
    try {

        res.status(200).send({excel:'work'})
    }catch (e) {
        console.log(e)
    }
});

app.post('/', async function (req, res) {
    try {

        let obj = await excel.readFile(`./tableFull.xls`)

        res.status(200).send(obj)
    }catch (e) {
        console.log(e)
    }
});
export default app

