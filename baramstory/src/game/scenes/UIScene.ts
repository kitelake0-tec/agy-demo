import Phaser from "phaser";
import { Player } from "../objects/Player";

export default class UIScene extends Phaser.Scene {
    private player!: Player;
    private hpBar!: Phaser.GameObjects.Rectangle;
    private mpBar!: Phaser.GameObjects.Rectangle;
    private hpText!: Phaser.GameObjects.Text;

    constructor() {
        super("UIScene");
    }

    init(data: { player: Player }) {
        this.player = data.player;
    }

    create() {
        const { width } = this.scale;

        // Top Bar Background
        this.add.rectangle(width / 2, 30, width, 60, 0x000000, 0.7);

        // HP Bar
        this.add.text(20, 15, "HP", { fontSize: "16px", color: "#ff4444" });
        this.add.rectangle(150, 25, 200, 20, 0x330000);
        this.hpBar = this.add.rectangle(150, 25, 200, 20, 0xff0000);
        this.hpText = this.add.text(150, 25, "", { fontSize: "12px", color: "#fff" }).setOrigin(0.5);

        // MP Bar
        this.add.text(300, 15, "MP", { fontSize: "16px", color: "#4444ff" });
        this.add.rectangle(430, 25, 200, 20, 0x000033);
        this.mpBar = this.add.rectangle(430, 25, 200, 20, 0x0000ff);

        // Skills
        const skills = this.player.config.skills;
        skills.forEach((skill, index) => {
            const x = 700 + index * 60;
            const y = 30;

            // Skill Slot
            this.add.rectangle(x, y, 40, 40, 0x222222).setStrokeStyle(1, 0xaaaaaa);
            this.add.text(x, y, skill.icon, { fontSize: "24px" }).setOrigin(0.5);
            this.add.text(x + 15, y + 15, ["Q", "W", "E", "R"][index] || "", { fontSize: "10px", color: "#ffff00" });
        });
    }

    update() {
        if (!this.player) return;

        // Update HP
        const hpPercent = Phaser.Math.Clamp(this.player.hp / this.player.maxHp, 0, 1);
        this.hpBar.width = 200 * hpPercent;
        this.hpText.setText(`${Math.floor(this.player.hp)} / ${this.player.maxHp}`);

        // Update MP
        const mpPercent = Phaser.Math.Clamp(this.player.mp / this.player.maxMp, 0, 1);
        this.mpBar.width = 200 * mpPercent;
    }
}
