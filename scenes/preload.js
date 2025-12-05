class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {

        // FONDOS
        this.load.image("menuBg","assets/menuBg.png");
        this.load.image("bg1","assets/bg1.png");
        this.load.image("bg2","assets/bg2.jpg");
        this.load.image("bg3","assets/bg3.jpg");
        this.load.image("bg4","assets/bg4.png");
        this.load.image("bg5","assets/bg5.png");

        // CERDITOS (EVOLUCIONES)
        this.load.image("pig1", "assets/pig1.png");
        this.load.image("pig2", "assets/pig2.png");
        this.load.image("pig3", "assets/pig3.png");
        this.load.image("pig4", "assets/pig4.png");
        this.load.image("pig5", "assets/pig5.png");

        // OBJETOS DE DINERO
        this.load.image("coin1","assets/coin1.png");
        this.load.image("coin2","assets/coin2.png");
        this.load.image("coin5","assets/coin5.png");

        this.load.image("bill10","assets/bill10.png");
        this.load.image("bill20","assets/bill20.png");
        this.load.image("bill50","assets/bill50.png");
        this.load.image("bill100","assets/bill100.png");

        this.load.image("bill200","assets/bill200.png");
        this.load.image("vipcard","assets/vipcard.png");
        this.load.image("diamond", "assets/diamond.png");

        // OBJETOS ESPECIALES
        this.load.image("heart","assets/heart.png");
        this.load.image("hammer","assets/hammer.png");

        // LOADING
        this.loadingText = this.add.text(400, 300, "Cargando...", {
            font: "32px Arial",
            fill: "#ffffff"
        }).setOrigin(0.5);

        //MUSICA
        this.load.audio("music1", "assets/audio/music1.mp3");
        this.load.audio("music2", "assets/audio/music2.mp3");
        this.load.audio("music3", "assets/audio/music3.mp3");
        this.load.audio("music4", "assets/audio/music4.mp3");
        this.load.audio("music5", "assets/audio/music5.mp3");

    }

    create() {
        this.scene.start("MenuScene");
    }
}
