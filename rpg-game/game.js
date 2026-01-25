class RPGGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Asset Manager
        this.assets = {
            hero: new Image(),
            monster: new Image(),
            tiles: new Image(),
            npc: new Image()
        };
        this.assetsLoaded = 0;
        this.totalAssets = 4;

        // Dynamic Sprite Sizes
        this.spriteSizes = {
            hero: { w: 32, h: 32, cols: 4, rows: 3 },
            monster: { w: 32, h: 32, cols: 4, rows: 4 }, // Assumed
            npc: { w: 32, h: 32, cols: 2, rows: 2 },
            tiles: { w: 32, h: 32, cols: 3, rows: 3 }
        };

        this.loadAssets();

        this.player = {
            name: '', gender: 'male', job: 'warrior',
            level: 1, exp: 0, maxExp: 100,
            hp: 100, maxHp: 100, mp: 50, maxMp: 50,
            x: 300, y: 225, speed: 180,
            dir: 0,
            isMoving: false,
            animFrame: 0, animTimer: 0,
            gold: 0,
            inventory: { potions_hp: 3, potions_mp: 3, equipment: [] },
            equipped: { weapon: null }
        };

        this.items = {
            'w1': { id: 'w1', name: '녹슨 검', type: 'weapon', dmg: 5, cost: 100, job: 'warrior' },
            'w2': { id: 'w2', name: '철검', type: 'weapon', dmg: 10, cost: 500, job: 'warrior' },
            'w3': { id: 'w3', name: '강철 대검', type: 'weapon', dmg: 20, cost: 2000, job: 'warrior' },
            's1': { id: 's1', name: '낡은 지팡이', type: 'weapon', dmg: 8, cost: 100, job: 'mage' },
            's2': { id: 's2', name: '마법사의 지팡이', type: 'weapon', dmg: 15, cost: 500, job: 'mage' },
            's3': { id: 's3', name: '수정구', type: 'weapon', dmg: 25, cost: 2000, job: 'mage' },
            'b1': { id: 'b1', name: '새총', type: 'weapon', dmg: 4, cost: 100, job: 'archer' },
            'b2': { id: 'b2', name: '단궁', type: 'weapon', dmg: 9, cost: 500, job: 'archer' },
            'b3': { id: 'b3', name: '엘프의 활', type: 'weapon', dmg: 18, cost: 2000, job: 'archer' }
        };

        this.keys = {};
        this.maps = {};
        this.currentMapId = null;
        this.npcs = [];
        this.monsters = [];
        this.portals = [];
        this.damageTexts = [];
        this.effects = [];

        this.gameState = 'loading';

        this.lastTime = 0;
        this.loop = this.loop.bind(this);
    }

    loadAssets() {
        const checkLoad = () => {
            this.assetsLoaded++;
            if (this.assetsLoaded === this.totalAssets) {
                // Calculate Frame Sizes
                this.updateSpriteDimensions();
                this.initGame();
            }
        };

        this.assets.hero.onload = checkLoad;
        this.assets.hero.src = 'assets/hero.png';

        this.assets.monster.onload = checkLoad;
        this.assets.monster.src = 'assets/monster.png';

        this.assets.tiles.onload = checkLoad;
        this.assets.tiles.src = 'assets/tiles.png';

        this.assets.npc.onload = checkLoad;
        this.assets.npc.src = 'assets/npc.png';
    }

    updateSpriteDimensions() {
        // Hero: 4 cols, 3 rows (Warrior, Mage, Archer)
        this.spriteSizes.hero.w = this.assets.hero.naturalWidth / 4;
        this.spriteSizes.hero.h = this.assets.hero.naturalHeight / 3;

        // Monster: 4 rows. Prompt was "Row 1: Squirrel, Rabbit...".
        // Let's assume 4 cols for safety (Squirrel Idle, Squirrel Move, Rabbit Idle, Rabbit Move) logic or just standard grid 
        // Logic: Row 1 = [Squirrel Idle] [Squirrel Move] [Rabbit Idle] [Rabbit Move] ?
        // Or Row 1 = Squirrel, Row 2 = Rabbit?
        // Prompt said: "Row 1: Squirrel... Rabbit... Each has 2 frames". So Row 1 has 4 frames total.
        this.spriteSizes.monster.w = this.assets.monster.naturalWidth / 4;
        this.spriteSizes.monster.h = this.assets.monster.naturalHeight / 4;

        // Tiles: "Green grass, dirt path...". 3x3 grid makes sense for 9 types.
        this.spriteSizes.tiles.w = this.assets.tiles.naturalWidth / 3;
        this.spriteSizes.tiles.h = this.assets.tiles.naturalHeight / 3;

        // NPC: 2x2 grid
        this.spriteSizes.npc.w = this.assets.npc.naturalWidth / 2;
        this.spriteSizes.npc.h = this.assets.npc.naturalHeight / 2;
    }

    initGame() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('character-creation').classList.remove('hidden');
        document.getElementById('character-creation').classList.add('active');

        this.initInput();
        this.initMaps();
        this.initSkills();

        requestAnimationFrame(this.loop);

        // Auto Regen
        setInterval(() => {
            if (this.gameState === 'playing' && this.player.hp > 0) {
                this.player.hp = Math.min(this.player.maxHp, this.player.hp + (this.player.maxHp * 0.01));
                this.player.mp = Math.min(this.player.maxMp, this.player.mp + (this.player.maxMp * 0.02));
                this.updateHUD();
            }
        }, 1000);
    }

    initMaps() {
        // Tile indices: 0:grass, 1:dirt, 2:wood, 3:stone, 4:cave, 5:wall, 6:tree, 7:rock
        this.maps['town'] = {
            name: '바람의 마을',
            bgTile: 0, // Grass
            portals: [{ x: 300, y: 20, w: 60, h: 40, target: 'dungeon1', targetX: 300, targetY: 350, color: 'rgba(0,255,0,0.3)' }],
            npcs: [
                { id: 'shop', name: '주모', x: 200, y: 200, spriteIdx: 0, type: 'shop' },
                { id: 'chief', name: '촌장', x: 400, y: 200, spriteIdx: 1, type: 'talk', text: "영웅이여, 북쪽 숲을 정화해주게." }
            ],
            monsters: [],
            objects: [{ x: 100, y: 100, tile: 7 }, { x: 500, y: 100, tile: 6 }]
        };

        this.maps['dungeon1'] = { // Forest
            name: '초보자 사냥터 (숲)',
            bgTile: 1, // Dirt
            portals: [
                { x: 300, y: 430, w: 60, h: 20, target: 'town', targetX: 300, targetY: 70 },
                { x: 580, y: 225, w: 20, h: 60, target: 'dungeon2', targetX: 40, targetY: 225, reqLv: 5 }
            ],
            spawnTable: [
                // Row 0 has Squirrel(col 0,1) and Rabbit(col 2,3)
                { name: '다람쥐', lv: 1, hp: 30, exp: 10, spriteRow: 0, colOffset: 0 },
                { name: '토끼', lv: 3, hp: 50, exp: 20, spriteRow: 0, colOffset: 2 }
            ],
            objects: [{ x: 100, y: 100, tile: 7 }, { x: 400, y: 300, tile: 6 }],
            maxMonsters: 8
        };

        this.maps['dungeon2'] = { // Graveyard
            name: '유령의 묘지',
            bgTile: 3, // Stone
            portals: [
                { x: 10, y: 225, w: 20, h: 60, target: 'dungeon1', targetX: 550, targetY: 225 }
            ],
            spawnTable: [
                // Row 1 has Ghost and Skeleton
                { name: '유령', lv: 7, hp: 150, exp: 60, spriteRow: 1, colOffset: 0 },
                { name: '해골', lv: 10, hp: 200, exp: 90, spriteRow: 1, colOffset: 2 }
            ],
            objects: [{ x: 200, y: 200, tile: 5 }, { x: 400, y: 100, tile: 5 }],
            maxMonsters: 10
        };
    }

    initSkills() {
        this.skills = {
            1: { name: '강격', lv: 5, mp: 10, cool: 1000, type: 'target', dmg: 1.5, range: 100, icon: '⚔️' },
            2: { name: '3연타', lv: 10, mp: 20, cool: 3000, type: 'multi', count: 3, range: 100, icon: '🥊' },
            3: { name: '충격파', lv: 15, mp: 25, cool: 4000, type: 'aoe', radius: 100, dmg: 1.2, icon: '🌊' },
            4: { name: '회복', lv: 20, mp: 30, cool: 10000, type: 'heal', amt: 50, icon: '❤️' },
            5: { name: '화염구', lv: 25, mp: 35, cool: 2000, type: 'projectile', dmg: 2.0, icon: '🔥' },
            6: { name: '번개', lv: 30, mp: 40, cool: 5000, type: 'aoe', radius: 200, dmg: 2.5, icon: '⚡' },
            7: { name: '독구름', lv: 35, mp: 45, cool: 8000, type: 'dot', duration: 5000, icon: '☠️' },
            8: { name: '블리자드', lv: 40, mp: 80, cool: 15000, type: 'screen_aoe', dmg: 3.0, icon: '❄️' },
            9: { name: '지옥불', lv: 45, mp: 100, cool: 30000, type: 'screen_aoe', dmg: 10.0, icon: '☄️' }
        };

        for (let i = 1; i <= 9; i++) {
            const slot = document.querySelector(`.skill-slot[data-key="${i}"]`);
            const skill = this.skills[i];
            if (skill) slot.innerHTML = `<span class="key-num">${i}</span>${skill.icon}<br><span style="font-size:0.5rem">Lv${skill.lv}</span>`;
        }
    }

    initInput() {
        window.addEventListener('keydown', e => {
            if (this.gameState === 'playing') {
                this.keys[e.key] = true;
                if (e.code === 'Space') this.interact();
                if (e.key === 'a' || e.key === 'A') this.basicAttack();
                if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) this.useSkill(parseInt(e.key));
            }
        });
        window.addEventListener('keyup', e => this.keys[e.key] = false);

        document.getElementById('start-game-btn').addEventListener('click', () => {
            const name = document.getElementById('char-name').value || '모험가';
            const gender = document.querySelector('.gender-btn.selected').dataset.value;
            const job = document.querySelector('.race-btn.selected').dataset.value;

            this.player.name = name;
            this.player.gender = gender;
            this.player.job = job;

            if (job === 'warrior') { this.player.maxHp = 150; this.player.maxMp = 30; this.equipItem('w1'); }
            if (job === 'mage') { this.player.maxHp = 80; this.player.maxMp = 100; this.equipItem('s1'); }
            if (job === 'archer') { this.player.maxHp = 100; this.player.maxMp = 60; this.equipItem('b1'); }
            this.player.hp = this.player.maxHp;
            this.player.mp = this.player.maxMp;

            document.getElementById('character-creation').classList.remove('active');
            document.getElementById('character-creation').classList.add('hidden');
            document.getElementById('game-screen').classList.remove('hidden');
            document.getElementById('game-screen').classList.add('active');

            this.loadMap('town');
            this.gameState = 'playing';
            this.updateHUD();
            this.log('모험을 시작합니다!');
        });

        document.querySelectorAll('.option-btn').forEach(btn => btn.addEventListener('click', function () {
            this.parentNode.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        }));

        document.getElementById('close-shop-btn').addEventListener('click', () => {
            document.getElementById('shop-modal').classList.add('hidden');
        });
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.buyItem(e.target.dataset.type, parseInt(e.target.dataset.cost)));
        });
    }

    loadMap(id, x, y) {
        this.currentMapId = id;
        const map = this.maps[id];

        document.getElementById('location-banner').textContent = map.name;
        document.getElementById('location-banner').classList.remove('hidden');
        setTimeout(() => document.getElementById('location-banner').classList.add('hidden'), 2000);

        this.player.x = x !== undefined ? x : 300;
        this.player.y = y !== undefined ? y : 225;
        this.portals = map.portals || [];
        this.npcs = map.npcs || [];
        this.monsters = [];
        this.objects = map.objects || [];
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        if (this.gameState === 'playing') {
            this.update(dt);
            this.draw();
        }
        requestAnimationFrame(this.loop);
    }

    update(dt) {
        let dx = 0, dy = 0;
        if (this.keys['ArrowUp']) { dy = -1; this.player.dir = 3; }
        if (this.keys['ArrowDown']) { dy = 1; this.player.dir = 0; }
        if (this.keys['ArrowLeft']) { dx = -1; this.player.dir = 1; }
        if (this.keys['ArrowRight']) { dx = 1; this.player.dir = 2; }

        if (dx !== 0 || dy !== 0) {
            this.player.isMoving = true;
            this.player.animTimer += dt;
            if (this.player.animTimer > 0.15) {
                this.player.animFrame = (this.player.animFrame + 1) % 4;
                this.player.animTimer = 0;
            }
            if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
            const nextX = this.player.x + dx * this.player.speed * dt;
            const nextY = this.player.y + dy * this.player.speed * dt;
            if (nextX > 0 && nextX < 600 - 32) this.player.x = nextX;
            if (nextY > 0 && nextY < 450 - 32) this.player.y = nextY;
        } else {
            this.player.isMoving = false;
            this.player.animFrame = 0;
        }

        const map = this.maps[this.currentMapId];
        if (map.spawnTable && this.monsters.length < (map.maxMonsters || 5)) {
            if (Math.random() < 0.02) {
                const tmpl = map.spawnTable[Math.floor(Math.random() * map.spawnTable.length)];
                this.monsters.push({
                    name: tmpl.name, x: Math.random() * 550, y: Math.random() * 400,
                    hp: tmpl.hp, maxHp: tmpl.hp, exp: tmpl.exp,
                    spriteRow: tmpl.spriteRow, colOffset: tmpl.colOffset,
                    speed: 30 + Math.random() * 20,
                    moveTimer: 0
                });
            }
        }

        this.monsters.forEach(m => {
            const dist = Math.hypot(this.player.x - m.x, this.player.y - m.y);
            if (dist < 200) {
                const angle = Math.atan2(this.player.y - m.y, this.player.x - m.x);
                m.x += Math.cos(angle) * m.speed * dt;
                m.y += Math.sin(angle) * m.speed * dt;
            }
        });

        this.portals.forEach(p => {
            if (this.checkCollision({ x: this.player.x, y: this.player.y, w: 32, h: 32 }, p)) {
                if (p.reqLv && this.player.level < p.reqLv) {
                    this.showDamage(this.player.x, this.player.y, `Lv.${p.reqLv} 필요`, 'white');
                    this.player.y += 20;
                } else {
                    this.loadMap(p.target, p.targetX, p.targetY);
                }
            }
        });

        if (this.player.hp < this.player.maxHp * 0.3 && this.player.inventory.potions_hp > 0) {
            this.player.inventory.potions_hp--;
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + 50);
            this.updateHUD();
            this.log('자동 물약 사용!');
        }

        // Monster Attack logic
        this.monsters.forEach(m => {
            const dist = Math.hypot(this.player.x - m.x, this.player.y - m.y);
            if (dist < 30) {
                const dmg = (1 + Math.floor(m.exp / 10)); // Simple dmg based on monster power
                this.player.hp -= dmg * (dt * 10); // Continuous dmg while touching
                if (Math.random() < 0.05) { // Visual feedback occasionally
                    this.showDamage(this.player.x, this.player.y, Math.ceil(dmg), 'red');
                }
            }
        });

        if (this.player.hp <= 0) {
            this.player.hp = 0;
            this.updateHUD();
            this.gameState = 'gameover';
            alert('사망하셨습니다. 마을에서 부활합니다.');
            this.player.hp = this.player.maxHp * 0.5; // Revive with 50% HP
            this.player.exp = Math.max(0, this.player.exp - 50); // Penalty
            this.loadMap('town');
            this.gameState = 'playing';
            this.updateHUD();
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, 600, 450);

        const map = this.maps[this.currentMapId];

        // Tiles
        const ts = this.spriteSizes.tiles;
        const bgIdx = map.bgTile || 0;
        for (let r = 0; r < 15; r++) {
            for (let c = 0; c < 20; c++) {
                const u = (bgIdx % ts.cols) * ts.w;
                const v = Math.floor(bgIdx / ts.cols) * ts.h;
                this.ctx.drawImage(this.assets.tiles, u, v, ts.w, ts.h, c * 32, r * 32, 32, 32);
            }
        }

        // Objects
        if (map.objects) {
            map.objects.forEach(o => {
                const u = (o.tile % ts.cols) * ts.w;
                const v = Math.floor(o.tile / ts.cols) * ts.h;
                this.ctx.drawImage(this.assets.tiles, u, v, ts.w, ts.h, o.x, o.y, 32, 32);
            });
        }

        // Portals
        this.portals.forEach(p => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#fff';
            this.ctx.rect(p.x, p.y, p.w, p.h);
            this.ctx.stroke();
        });

        // NPCs
        const ns = this.spriteSizes.npc;
        this.npcs.forEach(n => {
            const u = (n.spriteIdx % ns.cols) * ns.w;
            const v = Math.floor(n.spriteIdx / ns.cols) * ns.h;
            this.ctx.drawImage(this.assets.npc, u, v, ns.w, ns.h, n.x, n.y, 32, 40);

            this.ctx.fillStyle = 'white';
            this.ctx.font = '10px sans-serif';
            this.ctx.fillText(n.name, n.x, n.y - 5);
        });

        // Monsters
        const ms = this.spriteSizes.monster;
        this.monsters.forEach(m => {
            // 2 frame anim (Idle, Move) + colOffset
            const frame = Math.floor(Date.now() / 500) % 2;
            const u = (m.colOffset + frame) * ms.w;
            const v = m.spriteRow * ms.h;
            this.ctx.drawImage(this.assets.monster, u, v, ms.w, ms.h, m.x, m.y, 32, 32);

            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(m.x, m.y - 5, 32, 3);
            this.ctx.fillStyle = 'lightgreen';
            this.ctx.fillRect(m.x, m.y - 5, 32 * (m.hp / m.maxHp), 3);
        });

        // Player
        const hs = this.spriteSizes.hero;
        let row = 0;
        if (this.player.job === 'mage') row = 1;
        if (this.player.job === 'archer') row = 2;

        let col = this.player.animFrame; // 0,1,2,3
        const u = col * hs.w;
        const v = row * hs.h;

        this.ctx.save();
        // Flip for left?
        if (this.player.dir === 1) {
            this.ctx.translate(this.player.x + 32, this.player.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.assets.hero, u, v, hs.w, hs.h, 0, 0, 32, 40);
        } else {
            this.ctx.drawImage(this.assets.hero, u, v, hs.w, hs.h, this.player.x, this.player.y, 32, 40);
        }
        this.ctx.restore();

        this.ctx.fillStyle = 'yellow';
        this.ctx.font = '12px sans-serif';
        this.ctx.fillText(this.player.name, this.player.x, this.player.y - 10);

        this.damageTexts.forEach((d, i) => {
            d.y -= 0.5;
            d.life -= 0.02;
            this.ctx.globalAlpha = d.life;
            this.ctx.fillStyle = d.color;
            this.ctx.font = 'bold 16px sans-serif';
            this.ctx.fillText(d.text, d.x, d.y);
            this.ctx.globalAlpha = 1;
            if (d.life <= 0) this.damageTexts.splice(i, 1);
        });
    }

    basicAttack() {
        this.player.animFrame = 3;
        setTimeout(() => this.player.animFrame = 0, 200);

        let hit = false;
        const cx = this.player.x + 16;
        const cy = this.player.y + 16;
        let dx = 0, dy = 0;
        if (this.player.dir === 0) dy = 40;
        if (this.player.dir === 1) dx = -40;
        if (this.player.dir === 2) dx = 40;
        if (this.player.dir === 3) dy = -40;

        // Weapon Stats
        let weaponDmg = 5;
        let range = 40;

        if (this.player.equipped.weapon) {
            const w = this.items[this.player.equipped.weapon];
            if (w) weaponDmg = w.dmg;
            // Archer range bonus
            if (this.player.job === 'archer') range = 120;
        }

        this.monsters.forEach((m, i) => {
            const mx = m.x + 16;
            const my = m.y + 16;
            if (Math.hypot((cx + dx) - mx, (cy + dy) - my) < range) {
                this.damageMonster(m, weaponDmg + this.player.level * 2, i);
                hit = true;
            }
        });
        if (hit) this.log('공격 적중!');
    }

    useSkill(key) {
        const skill = this.skills[key];
        if (!skill) return;
        if (this.player.level < skill.lv) {
            return this.log(`Lv.${skill.lv}에 사용 가능합니다.`);
        }
        if (this.player.mp < skill.mp) {
            return this.log('마력이 부족합니다.');
        }
        this.player.mp -= skill.mp;
        this.log(`${skill.name} 발동!`);
        this.updateHUD();

        if (skill.type === 'screen_aoe') {
            this.monsters.forEach((m, i) => this.damageMonster(m, 9999, i));
            this.showDamage(300, 200, "전체 공격!", "magenta");
        } else if (skill.type === 'heal') {
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + skill.amt);
            this.showDamage(this.player.x, this.player.y, `+${skill.amt}`, 'green');
        } else {
            this.monsters.forEach((m, i) => {
                const dist = Math.hypot(this.player.x - m.x, this.player.y - m.y);
                if (dist < (skill.radius || 150)) {
                    this.damageMonster(m, (10 + this.player.level) * (skill.dmg || 1), i);
                }
            });
        }
    }

    damageMonster(m, amt, idx) {
        m.hp -= amt;
        this.showDamage(m.x, m.y, amt, 'orange');
        if (m.hp <= 0) {
            this.monsters.splice(idx, 1);
            this.player.exp += m.exp;
            this.player.gold += m.exp; // Gold based on exp ~ strength

            // Drop System
            if (Math.random() < 0.3) { // 30% drop rate
                const lootTable = Object.values(this.items).filter(ac => ac.cost <= m.exp * 50); // Simple logic
                if (lootTable.length > 0) {
                    const item = lootTable[Math.floor(Math.random() * lootTable.length)];
                    this.log(`${item.name} 획득!`);
                    this.player.inventory.equipment.push(item.id);
                }
            }

            this.checkLevelUp();
            this.updateHUD();
        }
    }

    checkLevelUp() {
        if (this.player.exp >= this.player.maxExp) {
            this.player.level++;
            this.player.exp = 0;
            this.player.maxExp *= 1.2;
            this.player.maxHp += 20; this.player.maxMp += 10;
            this.player.hp = this.player.maxHp;
            this.showDamage(this.player.x, this.player.y, "LEVEL UP!", "yellow");
        }
    }

    interact() {
        const cx = this.player.x + 16;
        const cy = this.player.y + 16;
        for (let n of this.npcs) {
            if (Math.hypot(cx - (n.x + 16), cy - (n.y + 16)) < 50) {
                if (n.type === 'shop') {
                    this.openShop();
                } else alert(`${n.name}: ${n.text}`);
                return;
            }
        }
        this.basicAttack();
    }

    openShop() {
        const modal = document.getElementById('shop-modal');
        const grid = modal.querySelector('.shop-grid');
        grid.innerHTML = ''; // Clear existing

        // Add Potions
        this.addShopItem(grid, '체력회복제', 'HP 50 회복', 50, 'potion_hp', '💊');
        this.addShopItem(grid, '마력회복제', 'MP 50 회복', 50, 'potion_mp', '🧪');

        // Add Weapons based on player job
        Object.values(this.items).forEach(item => {
            if (item.job === this.player.job) {
                this.addShopItem(grid, item.name, `공격력 ${item.dmg}`, item.cost, item.id, '⚔️');
            }
        });

        modal.classList.remove('hidden');
    }

    addShopItem(container, name, desc, cost, id, icon) {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `
            <div class="item-icon">${icon}</div>
            <div class="item-info">
                <h3>${name}</h3>
                <p>${desc}</p>
                <span class="price">${cost}전</span>
            </div>
            <button class="buy-btn">구매</button>
        `;
        div.querySelector('.buy-btn').addEventListener('click', () => this.buyItem(id, cost));
        container.appendChild(div);
    }

    buyItem(id, cost) {
        if (this.player.gold >= cost) {
            this.player.gold -= cost;
            if (id === 'potion_hp') this.player.inventory.potions_hp++;
            else if (id === 'potion_mp') this.player.inventory.potions_mp++;
            else {
                // assume equipment
                this.player.inventory.equipment.push(id);
                // Auto equip? or just add. Let's auto equip if better? Simple: just push to inv
                // Currently no UI to equip from inv, so let's AUTO EQUIP for now
                this.equipItem(id);
                this.log(`${this.items[id].name} 장착 완료!`);
            }
            this.updateHUD();
            this.log('구매 완료');
        } else {
            this.log('돈이 부족합니다');
        }
    }

    equipItem(id) {
        this.player.equipped.weapon = id;
    }

    showDamage(x, y, text, color) { this.damageTexts.push({ x, y, text, color, life: 1.0 }); }
    log(msg) {
        const log = document.getElementById('game-log');
        const p = document.createElement('p'); p.textContent = msg;
        log.appendChild(p); log.scrollTop = log.scrollHeight;
    }
    checkCollision(r1, r2) {
        return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
    }
    updateHUD() {
        document.getElementById('hud-name').textContent = this.player.name;
        document.getElementById('hud-level-job').textContent = `Lv.${this.player.level} ${this.player.job}`;
        document.getElementById('bar-hp').style.width = (this.player.hp / this.player.maxHp) * 100 + '%';
        document.getElementById('text-hp').textContent = Math.floor(this.player.hp);
        document.getElementById('bar-mp').style.width = (this.player.mp / this.player.maxMp) * 100 + '%';
        document.getElementById('text-mp').textContent = Math.floor(this.player.mp);
        document.getElementById('bar-exp').style.width = (this.player.exp / this.player.maxExp) * 100 + '%';
        document.getElementById('text-exp').textContent = Math.floor((this.player.exp / this.player.maxExp) * 100) + '%';
        document.getElementById('hud-gold').textContent = this.player.gold;
        document.getElementById('inv-hp-pot').textContent = this.player.inventory.potions_hp;
        document.getElementById('inv-mp-pot').textContent = this.player.inventory.potions_mp;
    }
}

window.onload = () => window.game = new RPGGame();
