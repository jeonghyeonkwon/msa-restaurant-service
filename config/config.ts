import * as dotenv from 'dotenv';
dotenv.config();

type Config={
    username:string,
    password:string,
    database:string,
    host:string,
    [key:string] : string
}


interface IConfigGroup {
    development:Config,
    test:Config,
    production:Config
}

const config : IConfigGroup={
    "development":{
        'username': 'root',
        'password': process.env.MYSQL_PASSWORD!,
        'database': process.env.MYSQL_DATABASE!,
        'host': process.env.MYSQL_HOST!,
        'dialect': 'mysql',
    },
    "test":{
        'username': 'root',
        'password': process.env.MYSQL_PASSWORD!,
        'database': process.env.MYSQL_DATABASE!,
        'host': process.env.MYSQL_HOST!,
        'dialect': 'mysql',
    },
    "production":{
        'username': 'root',
        'password': process.env.MYSQL_PASSWORD!,
        'database': process.env.MYSQL_DATABASE!,
        'host': process.env.MYSQL_HOST!,
        'dialect': 'mysql',
    }
}

export default config;