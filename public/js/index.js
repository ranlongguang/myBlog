$(function(){
	// 点击导航更换样式
	var $nav=$("nav"),username="";
	$nav.on("click","a",function(){
		$(this).addClass("navClick").siblings().removeClass("navClick");
	});
	// 切换登录和注册功能
	$(".colMint").click(function(){
		if($(this).text()=="马上注册"){
			// 切换到注册界面
			$("#registerBox").fadeIn(400);
			$("#loginBox").hide();
			// 清空输入框
			$("#loginUsername").val("");
			$("#loginPassword").val("");
		}else{
			// 切换到登录界面
			$("#loginBox").fadeIn(400);
			$("#registerBox").hide();
			// 清空输入框
			$("#registerUsername").val("");
			$("#registerPassword").val("");
			$("#confirmPassword").val("");
		}
	});
	
	// 注册功能
	$("#rejisterBtn").click(function(){
		let $username=$("#registerUsername").val().trim(),
			$password=$("#registerPassword").val().trim(),
			$confirmpassword=$("#confirmPassword").val().trim();
		// 判断检验用户的输入是否合法
		if(!$username){
			$(".colWarning").text("用户名不能为空！").show(400);
			setTimeout(function(){
				$(".colWarning").hide(400);
			},1500);
			return;
		};
		if(!$password){
			$(".colWarning").text("密码不能为空！").show(400);
			setTimeout(function(){
				$(".colWarning").hide(400);
			},1500);
			return;
		};
		if($password!=$confirmpassword){
			$(".colWarning").text("两次输入的密码不一致！").show(400);
			setTimeout(function(){
				$(".colWarning").hide(400);
			},1500);
			return;
		};
		// 发送注册的请求
		let obj={
			_username:$username,
			_password:$password,
			_confirmpassword:$confirmpassword
		};
		$.post("api/user/register",obj,function(result){
			if(result.code==0){
				$(".colWarning").text(result.message).show(400);
				setTimeout(function(){
					$(".colWarning").hide(400);
				},1500);
				setTimeout(function(){
					// 注册成功后切换到登录界面
					$("#loginBox").fadeIn(400);
					$("#registerBox").hide();
					// 清空输入框
					$("#registerUsername").val("");
					$("#registerPassword").val("");
					$("#confirmPassword").val("");
				},2500);
			}else{
				$(".colWarning").text(result.message).show(400);
				setTimeout(function(){
					$(".colWarning").hide(400);
				},1500);
			}
		});
	});
	
	// 登录功能
	$("#loginBtn").click(function(){
		let $username=$("#loginUsername").val().trim(),
			$password=$("#loginPassword").val().trim();
		// 判断检验用户的输入是否合法
		if(!$username){
			$(".colWarning").text("请输入用户名").show(400);
			setTimeout(function(){
				$(".colWarning").hide(400);
			},1500);
			return;
		};
		if(!$password){
			$(".colWarning").text("请输入密码").show(400);
			setTimeout(function(){
				$(".colWarning").hide(400);
			},1500);
			return;
		};
		// 发送登录的请求
		let obj={
			_username:$username,
			_password:$password
		};
		$.post("api/user/login",obj,function(result){
			// 登录成功后
			if(result.code==0){
				// 设置cookie
				$.cookie("userInfo",JSON.stringify(result.userInfo,{path:"/",expires:7}));
				$(".colWarning").text(result.message).show(400);
				setTimeout(function(){
					$(".colWarning").hide(400);
				},1500);
				setTimeout(function(){
					$("#loginBox").hide();
					$("#loginSuccess").show(400);
					// 清空输入框
					$("#loginUsername").val("");
					$("#loginPassword").val("");
					window.location.reload();
				},2500);
				return;
			};
			// 用户名不存在
			if(result.code==1){
				$(".colWarning").text(result.message).show(400);
				setTimeout(function(){
					$(".colWarning").hide(400);
				},1500);
				return;
			};
			// 密码错误
			if(result.code==2){
				$(".colWarning").text(result.message).show(400);
				setTimeout(function(){
					$(".colWarning").hide(400);
				},1500);
			};
		});
	});
	// 如果是登录状态则显示用户信息，否则显示登录界面
	if($.cookie("userInfo")){
		username=JSON.parse($.cookie("userInfo")).username;
		$("#_username").text(username);
		// 判断是否是管理员登录
		if(JSON.parse($.cookie("userInfo")).isAdmin){
			$("#isAdmin").html(`<span class="colDanger">你好！你是管理员，<a href="/admin">你可以点击这里进入管理</a></span>`);
		}
		$("#loginSuccess").show();
		$("#loginBox").hide();
	}else{
		$("#loginBox").show();
	}
	
	// 退出登录功能
	$("#logoutBtn").click(function(){
		$.cookie("userInfo",{path:"/",expires:-1});
		window.location.reload();
	});
});
