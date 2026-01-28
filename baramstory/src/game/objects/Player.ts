import Phaser from "phaser";
import { CLASS_CONFIG, CharacterConfig, ClassType } from "../types";

export class Player extends Phaser.Physics.Arcade.Sprite {
    public config: CharacterConfig;
    public hp: number;
    public mp: number;
    public maxHp: number;
    public maxMp: number;
    private isAttacking: boolean = false;
    private nameText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, classType: ClassType) {
        super(scene, x, y, classType); // Use the texture key generated in BootScene
        this.scene = scene;
        this.config = CLASS_CONFIG[classType];

        this.maxHp = this.config.stats.maxHp;
        this.maxMp = this.config.stats.maxMp;
        this.hp = this.maxHp;
        this.mp = this.maxMp;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Setup Physics
        this.setCollideWorldBounds(true);
        this.setBodySize(24, 24);
        // this.setOffset(4, 4);
        this.setDrag(800, 800);

        // Name Tag
        this.nameText = this.scene.add.text(x, y - 24, this.config.name, {
            fontSize: "12px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2,
        }).setOrigin(0.5);
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        // Sync Name Tag
        this.nameText.setPosition(this.x, this.y - 24);

        if (this.isAttacking) return;

        const speed = this.config.stats.speed;

        // Movement Logic
        this.setVelocity(0);

        let velocityX = 0;
        let velocityY = 0;

        if (cursors.left.isDown) velocityX = -speed;
        else if (cursors.right.isDown) velocityX = speed;

        if (cursors.up.isDown) velocityY = -speed;
        else if (cursors.down.isDown) velocityY = speed;

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }

        this.setVelocity(velocityX, velocityY);

        // Orientation - Flip X if moving left
        if (velocityX < 0) this.setFlipX(false); // Design faces left by default? No, right usually.
        // Our tex logic: eyes at 13,17. Middle is 16. Eyes on left side? 
        // Eyes: 13, 8 and 17, 8. Centered.
        // Let's just flip. 
        if (velocityX < 0) this.setFlipX(true);
        else if (velocityX > 0) this.setFlipX(false);
    }

    public attack(onComplete?: () => void) {
        if (this.isAttacking) return;
        this.isAttacking = true;

        // Simple bump animation
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.isAttacking = false;
                if (onComplete) onComplete();
            }
        });

        // Effect
        const angle = this.flipX ? Math.PI : 0;
        const fx = this.scene.add.text(this.x + (this.flipX ? -20 : 20), this.y, "⚔️", { fontSize: '20px' });
        this.scene.tweens.add({
            targets: fx,
            x: fx.x + (this.flipX ? -20 : 20),
            alpha: 0,
            duration: 300,
            onComplete: () => fx.destroy()
        });
    }

    public takeDamage(amount: number) {
        this.hp = Math.max(0, this.hp - amount);
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 1
        });

        if (this.hp <= 0) {
            // Die
            this.setTint(0x555555);
        }
    }
}
