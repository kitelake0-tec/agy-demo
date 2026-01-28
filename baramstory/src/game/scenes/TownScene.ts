import Phaser from "phaser";
import { Player } from "../objects/Player";
import { ClassType } from "../types";

export default class TownScene extends Phaser.Scene {
    private player!: Player;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private classType!: ClassType;

    constructor() {
        super("TownScene");
    }

    init(data: { classType: ClassType }) {
        this.classType = data.classType || "WARRIOR";
    }

    create() {
        this.createMap();

        // Player spawn
        this.player = new Player(this, 640, 360, this.classType);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.5);

        // Controls
        this.cursors = this.input.keyboard!.createCursorKeys();

        // NPCs
        this.createNPC(500, 300, "주모", "탁주 한잔 하실래예?");
        this.createNPC(700, 300, "대장장이", "무기 수리는 맡겨둬!");

        // Portal to Dungeon
        const portal = this.add.circle(640, 100, 20, 0xaa00aa, 0.5);
        this.physics.add.existing(portal, true);
        this.add.text(640, 60, "사냥터", { fontSize: '14px', color: '#fff' }).setOrigin(0.5);

        this.physics.add.overlap(this.player, portal, () => {
            this.scene.start("DungeonScene", { classType: this.classType });
        });

        // UI
        this.scene.launch("UIScene", { player: this.player });
    }

    createMap() {
        // Simple 40x40 Map
        const width = 40;
        const height = 40;
        const tileSize = 32;

        this.physics.world.setBounds(0, 0, width * tileSize, height * tileSize);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let texture = 'tile_grass';

                // Paths
                if (x === 20 || y === 10) texture = 'tile_dirt';

                // Walls around
                let isWall = false;
                if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    texture = 'tile_wall';
                    isWall = true;
                }
                // A building at 10,10
                if (x >= 8 && x <= 12 && y >= 8 && y <= 12) {
                    // Interior floor
                    texture = 'tile_dirt';
                    // Walls
                    if (x === 8 || x === 12 || y === 8 || y === 12) {
                        // Door
                        if (!(x === 10 && y === 12)) {
                            texture = 'tile_wall';
                            isWall = true;
                        }
                    }
                }

                const tile = this.add.image(x * tileSize + 16, y * tileSize + 16, texture);

                if (isWall) {
                    this.physics.add.existing(tile, true);
                    // Add collision later? 
                    // Phaser Arcade Physics StaticGroup is better
                }
            }
        }

        // Efficient Collision: create invisible walls for bounds
        // For specific walls, we'd add them to a StaticGroup.
        // Let's keep it simple: World bounds are set
    }

    createNPC(x: number, y: number, name: string, dialog: string) {
        const npc = this.physics.add.sprite(x, y, 'NPC');
        npc.setImmovable(true);

        const nameTag = this.add.text(x, y - 24, name, {
            fontSize: "12px", color: "#ffff00", stroke: "#000", strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(x, y + 24, dialog, {
            fontSize: "10px", color: "#ffffff", backgroundColor: "#00000088"
        }).setOrigin(0.5);

        this.physics.add.collider(this.player, npc);
    }

    update() {
        this.player.update(this.cursors);
    }
}
