/*!
 * Image Trimming UI Libraly
 * Version 0.1
 * Requires jQuery v1.7 or later,jQuery blockUI plugin
 *
 * Examples at: http://luckybancho.ldblog.jp/
 * Copyright (c) 2016 Lucky Bancho
 * licensed under the MIT licenses:
 * http://www.opensource.org/licenses/mit-license.php
 *
 
 */

var Lb_Trim = function(param){
	//コンストラクタ
	
	
	//クロージャ中の参照のコピー
	var lb = this;
	
	
	//要素のIDを生成
	this.rand_id = (new Date()).getTime();
	this.canvas_id ="lbtrim_panel"+this.rand_id;
	this.canvas_frame_id ="lbtrim_panelframe"+this.rand_id;
	this.cut_butoon_id ="lbtrim_cutbtn"+this.rand_id;
	this.canvas_wrap_id ="lbtrim_panelwrap"+this.rand_id;
	this.trimming_target_id=param.trim_id;
	
	//必要な画面要素の生成（サイズを取得するためにこのタイミングで）
	var canvas_title="範囲を指定して,切り取りボタンかダブルクリックで切り取ってください";
	if(param.title){
		canvas_title = param.title;
	}
	
	var dd_msg="クリックしてファイルを選択するかここにドラッグ＆ドロップしてください";
	if(param.upload_area_message){
		dd_msg = param.upload_area_message;
	}

	var btn_msg="切り抜き";
	if(param.cut_button_message){
		btn_msg = param.cut_button_message;
	}
	var btn_close = "閉じる";
	if(param.close_button_message){
		btn_close = param.close_button_message;
	}
	
	var btn_maximize = "最大化";
	if(param.maximize_button_message){
		btn_maximize = param.maximize_button_message;
	}
	
	
	this.onCutFinished=null;
	if(param.onCutFinished){
		if(typeof param.onCutFinished === 'function'){
			this.onCutFinished = param.onCutFinished;
		}
	}
	
	this.draw_canvus_area(canvas_title,btn_msg,btn_close,btn_maximize);
	this.draw_upload_area(param.upload_id,dd_msg);

	this.setCanvusSize = function(){
		lb.panelMaxW =(window.innerWidth * 0.8) - 50;	//トリミング用パネルの最大幅
//		lb.panelMaxH=600 - 50;	//トリミング用パネルの最大高さ

		lb.panelMaxH=(window.innerHeight * 0.7) - 50;	//トリミング用パネルの最大高さ
		lb.clipW=0;			//クリップ領域の高さ
		lb.clipH=0;			//クリップ領域の幅	
		if(lb.trimming_target_id){
			var t = $('#'+param.trim_id);
			if(t.length >0){
				var tw = t.width();
				var th = t.height();
				if(tw > 0){
					//トリミング比を保ちつつ、指定可能な最大の大きさに（初期位置分ずらす）
					var wr = (lb.panelMaxW - 30) / tw;
					var hr = (lb.panelMaxH - 30) / th;
					//比率の小さい方を限界まで伸ばす
					if(wr < hr){
						lb.clipW = tw * wr;
						lb.clipH = th * wr;
					}else{
						lb.clipW = tw * hr;
						lb.clipH = th * hr;
					}
				}else{
					//サイズが指定されていなければエラー
					alert("トリミング先のサイズが指定されていません");
					return
				}

			}else{
				//見つからなければエラー
				alert("トリミング先を指定してください");
				return
			}
		}else{
			//指定がなければエラー
			alert("トリミング先を指定してください");
			return
		}
	}
	this.setCanvusSize();

	//リサイズした時にも完了後に実行。
	var timer = false;
	$(window).resize(function() {
	    if (timer !== false) {
	        clearTimeout(timer);
	    }
	    timer = setTimeout(function() {
	        lb.setCanvusSize();
	    }, 200);
	});	
	
	

	this.currentCanvasScale=1;//	キャンバス画面の拡大率
	//フラグ
	this.created=false;		//作成状態
	this.loaded=false;		//画像読み込み状態
	
	//参照
	this.canvas = null;
	this.ctx = null;		//トリミング用キャンパス
	this.image;				//読み込みイメージ
//orgImageは画像調整機能が入るまで不要（メモリ節約のためコメントアウト
//	this.orgImage;			//オリジナルイメージ
	this.iMouseX=1;
	this.iMouseY = 1;	//マウス位置
	this.theSelection;		//選択状態
	this.canvasX;				//イメージ高さ
	this.canvasY;				//イメージ幅
	this.panelDrag = new Object();	//ドラッグ状態
	this.pRate=1;					//拡大率
	this.rPRate=1; //割り算を掛け算にするためのpRateの逆数
	this.lastTap;

	

    //ロードした画像のオブジェクト
    this.image = new Image();
//    this.orgImage = new Image();

    // キャンバスオブジェクトを生成
    this.canvas = document.getElementById(this.canvas_id);
    this.ctx = this.canvas.getContext('2d');
	$("#"+this.canvas_id).bind('contextmenu', function() {return false;});

     // トリミング領域の定義
    this.theSelection = new Selection(this.ctx,100, 100, this.clipW, this.clipH);
    var isTouch = this.isTouch;
	function Selection(ctx,x, y, w, h){
		this.ctx = ctx;
	    this.x = x; // 初期ポジション
	    this.y = y;
	    this.w = w; // 初期サイズ
	    this.h = h;

	    this.px = x; // 計算用
	    this.py = y;
	    this.csize = 6; // 四隅のリサイズ用ブロックサイズ
	    this.csizeh = 10; // 上記のマウスオーバー時のサイズ

	    this.bHow = [false, false, false, false]; // マウスオーバーステータス
	    this.iCSize = [this.csize, this.csize, this.csize, this.csize]; // 四隅のサイズ
	    this.bDrag = [false, false, false, false]; // ドラッグステータス
	    this.bDragAll = false; // 全体ドラッグフラグ
	}
	this.createSelection = function(ctx,x, y, w, h){
		return new Selection(ctx,x, y, w, h);
	}


	// define Selection draw method
	Selection.prototype.draw = function(){
	    lb.ctx.strokeStyle = '#000';
	    lb.ctx.lineWidth = 2;
	    lb.ctx.strokeRect(this.x, this.y, this.w, this.h);
	    // draw part of original image
	    if (this.w > 0 && this.h > 0) {
	        lb.ctx.drawImage(lb.image, this.x * lb.rPRate , this.y * lb.rPRate, this.w * lb.rPRate, this.h * lb.rPRate, this.x, this.y, this.w, this.h);
	    }
	    // draw resize cubes
	    lb.ctx.fillStyle = '#fff';
	    lb.ctx.fillRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
	    lb.ctx.fillRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
	    lb.ctx.fillRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
	    lb.ctx.fillRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);
	    

	}

};


(function(){
	Lb_Trim.prototype.draw_canvus_area = function(canvas_title,btn_msg,btn_close,btn_maximize) {
		$('body').append('<div id="'+this.canvas_wrap_id+'" class="lb_trim_area"><div class="lb_trim_title">'+canvas_title+'</div><div id="'+this.canvas_frame_id+'" class="lb_framearea" ><canvas id="'+this.canvas_id+'"></canvas></div><button id="'+this.cut_butoon_id+'" class="shiny-button">'+btn_msg+'</button><button id="maximize_'+this.cut_butoon_id+'" class="shiny-button">'+btn_maximize+'</button><button id="close_'+this.cut_butoon_id+'" class="shiny-button">'+btn_close+'</button></div>');
		
		var panel = $("#"+this.canvas_id);
		var button = $("#"+this.cut_butoon_id);

		//マウスアクションを仕込む（定義は後述
	    panel.mousemove(mousemove)
	    	.mousedown(mousedown)
	    	.mouseup(mouseup)
		    .mouseout(mouseout)
			.dblclick(doubleclick);
		
		//タッチパネル対応
		var p = panel[0];
		var lb = this;
		p.addEventListener("touchstart", function(e){
				e.preventDefault();	//拡大を無効に
				
				if(e.touches.length==1){
					var t = (new Date()).getTime();
					//前回のタップから500ミリ秒以内ならダブルタップ扱い
					if(t - lb.lastTap < 500){
						doubleclick(e);
					}else{
						lb.lastTap = t;
						mousedown(e);
					}
				}else{
					//マルチタッチはダブルタップ扱いにしない
					mousedown(e);
				}
			}, false);
		p.addEventListener("touchmove", function(e){
				e.preventDefault();//全体スクロールを無効に
				mousemove(e);
			}, false);
		p.addEventListener("touchend", mouseup, false);
	    panel.css('cursor','pointer');


		
		button.click(trim_image);
		
		
		
		var closebth=$("#close_"+this.cut_butoon_id);
		closebth.click(function(){
			$.unblockUI();
		});
		
		var maximize_button=$("#maximize_"+this.cut_butoon_id);
		maximize_button.click(function(){
			lb.maximizeSelection();
		});


	
		
		//イベント中の参照のコピー
		var lb = this;
		// マウスを動かしているイベント
		function mousemove(e){
			var canvasOffset = $(panel).offset();
			var theSelection = lb.theSelection;
			var pageX;
			var pageY;
			var touch_distance;
			var reflesh=true;
			var multitach=false;
			if (e.targetTouches) {
				if(e.touches.length>1){
					multitach =true;
					//マルチタッチの場合は、X座標の最大値を参照
					var minX=9999;
					var maxX=0;
					
					for(i=0;i < e.touches.length;i++){
						var touch = e.targetTouches[i];
						if(touch.pageX < minX){
							minX = touch.pageX;
						}
						if(touch.pageX > maxX){
							maxX = touch.pageX;
						}
					}
					touch_distance = maxX - minX;
				}else{
					
					var touch = e.targetTouches[0];
					pageX = touch.pageX;
					pageY = touch.pageY;
				}
				
				
		        iMouseX = Math.floor(pageX - canvasOffset.left);
		        iMouseY = Math.floor(pageY - canvasOffset.top);
			}else{
		        iMouseX = Math.floor(e.pageX - canvasOffset.left);
		        iMouseY = Math.floor(e.pageY - canvasOffset.top);
			}


//マウス位置確認のためのログ出力
//	        mousepos(iMouseX,iMouseY,theSelection.x,theSelection.y,theSelection.x+theSelection.w,theSelection.y,theSelection.x,theSelection.y+theSelection.h,theSelection.x+theSelection.w,theSelection.y+theSelection.h);
	        
	        
	        if(multitach==false){
	        	//マルチタッチ以外は、マウスの場所により判定
	        	
		        // 四隅でなく全体が選択されている場合
		        
		        if (theSelection.bDragAll) {
		        	if(0 > (iMouseX - theSelection.px)){
		        		theSelection.x = 0
		        	}else if(lb.canvasX >= (iMouseX - theSelection.px + theSelection.w)){
		            	theSelection.x = iMouseX - theSelection.px;
		        	}else{
		        		theSelection.x = lb.canvasX  - theSelection.w;
		        	}
		        	
		        	if(0 > (iMouseY - theSelection.py)){
		        		theSelection.y = 0;
		        	}else if(lb.canvasY > (iMouseY - theSelection.py + theSelection.h)){
		           		theSelection.y = iMouseY - theSelection.py;
		        	}else{
		        		theSelection.y = lb.canvasY  - theSelection.h;
		        	}
		        }
		        
		        //領域外のドラッグは全体のスクロールを設定
		        if(theSelection.bDragOther && !(theSelection.bDrag[1] || theSelection.bDrag[2] || theSelection.bDrag[3])) {
		        	var pf = $("#"+lb.canvas_frame_id);
		        	var st = pf.scrollTop();
		        	var sl = pf.scrollLeft();
		        	pf.scrollTop(st - (iMouseY - lb.panelDrag.y));
		   	    	pf.scrollLeft(sl-(iMouseX - lb.panelDrag.x));
		   	    	
		   	    	reflesh = false;
		        }

		        for (i = 0; i < 4; i++) {
		            theSelection.bHow[i] = false;
		            theSelection.iCSize[i] = theSelection.csize;
		        }

		        // 四隅のリサイズ領域がドラッグされているか判定
		        if (iMouseX > theSelection.x - theSelection.csizeh && iMouseX < theSelection.x + theSelection.csizeh &&
		            iMouseY > theSelection.y - theSelection.csizeh && iMouseY < theSelection.y + theSelection.csizeh) {
		            theSelection.bHow[0] = true;
		        }
		        if (iMouseX > theSelection.x + theSelection.w-theSelection.csizeh && iMouseX < theSelection.x + theSelection.w + theSelection.csizeh &&
		            iMouseY > theSelection.y - theSelection.csizeh && iMouseY < theSelection.y + theSelection.csizeh) {

		            theSelection.bHow[1] = true;
		            theSelection.iCSize[1] = theSelection.csizeh;
		        }
		        if (iMouseX > theSelection.x + theSelection.w-theSelection.csizeh && iMouseX < theSelection.x + theSelection.w + theSelection.csizeh &&
		            iMouseY > theSelection.y + theSelection.h-theSelection.csizeh && iMouseY < theSelection.y + theSelection.h + theSelection.csizeh) {

		            theSelection.bHow[2] = true;
		            theSelection.iCSize[2] = theSelection.csizeh;
		        }
		        if (iMouseX > theSelection.x - theSelection.csizeh && iMouseX < theSelection.x + theSelection.csizeh &&
		            iMouseY > theSelection.y + theSelection.h-theSelection.csizeh && iMouseY < theSelection.y + theSelection.h + theSelection.csizeh) {

		            theSelection.bHow[3] = true;
		            theSelection.iCSize[3] = theSelection.csizeh;
		        }
		        
		    }else{
		    	//マルチタッチの時は右下がドラッグされていると見做す。
				theSelection.bHow[2] = true;
				theSelection.iCSize[2] = theSelection.csizeh;
				
		    }
		    


	        // 四隅のリサイズ領域がドラッグされている場合
	        var iFW, iFH,iFX,iFY;
	        if(multitach==false){
		        if (theSelection.bDrag[1] || theSelection.bDrag[2]) {//右端は横を伸ばす
		            iFX = theSelection.x;
		            iFY = theSelection.y;
		            iFW = iMouseX - theSelection.px - iFX;
		            iFH = (iFW / lb.clipW * lb.clipH)|0;
		        }else if (theSelection.bDrag[3]) {//左下
		            iFX = theSelection.x;
		            iFY = theSelection.y;
		            iFH = iMouseY - theSelection.py - iFY;
		            iFW =  (iFH / lb.clipH * lb.clipW)|0;
		        }
		        
		        
				//フレームの範囲内であれば、選択範囲の変更を反映する
		        if (iFW > theSelection.csizeh * 2 && iFH > theSelection.csizeh * 2) {
		        	if((iFW + iFX  <= lb.canvasX ) && (iFH + iFY  <= lb.canvasY ) ){
			            theSelection.w = iFW;
			            theSelection.h = iFH;
			            theSelection.x = iFX;
			            theSelection.y = iFY;
			        }
		        }
			}else{
				//マルチタップの場合は
				//選択領域の位置はドラッグ開始の指との差で決める。
				
				//以前と極端に違う場合はタップミスとして無視する
				iFX = theSelection.x;
		        iFY = theSelection.y;
	            iFW = touch_distance;
	            iFH = (iFW / lb.clipW * lb.clipH)|0;
	            
		        if(touch_distance > 50){
		        	//最低50ピクセル以上
			        if((iFW + iFX  <= lb.canvasX ) && (iFH + iFY  <= lb.canvasY ) ){
			            //タップでの選択範囲の変更は、タップ位置関係なく反映する。
			            theSelection.w = iFW;
			            theSelection.h = iFH;
			            
			        }
			    }
			}

	        
	        if(reflesh){
  	    		lb.drawScene();
  	    	}
		}
		
		//ドラッグ開始
		function mousedown(e){
				var canvasOffset = $(panel).offset();
				var theSelection = lb.theSelection;

				if (e.targetTouches) {
					var touch = e.targetTouches[0];
			        iMouseX = Math.floor(touch.pageX - canvasOffset.left);
			        iMouseY = Math.floor(touch.pageY - canvasOffset.top);
				}else{
			        iMouseX = Math.floor(e.pageX - canvasOffset.left);
			        iMouseY = Math.floor(e.pageY - canvasOffset.top);
				}

		        theSelection.px = iMouseX - theSelection.x;
		        theSelection.py = iMouseY - theSelection.y;

		        if (theSelection.bHow[0]) {
		            theSelection.px = iMouseX - theSelection.x;
		            theSelection.py = iMouseY - theSelection.y;
		        }
		        if (theSelection.bHow[1]) {
		            theSelection.px = iMouseX - theSelection.x - theSelection.w;
		            theSelection.py = iMouseY - theSelection.y;
		        }
		        if (theSelection.bHow[2]) {
		            theSelection.px = iMouseX - theSelection.x - theSelection.w;
		            theSelection.py = iMouseY - theSelection.y - theSelection.h;
		        }
		        if (theSelection.bHow[3]) {
		            theSelection.px = iMouseX - theSelection.x;
		            theSelection.py = iMouseY - theSelection.y - theSelection.h;
		        }
		        

		        if (iMouseX > theSelection.x + theSelection.csizeh && iMouseX < theSelection.x+theSelection.w - theSelection.csizeh &&
		            iMouseY > theSelection.y + theSelection.csizeh && iMouseY < theSelection.y+theSelection.h - theSelection.csizeh) {

		            theSelection.bDragAll = true;
		        }else{
		        	theSelection.bDragOther = true;
		        	lb.panelDrag.x = iMouseX;
		        	lb.panelDrag.y = iMouseY;
		        }

		        for (i = 0; i < 4; i++) {
		            if (theSelection.bHow[i]) {
		                theSelection.bDrag[i] = true;
		            }
		        }
		}
		
		//ドラッグ終了
		function mouseup(e) {
			var theSelection = lb.theSelection;
	        theSelection.bDragAll = false;
	        theSelection.bDragOther = false;
	        for (i = 0; i < 4; i++) {
	            theSelection.bDrag[i] = false;
	        }
	        theSelection.px = 0;
	        theSelection.py = 0;
		}
		
		//領域外にマウスが移動（ドラッグ終了）
		function mouseout(e) {
			var theSelection = lb.theSelection;
			theSelection.bDragAll = false;
			theSelection.bDragOther = false;
			for (i = 0; i < 4; i++) {
			    theSelection.bDrag[i] = false;
			}
			theSelection.px = 0;
			theSelection.py = 0;
			lb.panelDrag.x=0;
			lb.panelDrag.y=0;
		}
		
		//範囲内のダブルクリックならトリミング。範囲外なら閉じる
		function doubleclick(e){
			var canvasOffset = $(panel).offset();
			var theSelection = lb.theSelection;

			if (e.targetTouches) {
				var touch = e.targetTouches[0];
		        iMouseX = Math.floor(touch.pageX - canvasOffset.left);
		        iMouseY = Math.floor(touch.pageY - canvasOffset.top);
			}else{
		        iMouseX = Math.floor(e.pageX - canvasOffset.left);
		        iMouseY = Math.floor(e.pageY - canvasOffset.top);
			}
	        if (iMouseX > theSelection.x + theSelection.csizeh && iMouseX < theSelection.x+theSelection.w - theSelection.csizeh &&
	            iMouseY > theSelection.y + theSelection.csizeh && iMouseY < theSelection.y+theSelection.h - theSelection.csizeh) {

	            trim_image(e);
	        }else{
	        	$.unblockUI();
	        }
		}
		
		//トリミングボタン押下のイベント
		function trim_image(e){
		    var temp_ctx;
		    var temp_canvas;
		    var outputtype;
		    
		    try{
			    
			    if(lb.trimming_target_id){
			    	var t = $("#"+lb.trimming_target_id);
			    	outputtype= t.prop("tagName");
			    	if(outputtype == "CANVAS"){
			    		//temp_canvas = t.get(0);
			    		temp_canvas = document.getElementById(lb.trimming_target_id);
						if(temp_canvas.getContext){
							temp_ctx = temp_canvas.getContext('2d');
							temp_canvas.width = lb.clipW;
					    	temp_canvas.height = lb.clipH;
						}else{
							return;
						}
			    		
			    	}else if(outputtype=="IMG"){
			    	    temp_canvas = document.createElement('canvas');
			    		temp_ctx = temp_canvas.getContext('2d');
					    temp_canvas.width = lb.clipW;
					    temp_canvas.height = lb.clipH;
			    	}else{
			    		return;
			    	}
			    }else{
			    	return;
			    }
			    
			    temp_ctx.drawImage(lb.image, lb.theSelection.x * lb.rPRate , lb.theSelection.y * lb.rPRate , lb.theSelection.w * lb.rPRate , lb.theSelection.h * lb.rPRate , 0, 0, lb.clipW, lb.clipH);
			    
			    if(outputtype=="IMG"){
				    var vData = temp_canvas.toDataURL('image/png');
				    $('#'+lb.trimming_target_id).attr('src', vData);
				}
			    
			    created=true;
		    
		    }finally{
		    	$.unblockUI({ fadeOut: 200 });
		    	//イベントの指定があれば実行。
		    	if(lb.onCutFinished){
		    		setTimeout(function(){
		    			lb.onCutFinished();
		    		},300);
		    	}
        	}
		    
		}
		
	}// end of draw_canvus_area
	
	Lb_Trim.prototype.draw_upload_area = function(upload_id,dd_msg) {
		$('#'+upload_id).append('<div class="lb_trim_upfile_wrap" >'+dd_msg+'<input id="lb_trim_upfile'+ this.rand_id +'" type="file"></div>');
		
		//イベント中の参照のコピー
		var lb = this;
		
		$("#lb_trim_upfile"+ this.rand_id).change(function() {
		    var canvas = $("#"+lb.canvas_id);
		    var ctx = canvas[0].getContext("2d");
		    // 選択されたファイルを取得
		    var file = this.files[0];
		    // 画像ファイル以外は処理中止
		    if (!file.type.match(/^image\/(png|jpeg|gif)$/)) return;
		    var reader = new FileReader();

		    // File APIを使用し、ローカルファイルを読み込む
			reader.onload = function(evt) {
				// 画像がloadされた後に、canvasに描画する
				lb.image.onload = function() {

		   	    	//パネルサイズとの比率が近い方にオートスケール
					if((lb.image.width  / lb.panelMaxW ) > (lb.image.height  / lb.panelMaxH )){
						//幅優先
						lb.canvasX = lb.panelMaxW;
						lb.pRate = lb.panelMaxW / lb.image.width;
						lb.rPRate = lb.image.width / lb.panelMaxW;
						lb.canvasY = (lb.image.height * lb.pRate) | 0;

						//クリップ領域より画像が小さかった場合、クリップ領域を画像領域の８割に縮小
						if(lb.image.width < lb.clipW ){
							var cw = lb.image.width * 0.8;
							var ch = lb.clipH * (cw / lb.clipW );
							lb.clipW = cw;
							lb.clipH = ch;
						}
					}else{
						//高さ優先
						lb.canvasY = lb.panelMaxH;
						lb.pRate = lb.panelMaxH / lb.image.height;
						lb.rPRate = lb.image.height / lb.panelMaxH;
						lb.canvasX = (lb.image.width * lb.pRate) | 0;
						
						//クリップ領域より画像が小さかった場合、クリップ領域を画像領域の８割に縮小
						if(lb.image.height  < lb.clipH ){
							var ch = lb.image.height * 0.8;
							var cw = lb.clipW * (ch / lb.clipH );
							lb.clipW = cw;
							lb.clipH = ch;
						}
					}
					
					//選択範囲の初期値
					var iFW, iFH,iFX,iFY;

					//パネルサイズとの比率が近い方にオートスケール
					//縦横、最大化してどちらが先に限界がくるか。
					if((lb.image.width  / lb.clipW ) < (lb.image.height  / lb.clipH )){
						//幅が先に限界がくる場合
						
						iFX = 0;
						iFW =  lb.canvasX;
						iFH = lb.clipH * (iFW / lb.clipW );
						iFY = (lb.canvasY - iFH)/2;

					}else{
						//縦が先に限界がくる場合
						iFY = 0;
						iFH = lb.canvasY;
						iFW = lb.clipW * (iFH / lb.clipH );
						iFX = (lb.canvasX - iFW)/2;
						
					}					
					
					
				    lb.loaded =true;
			        //スクロールを初期値にもどす
			        $("#"+lb.canvas_frame_id).scrollTop(0).scrollLeft(0);
			        
			        
			        //選択の初期化
			        lb.theSelection = lb.createSelection(lb.ctx,iFX, iFY, iFW, iFH);
			        
//			        lb.orgImage = lb.imgClone(lb.image);
			        $("#"+lb.canvas_frame_id).css("height",lb.canvasY +10);
//			        initBar();
			        lb.drawScene();			        
			        //トリミング画面をオーバーレイ表示
			        lb.openTrimWindow();
			        

					

			        if(lb.created ==false){
			        	$("#"+lb.trimming_target_id).click(function(){
			        		lb.openTrimWindow();
			        	});
			        }
				}
				// 画像のURLをソースに設定
				lb.image.src = evt.target.result;
//				lb.orgImage.src = evt.target.result;
		    }
		    // ファイルを読み込み、データをBase64でエンコードされたデータURLにして返す
		    
		    $.blockUI({ message:"loading."});
		    setTimeout(function(){
		    	if(lb.loaded==false){
		    		alert("読み込みに失敗しました。もう一度画像を指定してください。");
		    		$.unblockUI();
		    	};
		    },5000);
		    lb.setCanvusSize();


		    reader.readAsDataURL(file);
			lb.currentCanvasScale=1;

		});
	};//end of draw_upload_area
	
	Lb_Trim.prototype.drawScene = function() { // main drawScene function
	    if(false == this.loaded) return;
	    
	    this.ctx.canvas.width=(this.canvasX * this.currentCanvasScale)|0;
	    this.ctx.canvas.height=(this.canvasY * this.currentCanvasScale)|0;
	    // 元画像を描画
	    this.ctx.drawImage(this.image, 0, 0,this.image.width,this.image.height,0,0,(this.canvasX * this.currentCanvasScale)|0,(this.canvasY * this.currentCanvasScale)|0);


		//領域外以外マスク
	    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	    this.ctx.fillRect(0, 0,this.ctx.canvas.width, this.ctx.canvas.height);

	    //選択領域を描画
	    this.theSelection.draw();
	} // end of drawScene
	
	Lb_Trim.prototype.imgClone = function (org){
	    var dist_canvas,dist_ctx;
	    dist_canvas = document.createElement('canvas');
	    dist_ctx = dist_canvas.getContext('2d');
	    dist_canvas.width = org.width;
	    dist_canvas.height = org.height;
	    dist_ctx.drawImage(org, 0,0);
	    var vData = dist_canvas.toDataURL('image/png');
	    var retImage=new Image();
	    retImage.src = vData;
		dist_canvas=null;
		dist_ctx=null; 
		vData=null;
	    return retImage;
	}	// end of imgClone
	
	
	Lb_Trim.prototype.openTrimWindow = function (){
		
		var wrap = $("#"+this.canvas_wrap_id);
		
        var ui_left = (window.innerWidth-wrap.width()) /2;
        if(ui_left < 10){
        	ui_left = 10;
        }
        
    	var ui_width = this.panelMaxW;
    	if(ui_width > this.canvasX){
    		ui_width = this.canvasX;
    	}
    	

    	var ui_top = (window.innerHeight-wrap.height()) /2;
        if(ui_top < 30){
        	ui_top = 30;
        }
		
        $.blockUI({ message: wrap
        			,css:{
        				width:ui_width
        				,left:ui_left
        				,top:ui_top
        			}
    			});
	}	// end of openTrim
	
	Lb_Trim.prototype.maximizeSelection = function (){
		var lb = this;
		var theSelection = lb.theSelection;
		var canvas = $("#"+this.canvas_id);
		

		//パネルサイズとの比率が近い方にオートスケール
		//縦横、最大化してどちらが先に限界がくるか。
		if((lb.image.width  / lb.clipW ) < (lb.image.height  / lb.clipH )){
			//幅が先に限界がくる場合
			
			theSelection.x = 0;
			theSelection.w =  canvas.width();
			theSelection.h = lb.clipH * (theSelection.w / lb.clipW );
			theSelection.y = (lb.panelMaxH - theSelection.h)/2;
			
			
		}else{
			//縦が先に限界がくる場合
			theSelection.y = 0;
			theSelection.h = canvas.height();
			theSelection.w = lb.clipW * (theSelection.h / lb.clipH );
			theSelection.x = (lb.panelMaxW - theSelection.w)/2;
			
		}
		lb.drawScene();
	}	// maximizeSelection
	

	
	function mousepos(mouseX,mouseY,rect1x,rect1y,rect2x,rect2y,rect3x,rect3y,rect4x,rect4y){
		var str ="mouse:" + mouseX + "," + mouseY;
		 str +="<br/>rect1:" + rect1x + "," + rect1y;
		 str +="<br/>rect2:" + rect2x + "," + rect2y;
		 str +="<br/>rect3:" + rect3x + "," + rect3y;
		 str +="<br/>rect4:" + rect4x + "," + rect4y;
		 $("#mousepos").html(str);
	}	// end of mousepos
	
	
}());