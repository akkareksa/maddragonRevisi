let main = new Phaser.Scene('Main');
// https://labs.phaser.io/edit.html?src=src\games\topdownShooter\topdown_averageFocus.js
//goalnya summon monster.
main.preload = function(){
	this.load.setBaseURL('assets/')
	this.load.image('ground', 'land.png');
	this.load.atlas('rocketer','rocketer.png','rocketer.json');
	this.load.atlas('dragon','dragon.png','dragon.json');
	this.load.atlas('minion','minion.png','minion.json');
	this.load.atlas('explosion','explosion.png','explosion.json');
	this.load.image('apple', 'apple.png');
	this.load.image('ufo', 'ufo.png');
	this.load.audio('jumpSound','jump.wav');
	this.load.audio('laser','laser.wav');
	this.load.audio('hup','hup.wav');
	this.load.audio('rocket_sound','rocket_sound.wav');
	this.load.image('rocket_bullet','bullet3s.png');
	this.load.image('dragon_shoot','dragon_shoot.png');
	this.load.image('playagain','playagain.png');
	this.load.image('menu','menu.png');
	this.load.image('awan1','awan1.png');
	this.load.image('awan2','awan2.png');
}

var score;
var scoreText;
var life;
var lifeText;
var gameManager;
var height;
var width;
var scoreText;
var gameOver;
var dragon;
var dragonY;
var pressed;
var tembakanMusuh;  
var tembakan;
var velocity;
var enemies; //diubah, masukkan ke di group enemies
var rocket_sound;
var laser;
var health;
var hup;
var obstacles;

main.create = function(){
	window.focus();
	click=false;
	this.life=3;
	gameOver=false;
	height = config.height;
	width = config.width;
	pressed = false;
	dragon = this.physics.add.sprite(150,height-200,'dragon','frame-1.png').setScale(0.25);
	// dragon.body.setSize(dragon.body.width,100,true);
	console.log(dragon.body.height);
	gameManager= this;
	dragonY=dragon.y;
	jumpSound=this.sound.add('jumpSound');
	rocket_sound = this.sound.add('rocket_sound');
	laser = this.sound.add('laser');
	hup = this.sound.add('hup');
	this.tembakan = this.add.group();
	this.enemies = this.add.group(); 
	this.tembakanMusuh=this.add.group();
	this.health = this.add.group();
	this.obstacles = this.add.group();
	this.input.on('pointerup', function () {
		dragonShoot();
	}, this);

	this.obstacles = this.add.group();
	this.bullet = this.add.group();
	this.lifeX = 16;
	this.score=0;
	this.scoreText = this.add.text(16,16,'score: 0', { font: "50px Arial", fill: "#ffffff" });  
	this.lifeText = this.add.text(16,70,'life: 3', { font: "50px Arial", fill: "#ffffff" });  
	// this.obstacles = this.add.group();

	cursors = this.input.keyboard.createCursorKeys();
	this.anims.create(
	{key:'explode',
		frames: this.anims.generateFrameNames('explosion',{start:56, end:63, zeroPad:1, prefix:'explode',suffix:'.png'}),
		repeat:0,
		frameRate:10
	});
	this.anims.create(
		{key:'move',
		frames: this.anims.generateFrameNames('dragon',{start:1, end:4, zeroPad:0, prefix:'frame-',suffix:'.png'}),
		repeat:-1,
		frameRate:10
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

	this.timer = this.time.addEvent({
			delay: 3000,	
			callback: ()=>{
				if(!gameOver){
					generateEnemy();
				}
			},
			callbackScope: this,
			loop: true
	});
	dragon.setCollideWorldBounds(true);
	dragon.play('move');
	game.canvas.addEventListener('mousedown', function () {
		game.input.mouse.requestPointerLock();
	});
	this.input.on('pointermove', function (pointer) {
	if(this.input.mouse.locked)
		{
			if(!gameOver){
				dragon.y += pointer.movementY;	
			}
			
		}
	}, this);
	this.physics.add.overlap(this.tembakan, this.enemies, destoryEnemy, null, this);
	this.physics.add.overlap(this.tembakanMusuh, dragon, damageDragon);
	this.physics.add.overlap(this.enemies, dragon, damageDragon);
	this.physics.add.overlap(this.health, dragon, increaseHealth);
}

main.update = function(){
	if(gameOver){
		let gameOverText = this.add.text(game.config.width / 2-100, game.config.height / 2, 'GAME OVER \n SCORE: '+this.score, { fontSize: '32px', fill: '#fff' });
		gameOverText.setDepth(1);
		gameManager.physics.pause();
		// dragon.
		var btn = this.add.image(config.width/2,config.height-200,'playagain');
		btn.setInteractive();
		btn.on('pointerup',
		function(){
			// dragon.disableBody(true, true);
			gameManager.scene.resume('Main');
			gameManager.scene.restart();
			});
		var btnMenu = this.add.image(config.width/2,config.height-100,'menu');
		btnMenu.setInteractive();
		btnMenu.on('pointerup',
		function(){
			gameManager.scene.switch('Menu');
			});
	}
	gameManager.enemies.children.iterate(child => {
		if (child && child.x <=80) {
			child.status=0;
			child.destroy(child, true);
			// console.log('musuh hancur');
		}
	});
	gameManager.tembakan.children.iterate(child => {
		if (child && child.x >=width) {
			child.status=0;
			child.destroy(child, true)
			// console.log('tembakan dragon hancur');
		}
	});
	gameManager.tembakanMusuh.children.iterate(child => {
		if (child && child.x <=0) {
			child.status=0;
			child.destroy(child, true);
			// console.log('tembakan musuh hancur');
		}
	});
	gameManager.health.children.iterate(child => {
		if (child && child.x <=0) {
			child.status=0;
			child.destroy(child, true);
			// console.log('tembakan musuh hancur');
		}
	});
	gameManager.obstacles.children.iterate(child => {
		if (child && child.x <=0) {
			child.status=0;
			child.destroy(child, true);
			// console.log('tembakan musuh hancur');
		}
	});
	this.scoreText.setText('Score: '+this.score);
	this.lifeText.setText('life: '+this.life);
}

function randomMoveY(obj,xMovement){
	var randomizer = Math.random();
	obj.setCollideWorldBounds(true);
	if(xMovement==1){
		if(randomizer<0.5){
			if(obj.y<width-150){
				obj.setVelocity(-100,100);
			}
			else{
				obj.setVelocity(-100,-100);
			}
		}
		else{
			if(obj.y<width-150){
				obj.setVelocity(-100,-100);
			}
			else{
				obj.setVelocity(-100,100);
			}
		}
	}
	else{
		// console.log('randomizer: '+randomizer);
		if(randomizer<0.5){
			if(obj.y<width-300){
				obj.setVelocity(0,100);
			}
			else{
				obj.setVelocity(0,-100);
			}
		}
		else{
			if(obj.y<width-300){
				obj.setVelocity(0,-100);
			}
			else{
				obj.setVelocity(0,100);
			}
		}	
	}
	
}

function generateEnemy(){
	// terdapat 3 jenis musuh, tiap jenis musuh punya 2 gerakan yang berbeda
	//jenis musuh 1, tangan robot, bisa nembak peloro, harus dihindari, tabrakan peluru harus saling acunurin peloro player-npc, musuh tak gerak
	//jenis musuh 2, kelelawar, jalan biasa, tapi bisa bikin bayangan palsu #cm bikin panik player doang, bayngan gbs dikill, gerak ke player, kelelawar mati, bayangan bisa aja gerak
	//jenis musuh 3,random misil
	//boss ngespawn musuh1/musuh2 , peloro jg dikeluarin beberapa kali 
	//jenis musuh kroco, musuh terbang seperti kelelawar, ke player , tidak ada spesial

	var random = Math.random();
	// console.log(random);

	if(gameManager.enemies.getLength()<4){
		if(random<0.30){
			generateRocketer();	
		}
		else if(random<0.75){
			generateMinion();
			
		}
		else if(random<0.9){
			generateRocketer();
			generateMinion();
		}
		else{
			generateHomming();
			if(random>0.95){
				generateHealth();
			}
		}
	}
	// if(gameManager.obstacles.getLength()<2){
	// 	generateObstacle();
	// }

}

function generateObstacle(){
	var random = Math.random();
	var y = 50+Math.floor(Math.random()*(height-100));
	var awan;
	if(random<0.5){
		awan = gameManager.physics.add.image(width-100,y,'awan1').setScale(0.25);
	}
	else{
		awan = gameManager.physics.add.image(width-100,y,'awan2').setScale(0.25);
	}
	awan.setVelocity(-25,0);
	gameManager.obstacles.add(awan);

	
}

function generateMinion(){
	var y = 50+Math.floor(Math.random()*(height-100));
	var enemy = gameManager.physics.add.sprite(width-100,y,'minion','bat_1.png').setScale(0.25);
	enemy.setVelocity(-100,0);
	enemy.play('fly');
	gameManager.enemies.add(enemy);
	enemy.status = true;
	enemy.moveTimer = gameManager.time.addEvent({
		delay: 555,
		callback: ()=>{
			if(!gameOver && enemy.status!=0){
				randomMoveY(enemy,1);
			}
		},
		callbackScope: gameManager,
		loop: true
	});
}

function generateHealth(){
	var y = 300+Math.floor(Math.random()*100);
	var apple = gameManager.physics.add.image(width-111,y,'apple').setScale(0.1);
	apple.setVelocity(-150,0);
	gameManager.health.add(apple);
}

function generateHomming(){
	laser.play();
	var x1 = -100 + Math.floor(Math.random()*100);
	// var x2 = -200 + Math.floor(Math.random()*100);
	var x3 = -400 + Math.floor(Math.random()*300);

	var y1 = 50+Math.floor(Math.random()*100);
	var y2 = 300+Math.floor(Math.random()*100);
	var y3 = 400+Math.floor(Math.random()*100);
	var homming1 = gameManager.physics.add.sprite(width-x1,y1,'rocketer','frame-1.png').setScale(0.1);
	// var homming2 = gameManager.physics.add.sprite(width-x2,y3,'rocketer','frame-1.png').setScale(0.1);
	var homming3 = gameManager.physics.add.sprite(width-x3,y2,'rocketer','frame-1.png').setScale(0.1);

	gameManager.tembakanMusuh.add(homming1);
	// gameManager.tembakanMusuh.add(homming2);
	gameManager.tembakanMusuh.add(homming3);

	homming1.play('stand');
	// homming2.play('stand');
	homming3.play('stand');

	homming1.setVelocity(-1000,0);
	// homming2.setVelocity(-1000,0);
	homming3.setVelocity(-1000,0);
}

function generateRocketer(){
	var y = 50+Math.floor(Math.random()*(height-100));
	var enemy = gameManager.physics.add.sprite(width-100,y,'rocketer','frame-1.png').setScale(0.25);
	// enemy.setActive();
	enemy.play('stand');
	gameManager.enemies.add(enemy);
	enemy.status = true;
	//setiap beberapa detik dia tembak roket
	var random = Math.floor(Math.random()*100);
	enemy.timer = gameManager.time.addEvent({
		delay: 1500+random,
		callback: ()=>{
			if(!gameOver && enemy.status!=0){
				rocketShoot(enemy);
			}
		},
		callbackScope: gameManager,
		loop: true
	});
	enemy.moveTimer = gameManager.time.addEvent({
		delay: 555,
		callback: ()=>{
			if(!gameOver && enemy.status!=0){
				randomMoveY(enemy,0);
				// console.log('stat: '+enemy.status);
			}
		},
		callbackScope: gameManager,
		loop: true
	});

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

function dragonShoot(){
	if(!gameOver){
		var shoot = gameManager.physics.add.image(dragon.x+200, dragon.y-21, 'dragon_shoot').setScale(0.5);
		shoot.setVelocity(600, 0);
		gameManager.tembakan.add(shoot);
		//console.log('dor');
		jumpSound.play();
	}
}

function damageDragon(enemies,dragon){
	gameManager.life--;
	console.log(gameManager.life);
	console.log(gameManager.gameOver);
	console.log('score: '+this.score);
	enemies.status=0;
	enemies.destroy();
	var explosion = gameManager.physics.add.sprite(enemies.x,enemies.y,'explosion','explosion1.png').setScale(1);
	explosion.play('explode');
	explosion.on('animationcomplete', ()=>{
		explosion.destroy();
	});
	if(gameManager.life<=0){
		gameOver=true;
	}
}

function increaseHealth(health,dragon){
	hup.play();
	if(gameManager.life<3){
		gameManager.life++;
	}
	health.destroy();
}

function destoryEnemy(tembakan, enemies)
{
	this.score++;
	var explosion = gameManager.physics.add.sprite(enemies.x,enemies.y,'explosion','explosion1.png').setScale(1);
	explosion.play('explode');
	explosion.on('animationcomplete', ()=>{
		explosion.destroy();
	});
	enemies.disableBody(true, true);
	tembakan.disableBody(true,true);
	enemies.status=0;
	enemies.destroy();
	tembakan.destroy();
	enemies.status=false;
	iterateTree();

}

//saat start, gmna play tanpa harus klik
//spawn dragon gmna?
//https://phaser.discourse.group/t/issue-removing-sprite-from-group/1064 
//textuploader.com/1585z ->timming
//textuploader.com//15857
//gimana cara saat nembak kena posisi asli bayangannya mati
//array of array buat bikin bayangan

var tree=[];

function addToTree(array){
	tree.push(array);
	// console.log("tree: "+array);
}

function iterateTree(){
	var needToRemove = [];
	for(var i=0;i<tree.length;i++){
		//for(var j=0;j<tree[i].length;j++){
		var element = tree[i][0];
		if(mustDestroy(element)){
			needToRemove.push(i);
		}
		//}
	}
	
	for(var i=0;i<needToRemove.length;i++){
		console.log(tree[needToRemove[i]]);
		removeNodeTree(tree[needToRemove[i]]);
	}
}

function mustDestroy(tembakan,enemies){
	console.log("true");
	return true;
}


function removeNodeTree(array,idx){
	tree.splice(idx,1);
}

//ubah dari bayangan jadi bomb
//kurang bagaimana gerakan si musuh (tiap tipe musuh beda2)