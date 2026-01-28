import Phaser from "phaser";
import { Player } from "../objects/Player";
import { ClassType } from "../types";

export default class DungeonScene extends Phaser.Scene {
    private player!: Player;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private classType!: ClassType;
    private monsters!: Phaser.Physics.Arcade.Group;

    constructor() {
        super("DungeonScene");
    }

    init(data: { classType: ClassType }) {
        this.classType = data.classType;
    }

    create() {
        // Background
        this.createMap();

        // Player
        this.player = new Player(this, 100, 100, this.classType);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Controls
        this.cursors = this.input.keyboard!.createCursorKeys();

        this.input.keyboard!.on('keydown-SPACE', () => {
            this.player.attack();
            this.checkAttacks();
        });

        // Monsters
        this.monsters = this.physics.add.group({
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true
        });

        this.spawnMonsters(20);

        this.physics.add.collider(this.player, this.monsters, (obj1, obj2) => {
            const player = obj1 as Player;
            player.takeDamage(5);

            const monster = obj2 as Phaser.Physics.Arcade.Sprite;
            const angle = Phaser.Math.Angle.Between(monster.x, monster.y, player.x, player.y);
            player.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
        });

        // Back Portal
        const portal = this.add.circle(50, 50, 20, 0x00ffff, 0.5);
        this.physics.add.existing(portal, true);
        this.physics.add.overlap(this.player, portal, () => {
            this.scene.start("TownScene", { classType: this.classType });
        });

        this.scene.launch("UIScene", { player: this.player });
    }

    createMap() {
        // 60x60 Dungeon Map
        const size = 32;
        this.physics.world.setBounds(0, 0, 60 * size, 60 * size);

        // Random generation of walls
        for (let y = 0; y < 60; y++) {
            for (let x = 0; x < 60; x++) {
                let tex = 'tile_dirt';
                // Random walls
                if (Math.random() < 0.1) tex = 'tile_wall'; // Obstacles
                if (x === 0 || x === 59 || y === 0 || y === 59) tex = 'tile_wall'; // Borders

                const tile = this.add.image(x * size + 16, y * size + 16, tex);
                if (tex === 'tile_wall') this.physics.add.existing(tile, true);
            }
        }
    }

    spawnMonsters(count: number) {
        for (let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(200, 1800);
            const y = Phaser.Math.Between(200, 1800);

            // Use generated texture
            const key = Math.random() > 0.5 ? 'monster_squirrel' : 'monster_skeleton';
            const monster = this.physics.add.sprite(x, y, key);

            monster.setBounce(1);
            monster.setCollideWorldBounds(true);
            monster.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));

            monster.setData('hp', key === 'monster_squirrel' ? 30 : 60);

            this.monsters.add(monster);
        }
    }

    checkAttacks() {
        const range = 60;
        // Attack box center based on flip
        const dirX = this.player.flipX ? -1 : 1;
        const attackX = this.player.x + dirX * 30;
        const attackY = this.player.y;

        this.monsters.getChildren().forEach((child) => {
            const monster = child as any;
            const dist = Phaser.Math.Distance.Between(attackX, attackY, monster.x, monster.y);

            if (dist < range) {
                const hp = monster.getData('hp') - this.player.config.stats.attack;
                monster.setData('hp', hp);

                // Visuals
                monster.setTint(0xff0000);
                this.time.delayedCall(100, () => monster.clearTint());

                // Knockback
                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, monster.x, monster.y);
                (monster.body as Phaser.Physics.Arcade.Body).setVelocity(
                    Math.cos(angle) * 200,
                    Math.sin(angle) * 200
                );

                if (hp <= 0) {
                    // Drop Item?
                    monster.destroy();
                }
            }
        });
    }

    update() {
        this.player.update(this.cursors);

        // AI
        this.monsters.getChildren().forEach((child) => {
            const monster = child as any;
            if (!monster.body) return;

            const dist = Phaser.Math.Distance.Between(monster.x, monster.y, this.player.x, this.player.y);
            if (dist < 300) {
                this.physics.moveToObject(monster, this.player, 80);
                monster.setFlipX(monster.body.velocity.x < 0);
            }
        });
    }
}
