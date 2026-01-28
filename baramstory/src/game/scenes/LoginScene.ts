import Phaser from "phaser";
import { CLASS_CONFIG, ClassType } from "../types";

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super("LoginScene");
    }

    create() {
        const { width, height } = this.scale;

        // Title
        this.add.text(width / 2, 80, "바람의전설", {
            fontSize: "60px",
            color: "#cccc00",
            fontFamily: "Malgun Gothic",
            stroke: "#550000",
            strokeThickness: 5
        }).setOrigin(0.5);

        const classes: ClassType[] = ["WARRIOR", "MAGE", "ARCHER", "ROGUE"];
        const startX = width / 2 - 360;
        const gap = 240;

        classes.forEach((cls, index) => {
            const config = CLASS_CONFIG[cls];
            const x = startX + index * gap;
            const y = height / 2;

            // Card
            const card = this.add.container(x, y);

            const bg = this.add.rectangle(0, 0, 200, 300, 0x111111).setStrokeStyle(2, 0x888888);

            // Title
            const name = this.add.text(0, -110, config.name, { fontSize: '24px', color: '#fff' }).setOrigin(0.5);

            // Avatar (Large version of sprite)
            const avatar = this.add.sprite(0, -30, cls).setScale(4); // Scale up the 32x32 texture

            // Stats info
            const stats = `체력: ${config.stats.maxHp}\n마력: ${config.stats.maxMp}\n공격: ${config.stats.attack}`;
            const desc = this.add.text(0, 60, stats, { fontSize: '14px', color: '#aaa', align: 'center' }).setOrigin(0.5);

            card.add([bg, name, avatar, desc]);
            card.setSize(200, 300);
            card.setInteractive(new Phaser.Geom.Rectangle(-100, -150, 200, 300), Phaser.Geom.Rectangle.Contains);

            card.on('pointerover', () => bg.setStrokeStyle(4, 0xffff00));
            card.on('pointerout', () => bg.setStrokeStyle(2, 0x888888));
            card.on('pointerdown', () => this.selectClass(cls));

            this.add.existing(card);
        });
    }

    selectClass(classType: ClassType) {
        this.scene.start("TownScene", { classType });
    }
}
