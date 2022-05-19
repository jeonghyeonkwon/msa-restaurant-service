import * as express from 'express';
import * as morgan from "morgan";
import * as cors from 'cors';
import * as dotenv from 'dotenv'
import * as hpp from 'hpp';
import * as helmet from 'helmet'
import * as cookieParser from "cookie-parser";
const {sequelize} = require('./models');
import {Eureka} from 'eureka-js-client';
import {producer} from './config/kafka'

import restaurantRouter from './routes/restaurant';
import {NextFunction, Request, Response} from "express";

const ip = require('ip');
dotenv.config();
const app = express();

const prod: boolean = process.env.NODE_ENV==='production';

if(prod){
    app.use(hpp())
    app.use(helmet());
    app.use(morgan('combined'));
}else{
    app.use(morgan('dev'))
    app.use(cors({
        origin:true,
        credentials:true,
    }))
}
const client = new Eureka({
    instance:{
        app:'restaurant-service',
        instanceId:`${ip.address()}:restaurant-service:${process.env.PORT!}`,
        hostName:`${ip.address()}`,
        ipAddr:`${ip.address()}`,
        statusPageUrl:`http://${ip.address()}:3065/check`,
        port:{
            '$':3065,
            '@enabled':true
        },
        vipAddress: 'restaurant-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka:{
        host:'127.0.0.1',
        port:8761,
        servicePath:'/eureka/apps/'
    }
})

const initKafka = async ()=>{
    await producer.connect();
}

sequelize
    .sync({force: true})
    .then(() => {
        console.log('연결 성공');
    })
    .catch(() => {
        console.log('에러');
    });


app.use('/',express.static('upload'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));

client.start( error => {
    console.log(error || "restaurant service registered")
});
app.use('/',restaurantRouter);



app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    console.log(err);
    return res.status(400).send({msg: err.message});
});


app.set('port',prod?process.env.PORT:3065);

app.listen(app.get('port'),()=>{
    console.log(`server is running on ${app.get('port')}`);
})

initKafka();