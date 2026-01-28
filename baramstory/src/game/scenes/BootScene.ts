import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load assets here (placeholders for now)
        // creating a simple texture programmatically
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Player texture (Better design)
        graphics.fillStyle(0xffcc99); // Skin
        graphics.fillRect(8, 8, 16, 16); // Face
        graphics.fillStyle(0x3366cc); // Body
        graphics.fillRect(4, 24, 24, 8);
        graphics.fillStyle(0x000000); // Eyes
        graphics.fillRect(10, 12, 4, 4);
        graphics.fillRect(18, 12, 4, 4);
        graphics.generateTexture('player', 32, 32);
        graphics.clear();

        // Grass texture (Textured)
        graphics.fillStyle(0x008800);
        graphics.fillRect(0, 0, 32, 32);
        graphics.fillStyle(0x006600);
        graphics.fillCircle(8, 8, 2);
        graphics.fillCircle(24, 24, 3);
        graphics.generateTexture('grass', 32, 32);
        graphics.clear();

        // Tree texture
        graphics.fillStyle(0x5d4037); // Trunk
        graphics.fillRect(12, 16, 8, 16);
        graphics.fillStyle(0x2e7d32); // Leaves
        graphics.fillCircle(16, 12, 12);
        graphics.generateTexture('tree', 32, 32);
        graphics.clear();

        // Rock texture
        graphics.fillStyle(0x757575);
        graphics.fillCircle(16, 24, 10);
        graphics.fillStyle(0x9e9e9e);
        graphics.fillCircle(14, 22, 5);
        graphics.generateTexture('rock', 32, 32);

        // Monster texture
        graphics.fillStyle(0xff0000); // Red
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('monster', 32, 32);
    }

    create() {
        this.scene.start('GameScene');
    }
}
