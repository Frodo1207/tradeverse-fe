import Phaser from 'phaser';

export default class BombGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BombGameScene' });
        this.MAP_W = 2048;
        this.MAP_H = 1024;
        this.terrainCtx = null;
        this.sprites = {};
        this.isAnimating = false;
        this.onAnimationComplete = null;
    }

    preload() {
        // Procedural textures (same as demo)
        let g = this.make.graphics({ x: 0, y: 0, add: false });

        // Player 1
        g.fillStyle(0x2196F3, 1); g.fillCircle(16, 16, 16); g.fillStyle(0x333333, 1); g.fillRect(4, 28, 24, 8);
        g.generateTexture('p1Tex', 32, 40);

        // Player 2
        g.clear(); g.fillStyle(0xF44336, 1); g.fillCircle(16, 16, 16); g.fillStyle(0x333333, 1); g.fillRect(4, 28, 24, 8);
        g.generateTexture('p2Tex', 32, 40);

        // Bullet
        g.clear(); g.fillStyle(0x333333, 1); g.fillCircle(5, 5, 5);
        g.generateTexture('bulletTex', 10, 10);

        // Cloud
        g.clear(); g.fillStyle(0xFFFFFF, 0.8); g.fillCircle(20, 20, 20); g.fillCircle(35, 15, 25); g.fillCircle(50, 20, 20);
        g.generateTexture('cloudTex', 70, 45);
    }

    create(data) {
        // Terrain
        const terrainTexture = this.textures.createCanvas('terrain', this.MAP_W, this.MAP_H);
        this.terrainCtx = terrainTexture.getSourceImage().getContext('2d');

        // Initial draw (if data provided, use it, otherwise draw default)
        if (data && data.terrainMask) {
            this.drawTerrainFromMask(this.terrainCtx, data.terrainMask, this.MAP_W, this.MAP_H);
        } else {
            this.drawInitialTerrain(this.terrainCtx, this.MAP_W, this.MAP_H);
        }
        terrainTexture.refresh();

        this.add.image(0, 0, 'terrain').setOrigin(0, 0);

        // Players
        const p1Data = data?.players?.p1 || { x: 200, y: 0 };
        const p2Data = data?.players?.p2 || { x: this.MAP_W - 300, y: 0 };

        this.sprites.p1 = this.add.sprite(p1Data.x, p1Data.y, 'p1Tex').setOrigin(0.5, 0.5);
        this.sprites.p2 = this.add.sprite(p2Data.x, p2Data.y, 'p2Tex').setOrigin(0.5, 0.5);
        this.sprites.p2.setFlipX(true);

        // Camera
        this.cameras.main.setBounds(0, 0, this.MAP_W, this.MAP_H);
        this.cameras.main.startFollow(this.sprites.p1, true, 0.08, 0.08);

        // Minimap
        // Note: Minimap positioning might need adjustment based on parent container size
        // For now, we'll skip complex minimap or hardcode it

        // Graphics for UI/Health
        this.healthGraphics = this.add.graphics();
        this.healthGraphics.setDepth(10);

        // Clouds
        for (let i = 0; i < 8; i++) {
            this.add.image(Phaser.Math.Between(0, this.MAP_W), Phaser.Math.Between(50, 300), 'cloudTex').setAlpha(0.5);
        }

        // Initial sync
        if (data) this.syncState(data);

        // Minimap Camera
        // Minimap Camera - Simplified
        const miniW = 200;
        const miniH = 100;
        const pad = 20;
        const gameW = this.sys.game.config.width;
        const miniX = gameW - miniW - pad;
        const miniY = pad;

        console.log('🗺️ Creating minimap at:', miniX, miniY, 'size:', miniW, 'x', miniH, 'gameW:', gameW);

        this.minimap = this.cameras.add(miniX, miniY, miniW, miniH);
        this.minimap.setZoom(0.1);
        this.minimap.setName('minimap');
        this.minimap.setBackgroundColor(0xFF0000); // Bright red for visibility test
        this.minimap.scrollX = this.MAP_W / 2;
        this.minimap.scrollY = this.MAP_H / 2;

        console.log('✅ Minimap created:', this.minimap);

        // Aim Line Graphics
        this.aimGraphics = this.add.graphics();
    }

    update() {
        this.drawHUD();
    }

    syncState(data) {
        this.stateData = data;
        console.log("📹 SyncState - Turn:", data.turn, "P1:", data.players.p1?.x, "P2:", data.players.p2?.x);

        if (this.sprites.p1 && data.players.p1) {
            this.tweens.add({
                targets: this.sprites.p1,
                x: data.players.p1.x,
                y: data.players.p1.y + 15,
                duration: 200
            });
        }
        if (this.sprites.p2 && data.players.p2) {
            this.tweens.add({
                targets: this.sprites.p2,
                x: data.players.p2.x,
                y: data.players.p2.y + 15,
                duration: 200
            });
        } else {
            console.warn("❌ P2 Sprite or Data missing", this.sprites.p2, data.players.p2);
        }

        // Camera Logic
        if (!this.isAnimating && data.turn) {
            const target = data.turn === 'p1' ? this.sprites.p1 : this.sprites.p2;
            console.log("🎥 Camera should follow:", data.turn, "Target exists:", !!target);
            if (target) {
                const camX = this.cameras.main.scrollX + this.cameras.main.width / 2;
                const camY = this.cameras.main.scrollY + this.cameras.main.height / 2;
                const dist = Phaser.Math.Distance.Between(camX, camY, target.x, target.y);
                console.log("📐 Distance to target:", dist, "Current cam:", camX, camY, "Target:", target.x, target.y);

                // 直接居中到目标位置
                console.log("⚡ Centering camera on", data.turn);
                this.cameras.main.stopFollow();
                this.cameras.main.centerOn(target.x, target.y);

                // 然后开始跟随（使用更快的 lerp）
                this.cameras.main.startFollow(target, true, 0.5, 0.5);
            }
        }
    }

    // Call this from React component to update aim line
    updateAimLine(playerId, power, angle, wind) {
        this.aimGraphics.clear();
        const sprite = this.sprites[playerId];
        if (!sprite) return;

        const startX = sprite.x;
        const startY = sprite.y;
        const length = 100; // Fixed length for direction indicator

        // Angle 0 is right, 90 is up (in our UI). 
        // In Phaser/Math, 0 is right, -90 is up.
        // So we negate the angle.
        const rad = -angle * (Math.PI / 180.0);

        const endX = startX + Math.cos(rad) * length;
        const endY = startY + Math.sin(rad) * length;

        this.aimGraphics.lineStyle(2, 0xffffff, 0.8);
        this.aimGraphics.beginPath();
        this.aimGraphics.moveTo(startX, startY);
        this.aimGraphics.lineTo(endX, endY);
        this.aimGraphics.strokePath();
    }

    drawInitialTerrain(ctx, w, h) {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#8BC34A';
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 10) {
            const y = (h * 0.7) + Math.sin(x * 0.005) * 100 + Math.sin(x * 0.02) * 20;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.fill();

        ctx.strokeStyle = '#558B2F';
        ctx.lineWidth = 10;
        ctx.stroke();
    }

    drawTerrainFromMask(ctx, mask, w, h) {
        // This is expensive to draw pixel by pixel from mask.
        // Better to rely on the backend's initial generation logic or just use the same generation function on client
        // For this demo port, we'll use the generation function to match backend
        this.drawInitialTerrain(ctx, w, h);
    }

    drawHUD() {
        if (!this.healthGraphics || !this.stateData) return;
        this.healthGraphics.clear();

        ['p1', 'p2'].forEach(key => {
            const p = this.stateData.players[key];
            const sprite = this.sprites[key];
            if (!sprite || !p || p.hp <= 0) return;

            const x = sprite.x - 25;
            const y = sprite.y - 65;

            // HP
            this.healthGraphics.fillStyle(0x333333); this.healthGraphics.fillRect(x, y, 50, 6);
            this.healthGraphics.fillStyle(p.hp > 50 ? 0x4CAF50 : 0xF44336); this.healthGraphics.fillRect(x + 1, y + 1, 48 * (p.hp / 100), 4);
            // Fuel
            this.healthGraphics.fillStyle(0x333333); this.healthGraphics.fillRect(x, y + 8, 50, 4);
            this.healthGraphics.fillStyle(0x2196F3); this.healthGraphics.fillRect(x + 1, y + 9, 48 * (p.fuel / 100), 2);
        });
    }

    animateShot(data, onComplete) {
        this.isAnimating = true;
        this.onAnimationComplete = onComplete;

        // Create bullet
        const start = data.path[0];
        const bullet = this.add.image(start.x, start.y, 'bulletTex');
        this.cameras.main.startFollow(bullet, true, 0.1, 0.1);

        // Trail
        const trailGraphics = this.add.graphics();
        trailGraphics.lineStyle(2, 0xffffff, 0.6);
        trailGraphics.beginPath();
        trailGraphics.moveTo(start.x, start.y);

        let step = 0;
        const totalSteps = data.path.length;

        const animTimer = this.time.addEvent({
            delay: 15,
            loop: true,
            callback: () => {
                if (step >= totalSteps) {
                    animTimer.remove();
                    bullet.destroy();

                    this.tweens.add({
                        targets: trailGraphics,
                        alpha: 0,
                        duration: 2000,
                        onComplete: () => trailGraphics.destroy()
                    });

                    this.playExplosion(data);
                    return;
                }

                const p = data.path[step];
                bullet.setPosition(p.x, p.y);
                trailGraphics.lineTo(p.x, p.y);
                trailGraphics.strokePath();
                step++;
            }
        });
    }

    playExplosion(data) {
        const { x, y, radius } = data.explosion;

        // Particles
        const p = this.add.particles(x, y, 'bulletTex', {
            speed: { min: 50, max: 200 },
            scale: { start: 1, end: 0 },
            lifespan: 500,
            quantity: 20,
            tint: 0xFF5722
        });
        this.cameras.main.shake(200, 0.01);

        // Update Terrain
        this.terrainCtx.globalCompositeOperation = 'destination-out';
        this.terrainCtx.beginPath();
        this.terrainCtx.arc(x, y, radius, 0, Math.PI * 2, false);
        this.terrainCtx.fill();
        this.terrainCtx.globalCompositeOperation = 'source-over';
        this.textures.get('terrain').refresh();

        // Show Damage
        if (data.damages) {
            data.damages.forEach(d => {
                const targetSprite = d.targetId === 'p1' ? this.sprites.p1 : this.sprites.p2;
                const txt = this.add.text(targetSprite.x, targetSprite.y - 50, `-${d.dmg}`, { fontSize: '32px', fill: '#f00', fontStyle: 'bold' }).setOrigin(0.5);
                this.tweens.add({ targets: txt, y: txt.y - 50, alpha: 0, duration: 1000, onComplete: () => txt.destroy() });
            });
        }

        // Finish
        this.time.delayedCall(1000, () => {
            p.destroy();
            this.isAnimating = false;

            // 恢复镜头到当前回合的玩家
            if (this.stateData && this.stateData.turn) {
                const target = this.stateData.turn === 'p1' ? this.sprites.p1 : this.sprites.p2;
                if (target) {
                    console.log("🎬 Animation done, restoring camera to", this.stateData.turn);
                    this.cameras.main.stopFollow();
                    this.cameras.main.centerOn(target.x, target.y);
                    this.cameras.main.startFollow(target, true, 0.5, 0.5);
                }
            }

            if (this.onAnimationComplete) this.onAnimationComplete();
        });
    }
}
