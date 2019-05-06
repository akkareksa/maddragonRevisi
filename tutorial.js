let tutorial = new Phaser.Scene('Tutorial');

tutorial.preload = function(){
	this.load.setBaseURL('assets/');
	this.load.image('back','back.png');
	this.load.atlas('rocketer','rocketer.png','rocketer.json');
	this.load.atlas('dragon','dragon.png','dragon.json');
	this.load.atlas('minion','minion.png','minion.json');
	this.load.audio('jumpSound','jump.wav');
	this.load.audio('laser','laser.wav');
	this.load.image('rocket_bullet','bullet3.png');
	this.load.image('dragon_shoot','dragon_shoot.png');
	this.load.image('expression','expression.png');

}
var demo;
var manager;

tutorial.create = function(){
	var kiri=50;
	console.log(kiri);
	this.demo = this.add.group();
	var kanan=config.width-300;
	// var tunjuk = this.add.image(config.width/2, config.height/2, 'creditPage').setScale(1);
	var btn = this.add.image(config.width/2,config.height/2+250,'back');
	// var dragon = this.physics.add.sprite(kiri,height-400,'dragon','frame-1.png').setScale(0.25);
	var text1 =  this.add.text(kiri,50," !!! Click to make dragon sneeze (when you play not here)!!! \n You have 3 health, so dont die okay?", { font: "40px Arial", fill: "#ff0000" }); 
	var minion = this.physics.add.sprite(kanan,150,'minion','bat_1.png').setScale(0.25);
	var text1 =  this.add.text(kiri,150,"Just weakling... random movement,same speed meh..", { font: "25px Arial", fill: "#000000" }); 
	var rocketer = this.physics.add.sprite(kanan,300,'rocketer','frame-1.png').setScale(0.2);
	var text2 =  this.add.text(kiri,300,"Like peashooter, the shot can't be blocked", { font: "25px Arial", fill: "#000000" });  
	var random = this.physics.add.image(kanan,450,'expression').setScale(0.2);
	var text3 =  this.add.text(kiri,450,"Guess what", { font: "25px Arial", fill: "#000000" });  


	// this.demo.add();

	btn.setInteractive();
	btn.on('pointerup',
		function(){
			this.scene.scene.start('Menu');
		});
	this.anims.create(
		{key:'stand',
		frames: this.anims.generateFrameNames('rocketer',{start:1, end:6, zeroPad:0, prefix:'frame',suffix:'.png'}),
		repeat:-1,
		frameRate:10
	});
	this.anims.create(
		{key:'fly',
		frames: this.anims.generateFrameNames('minion',{start:1, end:2, zeroPad:0, prefix:'bat_',suffix:'.png'}),
		repeat:-1,
		frameRate:10
	});
	rocketer.play('stand');
	minion.play('fly');
}

function rocketShoot(obj){
	if(obj.status==true){
		var apple = gameManager.physics.add.image(obj.x-75, obj.y, 'rocket_bullet').setScale(0.2);
		apple.setVelocity(-300, 0);
		gameManager.tembakanMusuh.add(apple);
		//console.log('dor');
		rocket_sound.play();
		//if apple out of bound 
	}
	else{
		//destroy timer;
		obj.timer.destroy();
	}
	
}