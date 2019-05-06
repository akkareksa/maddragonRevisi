let credit = new Phaser.Scene('Credit');

credit.preload = function(){
	this.load.setBaseURL('assets/');
	this.load.image('back','back.png');
	this.load.image('creditPage','creditPage.png');
}
var scoreText;
credit.create = function(){
	var tunjuk = this.add.image(config.width/2, config.height/2, 'creditPage').setScale(1);
	var btn = this.add.image(config.width/2,config.height/2+250,'back');
	btn.setInteractive();
	btn.on('pointerup',
		function(){
			this.scene.scene.start('Menu');
		});
}