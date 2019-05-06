let menu = new Phaser.Scene('Menu');

menu.preload = function(){
	this.load.setBaseURL('assets/');
	this.load.image('start_btn','play.png');
	this.load.image('help','help.png');
	this.load.image('credit','credit.png');
	this.load.image('howto','howtoplay.png');
}

menu.create = function(){
	var tunjuk = this.add.image(config.width/2, 250, 'help');
	var btn = this.add.image(config.width/2,config.height/2+250,'start_btn');
	var howto = this.add.image(config.width/2-400,config.height/2+250,'howto');
	var credit = this.add.image(config.width/2+400,config.height/2+250,'credit');
	btn.setInteractive();
	howto.setInteractive();
	credit.setInteractive();
	btn.on('pointerup',
		function(){
			this.scene.scene.start('Main');
		});
	howto.on('pointerup',
		function(){
			this.scene.scene.start('Tutorial');
		});
	credit.on('pointerup',
		function(){
			this.scene.scene.start('Credit');
		});
}