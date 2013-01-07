enchant();

window.onload = function(){
  var game = new Game(320,240);
  game.fps = 30;
  game.preload("image/sky.png","image/sky2.png","image/skate.png","image/monster3.gif","image/icon0.png","image/effect0.png","image/ground.png",
                "image/bench.png","image/skate_back.png");
  //スペースキーをAボタンに登録
  game.keybind(32,"a");  

  
  var hidari = true;

  game.onload = function(){
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
    var star = new Sprite(16,16);
    star.image = game.assets["image/icon0.png"];
    star.frame = 30;
    star.x = game.width;
    star.y = game.height-40 + parseInt(Math.random()*30);
    //star.y = 0;
    star.appear = 0;
    
    game.rootScene.addChild(star);


    //ベンチ
    var bench = new Sprite(150,50);
    bench.image = game.assets["image/bench.png"];
    bench.x = game.width*2;
    bench.y = game.height-70;
    bench.status = false;
    
    game.rootScene.addChild(bench);

    var bench_top = new Sprite(150,20);
    bench_top.x = game.width*2;
    bench_top.y = game.height-70;
    game.rootScene.addChild(bench_top);

     // サウンドを読み込み
    var BGM1 = Sound.load("sound/shell_the_enemy.mp3");
    
    //クマのフレームイベント
    bear.addEventListener(Event.ENTER_FRAME, function(){
      if(this.x>0&&bear.status==false){
        this.x -=2;
      }
      //右キー
      if(game.input.right&&(this.x<game.width-32)){
        if(bear.status==true){
        bear.image = game.assets["image/skate.png"];
        }
        if(bear.status==false){
          this.x+=5;
        }else{
          this.x+=2;
        } 
        if(this.x>game.width-32){
	  this.x = game.width-32;
        }
      }

      //左キー
      if(game.input.left&&(bear.x>0)&&bear.status==true){
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
      if(game.input.up&&(bear.y>game.height-55)&&this.status==false){this.y-=2;}
      //下キー
      if(game.input.down&&(bear.y<game.height-32&&this.status==false)){this.y+=2;}
      
      //monster.frame = monster.age % 3 + 3

      //ジャンプ中の判定
      if(this.status==true){
        this.jumping();
        if(bench.status==false){
          if(this.y==this.point_y){ 
            this.F = 10; 
            this.status =false;
          }
        }else{
          if(this.y==bench.y){
            this.F = 10;
            this.status = false;
          }
        }     
      }
      //ベンチとの衝突判定
      if(bear.intersect(bench_top)){
        bench.status = true;
        if(bear.y<bench_top.y){
          bear.y = bench_top.y-bear.height;
        }else{
          bear.x = bench_top.x-bear.width;   
        }
      }else{
        bench.status = false;
        //bear.y = game.height-40;
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
	this.y = monster.y+48;
		
      }
    });
	/*
	bomb.addEventListener(Event.ENTER_FRAME, function(){
		if(this.frame == 4){
			this.rootScene.removeChild(sprite)
		}
	});*/

    //星のフレームイベント
    star.addEventListener(Event.ENTER_FRAME,function(){
      this.x -=2;
      /*
       *ランダムで星を出現させるようにしたい。
      this.appear = parseInt(Math.random()*10);
      
      for(i=0;i<this.appear;++i){
        //this.y = game.height-40 + parseInt(Math.random()*30);
        game.rootScene.addChild(star);  
        //this.appear = 100;         
      }
      */
    });

    //ベンチのフレームイベント
    bench.addEventListener(Event.ENTER_FRAME,function(){
      bench.x -= 2;
    });

    bench_top.addEventListener(Event.ENTER_FRAME,function(){
      bench_top.x -= 2;
    });
    

    //マップのフレームイベント
    map1.addEventListener(Event.ENTER_FRAME, function(){
      map1.x -= 2;
      if(map1.x<-639){map1.x = 640;} 
      BGM1.play();
    });
    
    map2.addEventListener(Event.ENTER_FRAME, function(){
      map2.x -=2;
      if(map2.x<-639){map2.x = 640;} 
      BGM1.play();
    });

      
  };
  game.start();
  
};
