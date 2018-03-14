var express=require('express');
var router=express.Router();
var User=require("../models/user");
var Category=require("../models/category");
var Content=require("../models/content");

router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		// 如果当前用户不是管理员用户
		res.send("对不起，此页面需经过授权才可进入");
		return;
	}
	next();
});

// 首页
router.get("/",function(req,res){
	res.render("../views/admin/index",{
		userInfo:req.userInfo
	});
});

// 用户管理
router.get("/user",function(req,res){
	
	// 从数据库中读取所有的用户数据
	// limit(Number):限制获取的数据条数
	// skip(Number):跳过数据的条数
	
	var page=Number(req.query.page||1); // 想要查看的页数
	var limit=2; // 每页的数据条数
	var pageTotal=0; // 总页数
	
	// count()方法是获取数据库中数据的总条数
	User.count().then(function(count){
		// 计算总页数
		pageTotal=Math.ceil(count/limit);
		// 取值不能超过pageTotal
		page=Math.min(page,pageTotal);
		// 取值不能低于1
		page=Math.max(page,1);
		var skip=(page-1)*limit; // 每页需要跳过的数据条数
		
		User.find().limit(limit).skip(skip).then(function(users){
			res.render("admin/user_index",{
				userInfo:req.userInfo,
				users:users,
				page:page,
				pageTotal:pageTotal,
				count:count,
				limit:limit
			});
		});
		
	});
	
});

// 分类首页
router.get("/category",function(req,res){
	// 从数据库中读取所有的用户数据
	// limit(Number):限制获取的数据条数
	// skip(Number):跳过数据的条数
	
	var page=Number(req.query.page||1); // 想要查看的页数
	var limit=10; // 每页的数据条数
	var pageTotal=0; // 总页数
	
	// count()方法是获取数据库中数据的总条数
	Category.count().then(function(count){
		// 计算总页数
		pageTotal=Math.ceil(count/limit);
		// 取值不能超过pageTotal
		page=Math.min(page,pageTotal);
		// 取值不能低于1
		page=Math.max(page,1);
		var skip=(page-1)*limit; // 每页需要跳过的数据条数
		
		Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
			res.render("admin/category_index",{
				userInfo:req.userInfo,
				categories:categories,
				page:page,
				pageTotal:pageTotal,
				count:count,
				limit:limit
			});
		});
		
	});
});

// 分类的添加
router.get("/category/add",function(req,res){
	res.render("admin/category_add",{
		userInfo:req.userInfo
	});
});

// 分类编辑
router.get("/category/edit",function(req,res){
	// 获取需要修改的分类的信息，并且用表单的形式展现出来
	var id=req.query.id||'';
	// 获取需要修改的分类的信息
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
				res.render("admin/err",{
				userInfo:req.userInfo,
				message:"需要修改的分类信息不存在，需要先进行添加分类信息"
			});
		}else{
			res.render("admin/category_edit",{
				userInfo:req.userInfo,
				category:category
			});
		}
	})
});
// 分类的保存 
router.post("/category/edit",function(req,res){
	// 获取需要修改的分类的信息，并且用表单的形式展现出来
	var id=req.query.id||'';
	var name=req.body.name||'';
	// 获取需要修改的分类的信息
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
				res.render("admin/err",{
				userInfo:req.userInfo,
				message:"需要修改的分类信息不存在，需要先进行添加分类信息"
			});
			return Promise.reject();
		}else{
			// 当用户没有做任何修改就提交的时候
			if(name==category.name) {
					res.render("admin/success",{
					userInfo:req.userInfo,
					message:"修改成功",
					url:"/admin/category"
				});
				return Promise.reject();
			}else {
				// 要修改为的名称是否在数据库已经存在
				return Category.findOne({
					_id:{$ne:id},
					name:name
				})
			}
		}
	}).then(function(sameCategory){
		if(sameCategory) {
			res.render("admin/err",{
				userInfo:req.userInfo,
				message:"数据库已经存在同名的分类"
			});
			return Promise.reject();
		}else {
			return Category.update({
				_id:id
			},{
				name:name
			});
		}
	}).then(function(){
		res.render("admin/success",{
			userInfo:req.userInfo,
			message:"修改成功",
			url:"/admin/category"
		});
	});
});


// 分类删除
router.get("/category/delete",function(req,res){
	// 获取需要删除的分类的id
	var id=req.query.id||'';
	Category.remove({
		_id:id
	}).then(function(){
		res.render("admin/success",{
			userInfo:req.userInfo,
			message:"删除成功",
			url:"/admin/category"
		});
	});
});
//分类添加的表单处理
router.post("/category/add",function(req,res){
	var name=req.body.name||'';
	if(name==''){
		res.render("admin/err",{
			userInfo:req.userInfo,
			message:"分类名称不能为空"
		});
		return;
	}
	
	// 查找数据库中是否已经存在同名的分类名称
	Category.findOne({
		name:name
	}).then(function(result){
		if(result){
			// 数据库已经存在改分类
			res.render("admin/err",{
				userInfo:req.userInfo,
				message:"该分类已经存在"
			});
			return Promise.reject();
		}else{
			// 数据库中不存在该分类，可以进行保存
			return new Category({
				name:name
			}).save();
		}
	}).then(function(newCategory){
		res.render("admin/success",{
			userInfo:req.userInfo,
			message:"分类添加成功",
			url:"/admin/category"
		});
	});
});

// 内容首页
router.get("/content",function(req,res){
	
	var page=Number(req.query.page||1); // 想要查看的页数
	var limit=10; // 每页的数据条数
	var pageTotal=0; // 总页数
	
	// count()方法是获取数据库中数据的总条数
	Content.count().then(function(count){
		// 计算总页数
		pageTotal=Math.ceil(count/limit);
		// 取值不能超过pageTotal
		page=Math.min(page,pageTotal);
		// 取值不能低于1
		page=Math.max(page,1);
		var skip=(page-1)*limit; // 每页需要跳过的数据条数
		
		Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(["category","user"]).then(function(contents){
			res.render("admin/content_index",{
				userInfo:req.userInfo,
				contents:contents,
				page:page,
				pageTotal:pageTotal,
				count:count,
				limit:limit
			});
		});
		
	});
	
});

// 内容添加页面
router.get("/content/add",function(req,res){
	
	Category.find().then(function(categories){
		res.render("admin/content_add",{
			userInfo:req.userInfo,
			categories:categories
		});
	});
	
});

// 内容保存
router.post("/content/add",function(req,res){
	if(req.body.category==""){
		res.render("admin/err",{
			userInfo:req.userInfo,
			message:"内容的所属分类不能为空"
		});
		return;
	};
	if(req.body.title==""){
		res.render("admin/err",{
			userInfo:req.userInfo,
			message:"内容的标题不能为空"
		});
		return;
	};
	// 保存内容数据到数据库
	new Content({
		category:req.body.category,
		title:req.body.title,
		user:req.userInfo,
		description:req.body.description,
		content:req.body.content
	}).save().then(function(result){
		res.render("admin/success",{
			userInfo:req.userInfo,
			message:"内容保存成功",
			url:"/admin/content",
			continueUrl:"/admin/content/add",
			continueContent:"继续添加"
		});
	});
	
});

// 修改内容
router.get("/content/edit",function(req,res){
	let id=req.query.id||"";
	let categories=[];
	Category.find().then(function(result){
		categories=result;
		return Content.findOne({
			_id:id
		}).populate("category");
	}).then(function(content){
			if(!content){
				res.render("admin/error",{
					userInfo:req.userInfo,
					message:"访问的内容不存在"
				});
				return Promise.reject();
			}else{
				res.render("admin/content_edit",{
					userInfo:req.userInfo,
					content:content,
					categories:categories
				});
			}
		});
});

// 保存修改内容
router.post("/content/edit",function(req,res){
	let id=req.query.id||"";
	if(req.body.category==""){
		res.render("admin/err",{
			userInfo:req.userInfo,
			message:"内容的所属分类不能为空"
		});
		return;
	};
	if(req.body.title==""){
		res.render("admin/err",{
			userInfo:req.userInfo,
			message:"内容的标题不能为空"
		});
		return;
	};
	// 更新数据
	Content.update({
		_id:id
	},{
		category:req.body.category,
		title:req.body.title,
		description:req.body.description,
		content:req.body.content
	}).then(function(){
		res.render("admin/success",{
			userInfo:req.userInfo,
			message:"内容修改成功",
			url:"/admin/content"
		});
	});
});

// 内容删除
router.get("/content/delete",function(req,res){
	let id=req.query.id;
	if(!id){
		res.render("admin/error",{
			userInfo:req.userInfo,
			message:"需要删除的内容不存在"
		});
	}else{
		Content.remove({
		_id:id
		}).then(function(){
			res.render("admin/success",{
				userInfo:req.userInfo,
				message:"内容删除成功",
				url:"/admin/content"
			});
		});
	}
});

module.exports=router;
