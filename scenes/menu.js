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
        this.add.text(width/2, height/2 - 270, "Piggy", {
            font: "40px Arial",
            fill: "#ffffff",
            stroke: "#b92978ff",
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(width/2, height/2 - 222, "Save Money", {
            font: "40px Arial",
            fill: "#ffffff",
            stroke: "#29b960ff",
            strokeThickness: 6
        }).setOrigin(0.5);


        // BOTÓN
        const btn = this.add.rectangle(width/2, height/2 -130, 200, 60, 0x629D92)
            .setInteractive()
            .setStrokeStyle(4, 0xffffff);

        this.add.text(width/2, height/2 + -130, "INICIAR", {
            font: "30px Arial",
            fill: "#ffffff",
            stroke: "#000",
            strokeThickness: 3
        }).setOrigin(0.5);

        btn.on("pointerover", () => btn.setFillStyle(0x80E0CF));
        btn.on("pointerout",  () => btn.setFillStyle(0x629D92));

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
