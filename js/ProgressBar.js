(function(window){
	
	function Progress($progressBarBg,$progressBar,$dot){
		return Progress.prototype.init($progressBarBg,$progressBar,$dot);
	}
	Progress.prototype={
		constructor: Progress,//注意格式问题
		init: function($progressBarBg,$progressBar,$dot){
			this.$progressBarBg=$progressBarBg;
			this.$progressBar=$progressBar;
			this.$dot=$dot;
		},
		
		proGressClick:function(){
			var $this=this;		//此时的this时progress调用，赋值给$this
			//点击背景跳的时候
			this.$progressBarBg.click(function(e){
				var proLeft=$(this).offset().left;
				
				//获取点击位置距离窗口位置大小
				var lineLeft=e.pageX;
				
				
				// 点击dot的时候，不会出现dot右方
				var width=$(".dot").width()/2;
				//前滑动栏跟着移动
				$this.$progressBar.css("width",lineLeft-proLeft);
				$this.$dot.css("left",lineLeft-proLeft-width);
				// console.log(lineLeft)
			})
		},
		proGressMove:function(){
			var $this=this;
			
			
			//小点被点击时
			this.$dot.mousedown(function(e){
				
				//获取点击位置距离窗口位置大小
				var lineLeft=e.pageX;
				// 监听document的事件
				// 获取背景条离窗口右边距
				var proLeft=$this.$progressBarBg.offset().left;
				
				$(document).mousemove(function(e){
				
					
					//获取点击位置距离窗口位置大小
					var lineLeft=e.pageX;
					
					
					// 点击dot的时候，不会出现dot右方
					var width=$(".dot").width()/2;
					
					
					// 判断免得小点拖动出外界
					if((lineLeft-proLeft)>0&&(lineLeft-proLeft-width)<$this.$progressBarBg.width()-8){
					    //前滑动栏跟着移动
					    $this.$progressBar.css("width",lineLeft-proLeft);
					    $this.$dot.css("left",lineLeft-proLeft-width);
					    // console.log(lineLeft)
					    
					}
					
					
					
					
				})
				
			})
			
			$(document).mouseup(function(){
				$(document).off("mousemove");
			})

		},
		
		controlPro:function(value){
			if(value<0 || value>100) return;
			
			this.$progressBar.css({
				width:value+"%"
			})
			
			// 若相对自己，则无法移动，则需要相对背景条才可以移动
			this.$dot.css({
				left:value+"%"
			})
		}
		
	}
	
	Progress.prototype.init.prototype=Progress.prototype;
	
	//将闭包中的函数通过window暴露到外面
	window.Progress=Progress;
})(window)