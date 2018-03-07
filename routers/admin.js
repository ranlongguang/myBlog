var express=require('express');
var router=express.Router();

router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		// 如果当前用户不是管理员用户
		res.send("对不起，此页面需经过授权才可进入");
		return;
	}
	next();
});

router.get("/",function(req,res){
	res.send("<h1>欢迎来到管理界面</h1>")
});

module.exports=router;
