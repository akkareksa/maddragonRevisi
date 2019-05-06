	var config = {
		type: Phaser.AUTO,
		width: 1150,
		height: 600,
		backgroundColor: '#71c5cf',
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 },
				// debug: true
			}
		},
		scene: [menu,main,credit,tutorial]
	};

	var game = new Phaser.Game(config);

	