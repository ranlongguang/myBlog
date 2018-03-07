var express=require('express');
var router=express.Router();

router.get("/",function(req,res){
	res.send("<h1>欢迎来到管理界面</h1>")
});

module.exports=router;
