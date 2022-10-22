import { Entity } from './entity.mjs';
import { Sprite } from './sprite.mjs';

/** @type {HTMLCanvasElement} */

class Game {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = innerWidth * 0.9;
        this.canvas.height = innerHeight * 0.9;

        this.bg = new Sprite({
            position: {
                x: 0,
                y: -this.canvas.height * 1.98,
            },
            scaleFactor: this.canvas.height * 0.004,
            animations: {
                0: {
                    imageSrc: 'bg_trans.png',
                    maxFrames: 1,
                    holdFrames: 0,
                },
            },
        });

        this.player = new Entity({
            bottomOffset: this.canvas.height * 0.05,
            hitboxWidthRatio: 0.3,
            hitboxHeightRatio: 0.8,
            hitboxOffsetX: 65,
            hitboxOffsetY: 40,
            scaleFactor: this.canvas.height * 0.005,
            state: 1,
            animations: {
                idle: {
                    imageSrc: 'idle.png',
                    maxFrames: 6,
                    holdFrames: 6,
                },
                run: {
                    imageSrc: 'run.png',
                    maxFrames: 8,
                    holdFrames: 5,
                },
            },
        });

        setTimeout(() => {
            if (!this.player.isLoaded || !this.bg.isLoaded) location.reload();
        }, 10);
        if (this.player.isLoaded && this.bg.isLoaded) {
            clearTimeout();
        }
    }

    run = () => {
        requestAnimationFrame(this.run);
        this.context.fillStyle = 'hsl(0 0% 0%/0.4)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.bg.movingBackground(this.context);
        this.player.update(this.context, this.canvas.width, this.canvas.height);
    };
}

const game = new Game();
game.run();
