var express=require('express');
var router=express.Router();
router.get('/',function(req,res,next){
	// 使用模板渲染首页，第一个参数：模板文件位置；第二个参数：传递给模板的数据
	res.render("../views/main/index",{
		userInfo:req.userInfo
	});
});

module.exports=router;
