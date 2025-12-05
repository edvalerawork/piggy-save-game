class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");

        this.paused = false;
        this.isGameOver = false;

        this.world = 1;
        this.objective = 200;

        this.metaNames = {
            1: "Construyendo tu Alcancía",
            2: "Hábito de Ahorro",
            3: "Ahorro Avanzado",
            4: "Plan de Inversión",
            5: "Libertad Financiera"
        };
    }

    // CREACIÓN DE ESCENA
    create() {
        const { width, height } = this.sys.game.config;
        
        // Fondo
        this.bg = this.add.image(width/2, height/2, "bg1");
        this.bg.setDisplaySize(width, height).setDepth(-2000);

        // Stats
        this.score = 0;
        this.lives = 3;
        this.maxLives = 6;
        this.highScore = parseInt(localStorage.getItem("highScore") || 0);

        // Player
        this.player = this.physics.add.image(width/2, height - 150, "pig1");
        this.player.setScale(0.5);
        this.player.body.allowGravity = false;
        this.player.setBodySize(this.player.width * 0.6, this.player.height * 0.6);
        this.player.setOffset(this.player.width * 0.2, this.player.height * 0.2);
        this.speed = 450;

        // Grupo de objetos
        this.objects = this.physics.add.group();
        this.missedItems = 0;

        // Spawns
        this.startSpawnForWorld(1);

        // Colisión
        this.physics.add.overlap(this.player, this.objects, this.catchObject, null, this);

        // UI
        this.createUI(width, height);

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        // Movimiento táctil y mouse optimizado
        this.input.on("pointerdown", (p) => {
            if (!this.paused && !this.isGameOver) {
                this.player.x = Phaser.Math.Clamp(p.x, 40, width - 40);
            }
        });

        this.input.on("pointermove", (p) => {
            if (!this.paused && !this.isGameOver && p.isDown) {
                this.player.x = Phaser.Math.Clamp(p.x, 40, width - 40);
            }
        });



        this.input.keyboard.on("keydown-SPACE", () => this.togglePause());
    }

    // INTERFAZ GRÁFICA (UI)
    createUI(width, height) {

        this.uiBar = this.add.rectangle(width/2, 65, width, 45, 0x000000, 0.35).setDepth(1000);

        this.metaTxt = this.add.text(width/2, 65,
            "Meta 1: " + this.metaNames[1],
            { font:"35px Arial", fill:"#ffffff", stroke:"#000", strokeThickness:2, resolution: 2 }
        ).setOrigin(0.5).setDepth(1000);

        this.objectiveTxtLabel = this.add.text(10, 95, "Objetivo:",
            { font:"30px Arial", fill:"#ff7b00ff", stroke:"#fff", strokeThickness:3 }
        ).setDepth(1000);

        this.objectiveTxt = this.add.text(10, 130, "S/. " + this.objective,
            { font:"30px Arial", fill:"#ff7b00ff", stroke:"#fff", strokeThickness:3 }
        ).setDepth(1000);

        this.scoreTitle = this.add.text(10, 165, "Ahorro:",
            { font:"35px Arial", fill:"#fff", stroke:"#1d4d73", strokeThickness:4 }
        ).setDepth(1000);

        this.scoreTxt = this.add.text(10, 210, "S/. 0",
            { font:"42px Arial", fill:"#fff", stroke:"#1d4d73", strokeThickness:4 }
        ).setDepth(1000);

        this.heartsTxt = this.add.text(width - 10, 95, "❤❤❤",
            { font:"46px Arial", fill:"#ff335fff" }
        ).setOrigin(1,0).setDepth(1000);

        this.uiBarTop = this.add.rectangle(width/2, 20, width, 40, 0x000000, 1).setDepth(1000);

        // Botón MENÚ
    this.add.text(20, 20, "Menú", { font: "20px Arial", fill: "#fff" })
        .setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.scene.start("MenuScene"))
        .setDepth(1001);

    // --- BOTÓN REINICIAR ↺ ---
    this.restartBtn = this.add.text(width - 90, 20, "↺", {
        font: "30px Arial",
        fill: "#fff"
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .setDepth(1001);

    this.restartBtn.on("pointerdown", () => {
        if (!this.isGameOver) {
            this.world = 1;
            this.objective = 200;
            this.score = 0;
            this.lives = 3;
            this.paused = false;
            this.objects.clear(true, true);
            this.scene.restart();
        }
    });

    this.pauseBtn = this.add.text(width - 25, 20, "⏸", {
        font: "32px Arial",
        fill: "#fff"
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .setDepth(1001);

    this.pauseBtn.on("pointerdown", () => {
        if (!this.isGameOver) {
            this.togglePause();
        }
    });

    }

    // SPAWNS META 1
    spawnWorld1(){
        if(this.paused || this.isGameOver) return;
        if(this.objects.getChildren().length > 30) return;

        let r = Math.random();
        let type;

        if(this.score < 100){
            if(r < 0.6) type="coin1";
            else if(r < 0.9) type="coin2";
            else type="coin5";
        }
        else {
            if(r < 0.4) type="coin1";
            else if(r < 0.75) type="coin2";
            else if(r < 0.95) type="coin5";
            else type="bill10";
        }

        let extra = Math.random();
        if(extra > 0.99) type = "heart";
        else if(extra > 0.97) type = "hammer";

        this.spawnItem(type);
    }

    // SPAWNS META 2
    spawnWorld2(){
        if(this.paused || this.isGameOver) return;
        if(this.objects.getChildren().length > 40) return;

        let r = Math.random();
        let type;

        if(r < 0.05) type="coin1";
        else if(r < 0.10) type="coin2";
        else if(r < 0.35) type="coin5";
        else if(r < 0.65) type="bill10";
        else if(r < 0.85) type="bill20";
        else if(r < 0.93) type="bill50";
        else if(r < 0.97) type="heart";
        else type="hammer";

        this.spawnItem(type);
    }

    // SPAWNS META 3
    spawnWorld3(){
        if(this.paused || this.isGameOver) return;
        if(this.objects.getChildren().length > 50) return;

        let r = Math.random();
        let type;

        if(r < 0.25) type="bill10";
        else if(r < 0.55) type="bill20";
        else if(r < 0.80) type="bill50";
        else if(r < 0.93) type="bill100";
        else if(r < 0.97) type="bill200";
        else if(r < 0.99) type="heart";
        else type="hammer";

        this.spawnItem(type);
    }

    // SPAWNS META 4
    spawnWorld4(){
        if(this.paused || this.isGameOver) return;
        if(this.objects.getChildren().length > 55) return;

        let r = Math.random();
        let type;

        if(r < 0.25) type="bill50";
        else if(r < 0.55) type="bill100";
        else if(r < 0.75) type="bill200";
        else if(r < 0.88) type="vipcard";
        else if(r < 0.94) type="diamond";
        else if(r < 0.97) type="heart";
        else type="hammer";

        this.spawnItem(type);
    }

    // SPAWNS META 5
    spawnWorld5(){
        if(this.paused || this.isGameOver) return;
        if(this.objects.getChildren().length > 60) return;

        let r = Math.random();
        let type;

        if(r < 0.20) type="bill100";
        else if(r < 0.45) type="bill200";
        else if(r < 0.70) type="vipcard";
        else if(r < 0.88) type="diamond";
        else if(r < 0.93) type="heart";
        else type="hammer";

        this.spawnItem(type);
    }

    // CREACIÓN BASE DE ITEMS
    spawnItem(type){
        const { width } = this.sys.game.config;
        const speeds = this.getWorldSpeeds();

        const x = Phaser.Math.Between(60, width - 60);
        const obj = this.objects.create(x, -20, type);

        obj.setData("type", type);
        obj.setData("value", this.getValue(type));
        obj.setVelocityY(Phaser.Math.Between(speeds.min, speeds.max));
        obj.body.setAllowGravity(false);

        const scales = {
            coin1: 0.19,
            coin2: 0.19,
            coin5: 0.20,

            bill10: 0.25,
            bill20: 0.25,
            bill50: 0.26,

            bill100: 0.25,
            bill200: 0.25,

            vipcard: 0.24,
            diamond: 0.23,

            heart: 0.15,
            hammer: 0.23
        };



        obj.setScale(scales[type] || 0.13).setDepth(1);
    }

    // VELOCIDAD POR META
    getWorldSpeeds(){
        return {
            1: { min:250, max:350 },
            2: { min:300, max:450 },
            3: { min:350, max:520 },
            4: { min:400, max:580 },
            5: { min:450, max:650 }
        }[this.world];
    }

    // VALORES DE OBJETOS
    getValue(type){
        const values = {
            coin1:1, coin2:2, coin5:5,
            bill10:10, bill20:20, bill50:50,
            bill100:100, bill200:200,
            vipcard:300, diamond:1000
        };
        return values[type] || 0;
    }

    // COLISIONES
    catchObject(player,obj){
        const type = obj.getData("type");
        const value = obj.getData("value");

        if(value > 0){
            this.score += value;
            this.scoreTxt.setText("S/. " + this.score.toLocaleString());
            this.checkWorldProgress();
        }

        if(type==="heart" && this.lives < this.maxLives){
            this.lives++;
            this.updateLives();
        }

        if(type==="hammer"){
            this.lives--;
            this.updateLives();
            if(this.lives<=0){
                obj.destroy();
                this.gameOver();
                return;
            }
        }

        obj.destroy();
    }

    updateLives(){
        this.heartsTxt.setText("❤".repeat(this.lives));
    }

    // PROGRESO ENTRE METAS
    checkWorldProgress(){
        let s = this.score;

        if(s >= 200 && this.world === 1) this.changeWorld(2, 1000);
        else if(s >= 1000 && this.world === 2) this.changeWorld(3, 5000);
        else if(s >= 5000 && this.world === 3) this.changeWorld(4, 10000);
        else if(s >= 10000 && this.world === 4) this.changeWorld(5, "∞");
    }

    // CAMBIO DE META
    changeWorld(newWorld,newObjective){

        this.world = newWorld;
        this.objective = newObjective;

        const { width,height } = this.sys.game.config;

        this.spawnTimer.remove();
        this.objects.clear(true, true);

        if(this.bg) this.bg.destroy();
        this.bg = this.add.image(width/2, height/2, "bg"+newWorld);
        this.bg.setDisplaySize(width,height).setDepth(-2000);

        this.worldMessage("¡Meta " + newWorld + "!");

        this.metaTxt.setText("Meta " + newWorld + ": " + this.metaNames[newWorld]);
        this.objectiveTxt.setText("S/. " + this.objective);

        this.startSpawnForWorld(newWorld);
        this.updatePigAppearance(newWorld);
    }

    startSpawnForWorld(w){
        const map = {
            1: ()=> this.spawnWorld1(),
            2: ()=> this.spawnWorld2(),
            3: ()=> this.spawnWorld3(),
            4: ()=> this.spawnWorld4(),
            5: ()=> this.spawnWorld5()
        };

        const delay = { 1:500, 2:380, 3:350, 4:320, 5:300 }[w];

        this.spawnTimer = this.time.addEvent({
            delay,
            loop: true,
            callback: map[w]
        });
    }

    // MENSAJE CENTRAL AL CAMBIAR META
    worldMessage(text){
        const { width,height } = this.sys.game.config;

        let txt = this.add.text(
            width/2, height/2,
            text,
            { font:"50px Arial", fill:"#fff", stroke:"#000", strokeThickness:6 }
        ).setOrigin(0.5).setDepth(5000);

        this.tweens.add({
            targets:txt,
            alpha:0,
            duration:2000,
            delay:1000,
            onComplete:()=>txt.destroy()
        });
    }

    // PAUSA DEL JUEGO
    togglePause() {
        if (this.isGameOver) return;

        this.paused = !this.paused;

        if (this.paused) {

            if (this.pauseBtn) this.pauseBtn.setText("⯈");

            this.physics.pause();
            if (this.spawnTimer) this.spawnTimer.paused = true;
            this.showPausePanel();

        } else {

            if (this.pauseBtn) this.pauseBtn.setText("⏸");

            this.hidePausePanel();
            this.physics.resume();
            if (this.spawnTimer) this.spawnTimer.paused = false;
        }
    }

    showPausePanel(){
        const { width,height } = this.sys.game.config;

        this.pausePanel = this.add.rectangle(width/2,height/2,300,150,0x000000,0.8).setDepth(5000);

        this.pauseText = this.add.text(width/2,height/2,"PAUSADO",
            { font:"32px Arial", fill:"#fff" }
        ).setOrigin(0.5).setDepth(5001);
    }

    hidePausePanel(){
        this.pausePanel.destroy();
        this.pauseText.destroy();
    }

    // GAME OVER
gameOver(){
    const {width,height}=this.sys.game.config;

    if(this.score > this.highScore){
        this.highScore = this.score;
        localStorage.setItem("highScore", this.highScore);
    }

    this.isGameOver = true;
    this.paused = true;

    this.physics.pause();
    this.spawnTimer.paused = true;

    const panel = this.add.rectangle(
        width/2, height/2,
        width * 0.85, height * 0.55,
        0x000000, 0.75
    ).setDepth(9000);

    const border = this.add.rectangle(
        width/2, height/2,
        width * 0.85, height * 0.55
    )
    .setStrokeStyle(4, 0xffffff)
    .setFillStyle(0x000000, 0)
    .setDepth(9001);

    this.add.text(width/2, height/2 - height * 0.17,
        "¡LO HICISTE GENIAL!",
        { font:"36px Arial", fill:"#ffeb3b", stroke:"#000", strokeThickness:6 }
    ).setOrigin(0.5).setDepth(9002);

    this.add.text(width/2, height/2 - 10,
        "Ahorro:",
        { font:"30px Arial", fill:"#fff", stroke:"#000", strokeThickness:4 }
    ).setOrigin(0.5).setDepth(9002);

    this.add.text(width/2, height/2 + 30,
        "S/. " + this.score.toLocaleString(),
        { font:"42px Arial", fill:"#00e676", stroke:"#003300", strokeThickness:4 }
    ).setOrigin(0.5).setDepth(9002);

    this.add.text(width/2, height/2 + 85,
        "Mejor ahorro:",
        { font:"22px Arial", fill:"#bbb", stroke:"#000", strokeThickness:4 }
    ).setOrigin(0.5).setDepth(9002);

    this.add.text(width/2, height/2 + 115,
        "S/. " + this.highScore.toLocaleString(),
        { font:"28px Arial", fill:"#fff", stroke:"#000", strokeThickness:4 }
    ).setOrigin(0.5).setDepth(9002);

    let btnPlay = this.add.text(width/2, height/2 + height * 0.23,
        "VOLVER A JUGAR",
        { font:"28px Arial", fill:"#00e5ff", stroke:"#000", strokeThickness:4 }
    )
    .setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(9003);

    btnPlay.on("pointerdown",()=>{
        this.world = 1;
        this.objective = 200;
        this.score = 0;
        this.lives = 3;

        this.objects.clear(true, true);
        this.isGameOver = false;
        this.paused = false;
        this.scene.restart();
    });

    let btnMenu = this.add.text(width/2, height/2 + height * 0.31,
        "REGRESAR AL MENÚ",
        { font:"24px Arial", fill:"#fff", stroke:"#000", strokeThickness:4 }
    )
    .setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(9003);

    btnMenu.on("pointerdown",()=>{
        this.isGameOver = false;
        this.scene.start("MenuScene");
    });
}

    // UPDATE FRAME A FRAME
    update(){
        if(this.paused || this.isGameOver) return;

        const { width } = this.sys.game.config;

        this.objects.children.iterate(obj=>{
            if(obj && obj.y > this.sys.game.config.height +50){

                const type = obj.getData("type") || "";
                const value = obj.getData("value") || 0;

                if(type !== "heart" && type !== "hammer"){

                    this.missedItems++;

                    if(this.missedItems >= 4){

                        this.lives--;
                        this.updateLives();

                        let warn = this.add.text(
                            this.player.x, this.player.y - 80,
                            "-1 ❤",
                            { font:"60px Arial", fill:"#f00", stroke:"#ffffffff", strokeThickness:7 }
                        ).setOrigin(0.5).setDepth(2000);

                        this.tweens.add({
                            targets: warn,
                            y: warn.y - 50,
                            alpha: 0,
                            duration: 600,
                            ease: "Quad.easeOut",
                            onComplete: ()=> warn.destroy()
                        });

                        this.missedItems = 0;

                        if(this.lives <= 0){
                            obj.destroy();
                            this.gameOver();
                            return;
                        }
                    }
                }

                obj.destroy();
            }
        });

        if(this.cursors.left.isDown){
            this.player.x -= this.speed * 0.015;
        }
        else if(this.cursors.right.isDown){
            this.player.x += this.speed * 0.015;
        }

        const half = this.player.width * this.player.scaleX * 0.30;
        this.player.x = Phaser.Math.Clamp(this.player.x, half, width - half);

    }

    // CAMBIO DE SKIN DEL CERDITO SEGÚN META
    updatePigAppearance(meta){

        const { x, y } = this.player;

        this.player.destroy();

        this.player = this.physics.add.image(x, y, "pig" + meta);
        this.player.setScale(0.5);
        this.player.body.allowGravity = false;

        this.player.setBodySize(this.player.width * 0.6, this.player.height * 0.6);
        this.player.setOffset(this.player.width * 0.2, this.player.height * 0.2);

        this.speed = 450;

        this.physics.add.overlap(this.player, this.objects, this.catchObject, null, this);
    }
}
