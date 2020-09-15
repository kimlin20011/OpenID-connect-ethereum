const path = require('path');
const Koa = require('koa');
//const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const static = require('koa-static');
const cors = require('@koa/cors');
const config = require('./configs/config');
const routers = require('./routers/index');

const app = new Koa();

//const staticPath = './views';
const staticPath = './statics';

// http logger
app.use(koaLogger());

// 配置ctx.body解析中间件
app.use(bodyParser());


// 配置服务端模板渲染引擎中间件
/*app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}));*/

//set up landing page of website
app.use(static(
    path.join( __dirname,  staticPath)
))

// initial router middleware
app.use(routers.routes()).use(routers.allowedMethods());

app.use(cors());
// app.use(async (ctx, next) => {
//     ctx.set('Access-Control-Allow-Origin', '*');
//     ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
//     await next();
//   });

// listen port
app.listen( config.port );
console.log(`the IdP server(Koa2) is start at port ${config.port}`);
