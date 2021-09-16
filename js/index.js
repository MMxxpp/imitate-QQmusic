$(function(){
	//滚动条初始化
	$(".content-list").mCustomScrollbar();
	
	var $audio=$("audio");
	var player = new Player($audio);
	
	
	//歌曲滚动条
	//初始化
	var $progressBarBg=$(".progress-bar-bg");
	var $progressBar=$(".progress-bar");
	var $dot=$(".dot");
	
	var progress =new Progress($progressBarBg,$progressBar,$dot);
	
	progress.proGressClick();
	progress.proGressMove();
	//利用Ajax加载本地数据源
	
	getPlayMessage();
	function getPlayMessage(){
		$.ajax({
			url:"./source/musiclist.json",
			dataType:'json',//服务器返回json格式数据
			type:"get",
			success:function(data){
				// console.log(data);
				
				//默认开启播放器后，第一首歌曲信息
				musicInfo(data[0]);
				player.musicList=data;
				//遍历获取每一条音乐信息
				var $musicList=$(".content-list ul");
				
				// each():
				// index - 选择器的 index 位置
				// element - 当前的元素（也可使用 "this" 选择器）
				$.each(data,function(index,ele){
					var $item =createMusic(index,ele);
					// console.log(ele);
					$musicList.append($item);
				})
			},
			error:function(e){
				
			}
		});
	}
	
	
	//获取相应歌曲信息
	function musicInfo(music){
		
		//找到要更改的标变量
		var $infoPic = $(".info-pic img");
		var $infoName = $(".info-name a");
		var $infoSinger = $(".info-singer a");
		var $infoAlbum = $(".info-ablum a");
		var $musicBoTopName = $(".music-bo-top-name");
		var $musicBoTopTime = $(".music-bo-top-time");
		var $maskBg=$(".mask-bg");
		
		
		//给获取的属性附上相应的值
		$infoPic.attr("src",music.cover);
		$infoName.text(music.name);
		$infoSinger.text(music.singer);
		$infoAlbum.text(music.album);
		$musicBoTopName.text(music.name+' - '+music.singer);
		$musicBoTopTime.text("00:00 / "+music.time);
		$maskBg.css("background","url("+music.cover+")");
	}
	
	
	
	initEvent();
	function initEvent(){
		//jQuery动态创建的事件得通过事件委托才可以触发函数
		// 使用 delegate() 方法的事件处理程序适用于当前或未来的元素（比如由脚本创建的新元素）
		
		//获取已有的类.content-list，对类动态生成的数据进行事件委托触发
		$(".content-list").delegate(".list-music","mouseenter",function(){
			//显示子菜单
			$(this).find(".list-munu").stop().fadeIn(100)
			$(this).find(".times-delete").stop().fadeIn(100)
			//隐藏时长
			$(this).find(".times span").stop().fadeOut(100)
		})
		
		
		$(".content-list").delegate(".list-music","mouseleave",function(){
			$(this).find(".list-munu").stop().fadeOut(100)
			$(this).find(".times-delete").stop().fadeOut(100)
			//显示时长
			$(this).find(".times span").stop().fadeIn(100)
		})
		
		$(".content-list").delegate(".check i","click",function(){
			//toggleClass切换点击显示隐藏图标
			
			$(this).toggleClass("list-checked")
		})
		
		
		//获取子菜单播放按钮
		$(".content-list").delegate(".list-munu-bo","click",function(){
			
			var $footPlay =$(".foot-tab-bo-pause");
			var $parents =$(this).parents(".list-music");
			
			//打印是否已经获取到index和music数据
			// console.log($parents.get(0).index);
			// console.log($parents.get(0).music);
			
			musicInfo($parents.get(0).music);
			
			$(this).toggleClass("list-munu-play");
			//点击按钮时其他按钮的播放暂停
			// jQuery.parents(expr) 找到所有祖先元素，不限于父元素
			//jQuery.siblings()            //查找兄弟节点，不分前后
			$parents.siblings().find(".list-munu-play").removeClass("list-munu-play");
			
			
			$parents.siblings().find(".name").css("color","rgba(255,255,255,0.5)");
			$parents.siblings().find(".list-num").removeClass("list-num-wave");
			//点击时，底部导航栏的播放按钮跟着同步
			
			if($(this).hasClass("list-munu-play")){
				$footPlay.addClass("foot-tab-bo");
				
				//监听点击文字高亮
				$parents.find(".name").css("color","#fff");
				
				//显示波浪
				$parents.find(".list-num").addClass("list-num-wave");
			}else{
				$footPlay.removeClass("foot-tab-bo");
				$parents.find(".name").css("color","rgba(255,255,255,0.5)");
				$parents.find(".list-num").removeClass("list-num-wave");
			}
			
			
			// 点击播放音乐
			player.playMusic($parents.get(0).index,$parents.get(0).music)
			
		})
		
		$(".foot-tab-pre").click(function(){
			$(".list-music").eq(player.prePlay()).find(".list-munu-bo").trigger("click");
		});
		
		
		$(".foot-tab-bo-pause").click(function(){
			// 初始化未播放时
			if(player.currentIndex==-1){
				
				//trigger()主动触发函数
				$(".list-music").eq(0).find(".list-munu-bo").trigger("click");
			}else{
				// currentIndex会改变
				$(".list-music").eq(player.currentIndex).find(".list-munu-bo").trigger("click");
			}
		});
		
		
		$(".foot-tab-next").click(function(){
			$(".list-music").eq(player.nextPlay()).find(".list-munu-bo").trigger("click");
		});
		
		
		//删除按钮触发时
		$(".content-list").delegate(".times-delete-de","click",function(){
			
			var $delItem = $(this).parents(".list-music");
			
			
			//点击删除正在播放的音乐时自动播放下一条
			if($delItem.get(0).index == player.currentIndex){
				$(".foot-tab-next").trigger("click");
			}
			//前后数据删除
			$delItem.remove();
			player.deleteItem($delItem.get(0).index);

			
			//重新排序
			$(".list-music").each(function(index,ele){
				// 原生
				ele.index=index;
				// 序号排序正确
				$(this).find(".list-num").text(index+1);
				// console.log(index)
				// console.log(ele.index)
			})
					
		})
		
		
		// 监听播放进度条
		// 回调函数将timeStr的值返回调用函数里面
		player.musicTime(function(duration,currentTime,timeStr){
			//监听时间进度
			$(".music-bo-top-time").text(timeStr);
			
			// 进度条响应  获取百分比
			var value=currentTime/duration*100;
			
			// 将百分比赋值给进度条
			progress.controlPro(value);
		});
		
	};
	
	
	
	
	function createMusic(index,music){
		
		//在idea转义后添加一些字符才可以使用
		var $li =$('<li class="list-music">\n' +
        '\t\t\t\t\t\t\t\t<div class="check"><i></i></div>\n' +
        '\t\t\t\t\t\t\t\t<div class="list-num">'+(index+1)+'</div>\n' +
        '\t\t\t\t\t\t\t\t<div class="name">'+music.name+'' +
        '\t\t\t\t\t\t\t\t\t<div class="list-munu">\n' +
        '\t\t\t\t\t\t\t\t\t\t<a href="javascript:;" title="播放" class="list-munu-bo"></a>\n' +
        '\t\t\t\t\t\t\t\t\t\t<a href="javascript:;" title="添加" class="list-munu-add"></a>\n' +
        '\t\t\t\t\t\t\t\t\t\t<a href="javascript:;" title="下载" class="list-munu-down"></a>\n' +
        '\t\t\t\t\t\t\t\t\t\t<a href="javascript:;" title="分享" class="list-munu-share"></a>\n' +
        '\t\t\t\t\t\t\t\t\t</div>\n' +
        '\t\t\t\t\t\t\t\t</div>\n' +
        '\t\t\t\t\t\t\t\t<div class="singer">'+music.singer+'</div>\n' +
        '\t\t\t\t\t\t\t\t<div class="times"><span>'+music.time+'</span>\n' +
        '\t\t\t\t\t\t\t\t\t<div class="times-delete">\n' +
        '\t\t\t\t\t\t\t\t\t\t<a href="javascript:;" title="删除" class="times-delete-de"></a>\n' +
        '\t\t\t\t\t\t\t\t\t</div>\n' +
        '\t\t\t\t\t\t\t\t</div>\n' +
        '\t\t\t\t\t\t\t</li>')
		
		
		//获取原生的数据
		$li.get(0).index=index; //将原生的li的index值赋值
		$li.get(0).music=music;
		
		
		return $li;
	}
	
	
})