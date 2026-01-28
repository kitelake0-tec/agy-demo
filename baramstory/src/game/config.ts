import Phaser from "phaser";

import BootScene from "./scenes/BootScene";
import LoginScene from "./scenes/LoginScene";
import TownScene from "./scenes/TownScene";
import DungeonScene from "./scenes/DungeonScene";
import UIScene from "./scenes/UIScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: "game-container",
    backgroundColor: "#0a0a15",
    pixelArt: true, // For crispy pixel art look if we use it
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false, // Set to true for debugging collisions
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        BootScene,
        LoginScene,
        TownScene,
        DungeonScene,
        UIScene,
    ],
};

export default config;
