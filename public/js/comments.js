$(function(){
	var page=1,limit=10,comments=[];
	$("#messageBtn").click(blogcomment);
	$("#messageContent").keyup(function(e){
		if(e.keyCode==13){
			blogcomment();
		}
	});
	
	// 每次页面重载的时候重新获取评论的数据，然后渲染页面
	$.get("/api/comment",{contentid:$("#contentid").val()},function(result){
		comments=result.data.comments.reverse();console.log(result)
		renderComment();
	}
	);
	
	// 提交评论的处理函数
	function blogcomment(){
		let content=$("#messageContent").val();
		if(!content){
			alert("好歹写几个字再发呀！");
			return ;
		};
		$.ajax({
			type:"POST",
			url:"/api/comment/post",
			data:{
				contentid:$("#contentid").val(),
				content:content
			},
			success:function(result){
				$("#messageContent").val("");
				comments=result.data.comments.reverse();
				renderComment();
			}
		});
	};
	
	// 评论渲染模板
	function renderComment(){
		$("#messageCount").text(comments.length);
		$("#commentsnum").text(comments.length);
		let $li=$(".pager li"),Totalpage=Math.ceil(comments.length/limit);
		if(comments.length==0){
			$(".pager").hide();
			$(".messageList").html(`<div class="messageBox"><p>还没有评论,抢占沙发!!</p></div>`);
			return;
		}
		$li.eq(1).text(page+"/"+Totalpage);
		if(page<=1){
			page=1;
			$li.eq(0).html("<span>没有上一页了</span>");
		}else{
			$li.eq(0).html(`<a href="javascript:void(0);"><span aria-hidden="true">&larr;</span>上一页</a>`);
		}
		if(page>=Totalpage){
			page=Totalpage;
			$li.eq(2).html("<span>没有下一页了</span>");
		}else{
			$li.eq(2).html(`<a href="javascript:void(0);">下一页 <span aria-hidden="true">&rarr;</span></a>`);
		}
		let html="",start=(page-1)*limit,end=Math.min(page*limit,comments.length);
		for(i=start;i<end;i++){
			html+=`<div class="messageBox">
				<p class="name">
					<span class="fl">${comments[i].username}</span>
					<span class="fr">${formTime(comments[i].postTime)}</span>
				</p>
				<p>${comments[i].content}</p>
			</div>`
		};
		$(".messageList").html(html);
	};
	
	// 格式化时间
	function formTime(time){
		let dateTime=new Date(time);
		let years=dateTime.getFullYear(),
			month=("0"+(dateTime.getMonth()+1)).slice(-2),
			day=("0"+dateTime.getDate()).slice(-2),
			hours=("0"+dateTime.getHours()).slice(-2),
			minute=("0"+dateTime.getMinutes()).slice(-2),
			second=("0"+dateTime.getSeconds()).slice(-2);
		return `${years}年${month}月${day}日 ${hours} : ${minute} : ${second}`;
	}
	
	// 评论分页的点击处理
	$(".pager").on("click","a",function(){
		if($(this).parent().hasClass("previous")){
			page--;
			renderComment();
		}else{
			page++;
			renderComment();
		}
	});
});