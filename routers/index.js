var express=require('express');
var router=express.Router();
var Category=require("../models/category");
var Content=require("../models/content");
var data;

// 处理各个页面的通用数据
router.use(function(req,res,next){
	data={
		userInfo:req.userInfo,
		category:[],
	};
	// 读取分类的信息
	Category.find().then(function(result){
		data.category=result;
		next();
	});
});

router.get('/',function(req,res){
	
	data.page=Number(req.query.page||1);
	data.limit=5;
	data.pageTotal=0;
	data.categoryId=req.query.category||"";
	data.count=0;
	
	let where={};
	if(data.categoryId){
		where.category=data.categoryId;
	};
	
	// 读取内容信息
	Content.where(where).count().then(function(count){
		data.count=count;
		// 计算总页数
		data.pageTotal=Math.ceil(data.count/data.limit);
		// 取值不能超过pageTotal
		data.page=Math.min(data.page,data.pageTotal);
		// 取值不能低于1
		data.page=Math.max(data.page,1);
		var skip=(data.page-1)*data.limit; // 每页需要跳过的数据条数
		return Content.where(where).find().sort({_id:-1}).limit(data.limit).skip(skip).populate(["category","user"]);
	}).then(function(contents){
		data.contents=contents;
		res.render("../views/main/index",data);
	});
		
});

// 文章详情页处理
router.get("/view",function(req,res){
	
	// 获取内容的id
	let contentId=req.query.contentid||"";
	Content.findOne({
		_id:contentId
	}).populate(["category","user"]).then(function(content){
		data.content=content;
		content.views++;
		content.save();
		res.render("main/view",data);
	});
});

module.exports=router;
