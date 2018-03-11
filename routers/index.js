var express=require('express');
var router=express.Router();
var Category=require("../models/category");
router.get('/',function(req,res,next){
	
	// 读取分类的信息
	Category.find().then(function(result){
		// 使用模板渲染首页，第一个参数：模板文件位置；第二个参数：传递给模板的数据
		res.render("../views/main/index",{
			userInfo:req.userInfo,
			category:result
		});
	});
		
});

module.exports=router;
