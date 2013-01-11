enchant();

window.onload = function(){

  var game = new Game(320,240);
  game.fps = 30;
  game.preload("image/sky.png","image/sky2.png","image/skate.png","image/monster3.gif","image/icon0.png","image/effect0.png","image/ground.png",
                "image/bench.png","image/skate_back.png");
  //スペースキーをAボタンに登録
  game.keybind(32,"a");
  //得点
  game.score = 0;
  //敵の動きの向きフラグ
  var hidari = true;
  //暗転時にBGMをきりたいんです＞＜
  var onBGM = true;

  game.onload = function(){

    //タイムアタックを初期化
    //timeAttack = new TimeAttack();

    //マップ
    var map1 = new Sprite(640,240);
    map1.image = game.assets["image/sky2.png"];
    map1.x = 0;
    game.rootScene.addChild(map1);
    //マップ2つ目
    var map2 = new Sprite(640,240);
    map2.image = game.assets["image/sky.png"];
    map2.x = 640;
    game.rootScene.addChild(map2);
    
    //地面
    var ground = new Sprite(320,30);
    ground.image = game.assets["image/ground.png"];    
    ground.x = 0;
    ground.y = game.height-30;
    game.rootScene.addChild(ground);
    
    //クマ
    var bear = new Sprite(32,32);
    bear.image = game.assets["image/skate.png"];
    bear.x = 0;
    bear.y = game.height-32;
    //クマのジャンプの状態
    bear.status = false;
    //ジャンプ地点
    bear.point_y = 0;
    //前の高さ
    bear.prev_y = 0;
    //今の高さ
    bear.temp_y = 0;
    //ジャンプの勢い
    bear.F = 10;
    //落ちるかどうか
    bear.fall = false;
    //ジャンプするメソッド
    bear.jump = function(){
      bear.status = true;
    }
    //ジャンプ中のメソッド
    bear.jumping = function(){
      bear.temp_y = bear.y;
      bear.y -= bear.prev_y-bear.temp_y+bear.F;
      bear.prev_y = bear.temp_y;
      bear.F = -1;
    }
    game.rootScene.addChild(bear);

    //コウモリ
    var monster = new Sprite(48,48);
    monster.image = game.assets["image/monster3.gif"];
    monster.x = Math.floor(Math.random()*(320-48));
    monster.y = 0;
    monster.frame = [2,3,4,3];
    game.rootScene.addChild(monster);

    //爆弾
    var bom = new Sprite(16,16);
    bom.image = game.assets["image/icon0.png"];
    bom.x = monster.x - 2;
    bom.y = monster.y + 48;
    bom.frame = 25;
    game.rootScene.addChild(bom);

    //爆発
    var bomb = new Sprite(16,16);
    bomb.image = game.assets["image/effect0.png"];
    bomb.frame = [0,1,2,3,4];
    
    //星
	/*
    var starGroup = new Group;
    for(var i = 0;i < 10;i++){
      var star = new Sprite(16,16);
      star.image = game.assets["image/icon0.png"];
      star.frame = 30;
      star.x = Math.floor(Math.random()*(640));
      star.y = game.height-40 + parseInt(Math.random()*30);
      //star.y = 0;
      star.appear = 0;
      starGroup.addChild(star);
    }
    game.rootScene.addChild(starGroup);
    */
	//星単体
	var star = new Sprite(16,16);
	star.image = game.assets["image/icon0.png"];
	star.frame = 30;
    //星のグループ
    var stars = new Array();	
    //ベンチ
    var bench = new Sprite(150,50);
    bench.image = game.assets["image/bench.png"];
    bench.x = game.width*2;
    bench.y = game.height-70;
    bench.temp_x = 0;
    bench.status = false;
    game.rootScene.addChild(bench);
    //ベンチの上
    var bench_top = new Sprite(150,20);
    bench_top.x = game.width*2;
    bench_top.y = game.height-70;
    bench_top.status = false;
    game.rootScene.addChild(bench_top);

     // サウンドを読み込み
    var BGM1 = Sound.load("sound/shell_the_enemy.mp3");
    var BGM2 = Sound.load("sound/rakuennotobira.mp3");
    /*
    //ゲームオーバーシーンの作成
    var gameOverScene = new Scene();
    gameOverScene.backgroundColor = 'black';
    */

    /*ゲームパッド
     *Aパッドが傾きとかとるから
     *移動をAパッドにしたほうがいいかもね
     */
    var pad = new Pad();
    pad.x = 0; 
    pad.y = game.height-100;
    game.rootScene.addChild(pad);
   
    /*
     *Aパッド
     *傾きとかとれるらしい
     */
    //var apad = new APad();

    //クマのフレームイベント
    bear.addEventListener(Event.ENTER_FRAME, function(){
      if(this.x>0){
        this.x -=1;
      }
      //右キー
      if(game.input.right && (this.x < game.width-32)){
        if(bear.status == false){
          this.x+=3;
        }else{
          bear.image = game.assets["image/skate.png"];
          this.x+=2;
        }
        /* 
        if(this.x>game.width-32){
          this.x = game.width-32;
        }
        */
      }

      //左キー
      if(game.input.left && (bear.x>0) && bear.status==true){
        bear.image = game.assets["image/skate_back.png"];
      }

      //スペースキー
      if(game.input.a&&bear.status==false){
        this.point_y = this.y;
        this.temp_y = this.point_y;
        this.prev_y = this.temp_y;
        this.jump();
      }

      //上キー
      if(game.input.up && (bear.y>game.height-55) && this.status==false){
        this.y-=2;
      }
        
      //下キー
      if(game.input.down && (bear.y<game.height-32 && this.status==false)){
        this.y+=2;
      }
      
      //monster.frame = monster.age % 3 + 3

      //ジャンプ中の判定
      if(this.status == true){
        this.jumping();
        
        if(this.y == this.point_y){ 
          this.F = 10; 
          this.status = false;
        }
      }
        
      //ベンチとの衝突判定
      if(this.intersect(bench_top)){
        //クマがベンチより上にいてジャンプ中のとき
        if(this.y<bench_top.y && this.status===true){
          this.y = bench_top.y - this.height;
          this.point_y = bench.y;
          this.F = 10; 
          this.status = false;
          //bench_top.status = true;
          //クマがベンチより上にいてジャンプしてないとき
        }else if(this.y<bench_top.y && this.status===false){
          //this.point_y = bench.y;
          //this.F = 10; 
          //this.status = false;
          //クマがベンチより上にいてジャンプしてないときかつベンチの左側にいるとき
        }else if(this.y<bench.y+bench.height && this.x<bench.x && this.status===false){
          this.x = bench_top.x - this.width;
        }
      }else{
        //ベンチの上から降りた場合
        if(bench_top.status && this.status){
          this.fall=true;
          //bench_top.status = false;
        }
      }

      //ベンチの上をすべっているor近づいたとき
      if(this.x<bench.temp_x && this.x>bench.x-250 || bench_top.status){
        this.x+=2;
      }

      //自然落下
      if(this.fall){
        this.y+=1;
      }

      //フレームの右端から向こうには行かせない
      if(this.x>game.width-32){
        this.x = game.width-32;
      }

      //フレーム外に行くとゲームオーバー
      if(this.x+32<0 || this.y>game.height || this.y+32<0 || this.x>game.width){
        finishGame();
      }
    });

    //コウモリのフレームイベント
    monster.addEventListener(Event.ENTER_FRAME, function(){
      if(this.x > 272 && hidari != true){
        hidari = true;
      }else if(this.x < 0 && hidari){
        hidari = false;
      }

      if(hidari){
        this.x -= 2;
      }else{
        this.x +=2;
      }

    });

    //爆弾のフレームイベント
    bom.addEventListener(Event.ENTER_FRAME, function(){
      this.y += 2;
      if(this.y == 214){
        bomb.x = bom.x;
        bomb.y = bom.y;
        game.rootScene.addChild(bomb);
        this.x = monster.x - 2;
        this.y = monster.y + 48;
      }
    });
    
    //／^o^＼＜ﾌｯｼﾞｻｰﾝ
    bomb.addEventListener(Event.ENTER_FRAME, function(){
      if(this.frame == 4){
        game.rootScene.removeChild(bomb)
      }

      if(bear.intersect(bomb)){
        finishGame();
      }
    });

    //星のフレームイベント
	/*
    starGroup.addEventListener(Event.ENTER_FRAME,function(){
      this.x -=2;
      if(star.intersect(bear)){
        game.score += 10;
      }
    });
    */
    //ベンチのフレームイベント
    bench.addEventListener(Event.ENTER_FRAME,function(){
      bench.x -= 2;
      //bench.temp_x = bench.x+bench.width;
      bench.temp_x = bench.x+150;
    });

    bench_top.addEventListener(Event.ENTER_FRAME,function(){
      bench_top.x -= 2;
    });
    

    //マップのフレームイベント
    map1.addEventListener(Event.ENTER_FRAME, function(){
      map1.x -= 2;
      if(map1.x<-639){
        map1.x = 640;
      }
      if(onBGM){
        BGM1.play();
      }
    });
    
    map2.addEventListener(Event.ENTER_FRAME, function(){
      map2.x -=2;
      if(map2.x<-639){
        map2.x = 640;
      }
      if(onBGM){
        BGM1.play();
      }
    });
	
	//ゲーム全体のフレームに関して
	game.addEventListener(Event.ENTER_FRAME, function(){
	  if(this.frame % 30 == 0){
	    star.x = Math.floor(Math.random()*(640));
        star.y = game.height-40 + parseInt(Math.random()*30);
	    game.rootScene.addChild(star);
	    stars.push(star);
		star.addEventListener(Event.ENTER_FRAME, function(){
		  star.x -= 0.1;
		});
	  }
	  
	});

    //ゲーム終了のおしらせ
    var finishGame = function(){
      BGM1.stop();
      onBGM = false;
      BGM2.play();
      game.end(game.score,"woeeee");
    }

    //game.onload
  };


  /*まだ実装できてましぇん。
  //時間経過を表示するクラス。shi3z氏のを借用。
  TimeAttack =enchant.Class.create({
    initialize:function(){
        //時間ラベル設定
        this.timeLabel = new Label("TIME:180.00");
        game.rootScene.addChild(this.timeLabel);
        this.timeLabel.x = 10;
        this.timeLabel.color="#ffffff";
        this.timeLabel.font="bold";
        this.timeLabel.y =10;
        this.timeStart=new Date;//初期時間を設定
        this.timeInit=false;
        this.timerID =window.setInterval(this.interval, 320 ,this);
    },
    interval:function(obj){
            if(gameStart){
                if(!obj.timeInit){
                    obj.timeStart=new Date;//初期時間を設定
                    obj.timeInit=true;
                }
                var timeLeft =((new Date)-obj.timeStart)/1000;
                obj.timeLabel.text="TIME:"+obj.get2string(180-timeLeft);;
            }
    },
    get2string:function (x){ //小数点以下2桁までで表示をカット
        n = new String(x);
        if(n.indexOf(".")&gt;0)
            n = n.split(".")[0]+"."+(n.split(".")[1]+"00").substring(0,2);
        else
            n = n+".00";
        
        return n;
    },
    gameend:function(x){ //ゲーム終了
        window.clearInterval(this.timerID);
        var timeLeft =((new Date)-this.timeStart)/1000;
        this.timeLabel.text="TIME:"+this.get2string(180-timeLeft);
        var indi =180 - timeLeft;
        if(indi&lt;0)indi=0;
        var ResultLabel =new Label("タイム:"+this.get2string(timeLeft)+x);
        ResultLabel.x=80;
        ResultLabel.y=220;
        ResultLabel.color="#ffffff";
        ResultLabel.font="bold";
        game.rootScene.addChild(ResultLabel);
        game.end(indi, "タイム:"+this.get2string(timeLeft)+x); //nineleap.enchant.jsを呼び出し
    }
  });
  */

  game.start();
};


