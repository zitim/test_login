// node 預設模組
var path = require('path');

// NPM 模組
var app = require('express')();
var partials = require('express-partials');
var static = require('serve-static');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var session = require('express-session');    

// router設定
var page = require('./routes/page');

app.set('port', (process.env.PORT || 3001));
// parse application/x-www-form-urlencoded 
// 讓回傳的值可以解析 json與 urlencoded
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
  secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
}));

// 版型設定
app.use(partials());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//設定預設指定目錄
app.use( static( path.join( __dirname, 'public' )));

//預設favicon.ico位置
app.use(favicon(__dirname + '/public/favicon.ico'));

//路徑設定，有get與post指令
app.get('/', page.index);
app.post('/collect',page.collect);
app.post('/remove',page.remove);
app.post('/delete',page.delete);
app.post('/edit',page.edit);
app.post('/postAjax',page.postAjax);
app.get('/getAjax',page.getAjax);
app.get('/getJson', page.getJson);
app.get('/list',page.list);
app.post('/delete_session',page.delete_session);

//偵測3000 port

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
//app.listen(3001);

