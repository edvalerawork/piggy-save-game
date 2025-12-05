class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    create() {
        const { width, height } = this.sys.game.config;
        

        // FONDO CON IMAGEN
        this.bg = this.add.image(width/2, height/2, "menuBg");
        this.bg.setDisplaySize(width, height);
        this.bg.setDepth(-1000);

        // TÍTULO
        this.add.text(width/2, height/2 - 450, "Piggy", {
            font: "80px Arial",
            fill: "#ffffff",
            stroke: "#EE899D",
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width/2, height/2 - 350, "Save Money", {
            font: "70px Arial",
            fill: "#ffffff",
            stroke: "#3da391ff",
            strokeThickness: 8
        }).setOrigin(0.5);


        // BOTÓN
        const btn = this.add.rectangle(width/2, height/2 -210, 340, 140, 0x80E0CF)
            .setInteractive()
            .setStrokeStyle(4, 0xffffff);

        this.add.text(width/2, height/2 + -210, "INICIAR", {
            font: "65px Arial",
            fill: "#ffffff",
            stroke: "#00000080",
            strokeThickness: 7
        }).setOrigin(0.5);

        btn.on("pointerover", () => btn.setFillStyle(0xEE899D));
        btn.on("pointerout",  () => btn.setFillStyle(0x80E0CF));

        btn.on("pointerdown", () => {
            this.scene.start("GameScene");
        });

        // ANIMACIÓN
        this.tweens.add({
            targets: btn,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }
}
