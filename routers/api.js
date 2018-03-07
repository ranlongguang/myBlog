var express=require('express');
var router=express.Router();
var User=require("../models/user");

// 处理前端的注册请求
router.post("/user/register",function(req,res){
	let {_username,_password}=req.body;
	// 判断用户名是否已经被注册
	User.findOne({username:_username}).then(function(userInfo){
		if(userInfo){
			res.json({
				code:1,
				message:"用户名已经被注册"
			});
			return;
		};
		// 保存用户注册的信息到数据库中
		let user=new User({
			username:_username,
			password:_password
		});
		return user.save();
	}).then(function(newUserInfo){
		res.json({
			code:0,
			message:"注册成功"
		})
	});
});

// 处理前端的登录请求
router.post("/user/login",function(req,res){
	let {_username,_password}=req.body;
	// 在数据库中查找用户
	User.findOne({
		username:_username
	}).then(function(userInfo){
		if(!userInfo){
			res.json({
				code:1,
				message:"用户名不存在"
			});
			return;
		};
		if(userInfo.password!=_password){
			res.json({
				code:2,
				message:"用户名和密码不匹配"
			});
			return;
		};
		req.cookies.set("userInfo",JSON.stringify({
			_id:userInfo._id,
			username:userInfo.username
		}));
		res.json({
			code:0,
			message:"登录成功",
			userInfo:{
				_id:userInfo._id,
				username:userInfo.username
			}
		});
	});
});

// 处理用户推出的功能
router.get("/user/logout",function(req,res){
	req.cookies.set("userInfo",null);
	res.json({
		code:0,
		message:"退出成功"
	});
});

module.exports=router;
