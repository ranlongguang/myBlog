/*
 * 项目开始时间：2018/3/3
 * */
// 应用程序的启动(入口)文件；
// 加载express模块
var express=require("express");
// 创建app应用  => NodeJS Http.createServer()
var app=express();
// 加载模板处理模块
var swig=require("swig");
// 加载mongodb数据库
var mongoose=require("mongoose");
// 加载body-parser模块
var bodyParser=require("body-parser");
// 配置bodyparser模块处理前端的post请求
app.use(bodyParser.urlencoded({extended:true}));

// 配置静态文件托管
// 当用户访问的 url 是以 public 开头的，则直接返回对应__dirname+"/public"下的文件
app.use("/public",express.static(__dirname+"/public"));

// 配置应用模板，定义当前应用所使用的模板引擎
// 第一个参数：模板引擎的名称，同时也是模板文件的后缀名；
// 第二个参数：表示用于解析模板内容的方法
app.engine("html",swig.renderFile);
// 设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set("views","./views");
// 注册所使用的模板引擎
// 第一个参数必须是 view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称(第一个参数)是一致的
app.set("view engine","html");
// 在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});


// 根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/index'));

// 首页
/*app.get("/",function(req,res,next){
	//res.send("<h1>欢迎光临我的博客！</h1>");
	/*
	 * 读取views目录下的指定文件，解析并返回给客户端
	 * 第一个参数：表示模板的文件，相对于views目录  views/index.html
	 * 第二个参数：传递给模板使用的数据
	 * */
	/*res.render("index");
});*/





// 监听http请求
mongoose.connect("mongodb://localhost:27017/Blog",function(err){
	if(err){
		console.log("数据库连接失败");
	}else{
		console.log("数据库连接成功");
		app.listen(8888,function(){
			console.log("服务器启动成功");
		});
	}
	
});

// 用户发送http请求-> url -> 找到匹配的规则 -> 执行指定的绑定函数，返回指定的内容至客户
// public -> 静态 -> 直接读取指定目录下的文件，返回给用户
// 动态 -> 处理业务逻辑，加载模板，解析模板 -> 返回数据给用户