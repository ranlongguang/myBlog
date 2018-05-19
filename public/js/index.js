$(function(){
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
	
	// 限制注册界面的用户名不能使用汉字
	$("#registerUsername").keyup(function(){
		this.value=this.value.replace(/[\u4E00-\u9FFF]/g,'');
	});
	
	// 注册功能
	$("#rejisterBtn").click(function(){
		let $username=$("#registerUsername").val().trim(),
			$password=$("#registerPassword").val().trim(),
			$confirmpassword=$("#confirmPassword").val().trim();console.log($username);
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
			$password=$("#loginPassword").val().trim(),
			$verification=$("#verification").val().trim();
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
		
		// 输入验证码
		if($verification){
			if($verification!=yan){
				$(".colWarning").text("验证码错误，请重输入正确的验证码！").show(400);
				setTimeout(function(){
					$(".colWarning").hide(400);
				},1500);
				return;
			}
		}else{
			$(".colWarning").text("请输入验证码").show(400);
			setTimeout(function(){
				$(".colWarning").hide(400);
			},1500);
			return;
		}
		
		// 发送登录的请求
		let obj={
			_username:$username,
			_password:$password
		};
		$.post("api/user/login",obj,function(result){
			// 登录成功后
			if(result.code==0){
				$(".colWarning").text(result.message).show(400);
				setTimeout(function(){
					$(".colWarning").hide(400);
					// 清空输入框
					$("#loginUsername").val("");
					$("#loginPassword").val("");
					window.location.reload();
				},1500);
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
	
	//验证码
	var yan;
	function verification(){
		yan=Math.ceil(Math.random()*9999);
		if(yan<1000){
			yan=8888;
		}
		return yan;
	}
	$("#yanzheng").html(verification());
	$("#yanzheng").click(function(){
		$(this).html(verification());
	});
	
	// 退出登录功能
	$("#logoutBtn").click(function(){
		$.get("api/user/logout",function(result){
			if(!result.code){
				window.location.reload();
			}
		});
	});
	
	var t=new TimelineMax();
	t.set(".logo",{y:-250})
	t.to(".logo",3,{
		y:0,
		ease:"Bounce.easeInOut"
	},1);
	t.to(".logo",2,{
		scale:0.5
	},4);
	
	// 换肤
	var pfbox=[
		{id:"0",url:"../../public/img/topbg.jpg"},
		{id:"1",url:"../../public/img/xia.jpg"},
		{id:"2",url:"../../public/img/qiu.jpg"},
		{id:"3",url:"../../public/img/dong.jpg"}
	],pf_url="";
	// 检测用户是否有设置过皮肤
	if($.cookie("mypf")){
		pf_url=JSON.parse($.cookie("mypf")).url;
		$(".backimg").find("img").attr("src",pf_url);
		$(".pf_item").eq(JSON.parse($.cookie("mypf")).id).addClass("pf_active").siblings().removeClass("pf_active");
	}else{
		pf_url=pfbox[0].url;
		$(".backimg").find("img").attr("src",pf_url);
	}
	// 点击展开换皮肤选项
	$("#hf-btn").click(function(){
		if($(this).text()==="查看皮肤"){
			$(this).text("收起皮肤");
			$(".hf-icon").show();
			$(".pf_box").show(200);
		}else{
			$(this).text("查看皮肤");
			$(".hf-icon").hide();
			$(".pf_box").hide();
		}
	});
	// 点击更换皮肤
	$(".pf_box").on("click",".pf_item",function(){
		pf_url=pfbox[$(this).data().idx].url;
		$(".backimg").find("img").attr("src",pf_url);
		$.cookie("mypf",JSON.stringify(pfbox[$(this).data().idx],{path:"/",expires:15}));
		$(".hf-icon").hide();
		$(".pf_box").hide();
		$("#hf-btn").text("查看皮肤");
		$(".pf_item").eq($(this).data().idx).addClass("pf_active").siblings().removeClass("pf_active");
	});
	
});
