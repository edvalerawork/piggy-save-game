const config = {
    type: Phaser.AUTO,

    width: 720,
    height: 1280,

    transparent: true,
    backgroundColor: "rgba(0, 0, 0, 0)",

    render: {
        pixelArt: false,
        antialias: true,
        antialiasGL: true,
        roundPixels: false,
        powerPreference: "high-performance"
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280,

        zoom: window.devicePixelRatio
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
