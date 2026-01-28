import Phaser from 'phaser';
import { GameEventBus } from '../GameEventBus';

export class InputManager {
    private scene: Phaser.Scene;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private keys: Map<string, Phaser.Input.Keyboard.Key> = new Map();
    private isInputEnabled: boolean = true;
    private keyBindings: { key: string; event: string }[];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.keyBindings = [
            { key: 'I', event: 'TOGGLE_INVENTORY' },
            { key: 'W', event: 'TOGGLE_SKILL_MENU' },
            { key: 'J', event: 'TOGGLE_QUEST_PANEL' },
            { key: 'W', event: 'TOGGLE_SKILL_MENU' },
            { key: 'J', event: 'TOGGLE_QUEST_PANEL' },
            { key: 'A', event: 'TOGGLE_AUTO_ATTACK' },
            { key: 'A', event: 'TOGGLE_AUTO_ATTACK' },
            { key: 'O', event: 'TOGGLE_SETTINGS' },
            { key: 'P', event: 'TOGGLE_ACHIEVEMENTS' },
            { key: 'L', event: 'TOGGLE_PETS' },
            { key: 'K', event: 'TOGGLE_STATS' },
        ];
        this.setupInput();

        // Listen for UI state to toggle game controls
        GameEventBus.on('DISABLE_CONTROL', () => { this.isInputEnabled = false; this.resetKeys(); });
        GameEventBus.on('ENABLE_CONTROL', () => { this.isInputEnabled = true; });
    }

    private setupInput() {
        if (!this.scene.input.keyboard) return;

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.keyBindings.forEach(({ key, event }) => {
            const keyObj = this.scene.input.keyboard!.addKey(key);
            this.keys.set(key, keyObj);
            keyObj.on('down', () => {
                // Allow TOGGLE events even if input is disabled (to close UI)
                const isToggle = event.startsWith('TOGGLE_');
                if (!this.isInputEnabled && !isToggle && key !== 'ESC') return;

                GameEventBus.emit(event);
            });
        });

        for (let i = 1; i <= 9; i++) {
            const key = this.scene.input.keyboard!.addKey(String(i));
            key.on('down', () => {
                if (this.isInputEnabled) GameEventBus.emit('USE_SKILL', i - 1);
            });
        }

        const quickSlotKeys = ['Q', 'E', 'R', 'T', 'F'];
        quickSlotKeys.forEach((key, index) => {
            const keyObj = this.scene.input.keyboard!.addKey(key);
            keyObj.on('down', () => {
                if (this.isInputEnabled) GameEventBus.emit('USE_QUICKSLOT', index);
            });
        });
    }

    // Force release keys when input is disabled to prevent "stuck" movement
    private resetKeys() {
        if (this.cursors) {
            this.cursors.left.isDown = false;
            this.cursors.right.isDown = false;
            this.cursors.up.isDown = false;
            this.cursors.down.isDown = false;
        }
    }

    get isEnabled(): boolean {
        return this.isInputEnabled;
    }

    getCursors(): Phaser.Types.Input.Keyboard.CursorKeys {
        return this.cursors;
    }

    isKeyDown(key: string): boolean {
        if (!this.isInputEnabled) return false;
        const keyObj = this.keys.get(key);
        return keyObj ? keyObj.isDown : false;
    }
}
