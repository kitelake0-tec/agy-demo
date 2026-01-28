import Phaser from 'phaser';
import { GameEventBus } from '../GameEventBus';

export class GameScene extends Phaser.Scene {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerName!: Phaser.GameObjects.Text;
    private speed: number = 200;

    constructor() {
        super('GameScene');
    }

    create() {
        // Create basic world
        // Draw a large grass field
        const mapWidth = 2000;
        const mapHeight = 2000;
        this.add.tileSprite(0, 0, mapWidth, mapHeight, 'grass').setOrigin(0);

        // Set world bounds
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

        // Player
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);

        // Camera follows player
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);

        // Controls
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        // Add some random monsters
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, mapWidth);
            const y = Phaser.Math.Between(0, mapHeight);
            const monster = this.physics.add.sprite(x, y, 'monster');
            monster.setImmovable(true);
        }

        // Add Environment (Trees + Rocks)
        const obstacles = this.physics.add.staticGroup();
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, mapWidth);
            const y = Phaser.Math.Between(0, mapHeight);
            obstacles.create(x, y, Phaser.Math.RND.pick(['tree', 'rock']));
        }
        this.physics.add.collider(this.player, obstacles);

        // Player Name
        this.playerName = this.add.text(this.player.x, this.player.y - 20, '용사님', {
            fontSize: '14px',
            color: '#ffffff',
            backgroundColor: '#00000088',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5);

        // Emit scene ready event
        GameEventBus.emit('scene-ready');
    }

    update() {
        if (!this.cursors || !this.player) return;

        // Update name position
        if (this.playerName) {
            this.playerName.setPosition(this.player.x, this.player.y - 30);
        }
        if (!this.cursors || !this.player) return;

        const left = this.cursors.left.isDown;
        const right = this.cursors.right.isDown;
        const up = this.cursors.up.isDown;
        const down = this.cursors.down.isDown;

        this.player.setVelocity(0);

        // Horizontal movement
        if (left) {
            this.player.setVelocityX(-this.speed);
        } else if (right) {
            this.player.setVelocityX(this.speed);
        }

        // Vertical movement
        if (up) {
            this.player.setVelocityY(-this.speed);
        } else if (down) {
            this.player.setVelocityY(this.speed);
        }

        // Basic normalization for diagonal movement
        if ((left || right) && (up || down)) {
            this.player.body.velocity.normalize().scale(this.speed);
        }
    }
}
