(function(window){
	
	function Player($audio){
		return Player.prototype.init($audio);
	}
	Player.prototype={
		constructor: Player,//注意格式问题
		musicList:[],		//存放数据
		currentIndex:-1,
		init: function($audio){
			this.$audio=$audio
			this.audio =$audio.get(0) //原生JS获取第一个audio
		},
		
		
		playMusic:function(index,music){
			
			if(this.currentIndex==index){
				//同一首音乐
				if(this.audio.paused){
					this.audio.play();
				}else{
					this.audio.pause();
				}
			}else{
				this.$audio.attr("src",music.link_url)
				this.audio.play();
				this.currentIndex=index;
			}
		},
		
		prePlay:function(){
			
			var index=this.currentIndex-1;
			if(index<0){
				index=this.musicList.length-1;
			}
			
			return index;
		},
		
		nextPlay:function(){
			var index=this.currentIndex+1;
			if(index>this.musicList.length-1){
				index=0;
			}
			
			return index;
		},
		
		deleteItem:function(index){
			//删除对应的数据
			this.musicList.splice(index,1);
			
			//判断当前删除音乐是否是前一首
			if(index<this.currentIndex){
				this.currentIndex=this.currentIndex-1;
			}
			
		},
		
		
		// currentTime 以s为单位返回从开始播放到目前所花的时间，也可设置 currentTime的值来跳转到特定位置
		// duration：获取媒体文件的播放时长，
		getTimeDuration:function(){
			return this.audio.duration;
		},
		
		getCurrentTime:function(){
			return this.audio.currentTime;
		},
		
		
		
		// timeupdate
		// 播放视频/音频（audio/video）
		// 重新定位视频/音频（audio/video）的播放位置。
		
		//通过回调函数将最里面的值传递出去
		musicTime:function(callback){
			var $this=this; //获取的是player的this
			
			this.$audio.on("timeupdate",function(){
				// console.log("music");
				// console.log(player.getTimeDuration(),player.getCurrentTime());
				var duration = $this.audio.duration;
				var currentTime = $this.audio.currentTime;
				
				var timeStr=$this.formDate(currentTime,duration);
				callback(duration,currentTime,timeStr);
			});
		},
		
		
		// 修改时间的格式
		formDate:function(currentTime,duration){
			var endMin = parseInt(duration/60);
			var endSecond = parseInt(duration%60);
			 var startMin =parseInt(currentTime/60);
			 var startSecond =parseInt(currentTime%60);
			 
			 
			 if(endMin<10){
				 endMin="0"+endMin;
			 }
			 if(endSecond<10){
			 	endSecond="0"+endSecond;
			 }
			 
			 if(startMin<10){
			 	startMin="0"+startMin;
			 }
			 
			 if(startSecond<10){
			 	startSecond="0"+startSecond;
			 }
			 
			 
			 return startMin+":"+startSecond+" / "+endMin+":"+endSecond;
		}
	}
	
	Player.prototype.init.prototype=Player.prototype;
	
	//将闭包中的函数通过window暴露到外面
	window.Player=Player;
})(window)