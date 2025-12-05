const config = {
    type: Phaser.AUTO,

    width: 480,
    height: 720,

    transparent: true,
    backgroundColor: "rgba(0, 0, 0, 0)",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 480,
        height: 720
    },

    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: [PreloadScene, MenuScene, GameScene]
};

var game = new Phaser.Game(config);
