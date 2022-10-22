export { Sprite };

class Sprite {
    constructor(argument) {
        this.image = new Image();
        this.isLoaded = false;
        this.image.onload = () => (this.isLoaded = true);
        this.animations = argument.animations || {
            0: {
                imageSrc: '',
                maxFrames: 1,
                holdFrames: 5,
            },
        };
        this.state = argument.state || 0;
        this.image.src = Object.values(this.animations)[this.state].imageSrc;
        this.frames = {
            current: 0,
            elapsed: 0,
        };
        this.position = argument.position || { x: 0, y: 0 };
        this.image.width /= Object.values(this.animations)[this.state].maxFrames;
        this.scaled = {
            width: this.image.width * (argument.scaleFactor || 1),
            height: this.image.height * (argument.scaleFactor || 1),
        };
        this.hitbox = {
            width: this.scaled.width * (argument.hitboxWidthRatio || 1),
            height: this.scaled.height * (argument.hitboxHeightRatio || 1),
            offset: {
                x: argument.hitboxOffsetX || 0,
                y: argument.hitboxOffsetY || 0,
            },
        };
        this.frame = 0;
    }
    animate() {
        this.framePosition =
            Math.floor(this.frames.elapsed / Object.values(this.animations)[this.state].holdFrames) %
            Object.values(this.animations)[this.state].maxFrames;
        this.frames.current = this.image.width * this.framePosition;
        this.frames.elapsed++;
    }

    movingBackground(context) {
        context.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            this.position.x,
            this.position.y,
            this.scaled.width,
            this.scaled.height
        );
        context.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            this.position.x + this.scaled.width,
            this.position.y,
            this.scaled.width,
            this.scaled.height
        );
        this.position.x = (this.frame * 7) % this.scaled.width;
        this.frame--;
    }
    draw(context, posX, posY) {
        // -------------Hitbox----------
        context.fillStyle = 'hsl(50 50% 50%)';
        context.fillRect(
            posX + this.hitbox.offset.x,
            posY + this.hitbox.offset.y,
            this.hitbox.width,
            this.hitbox.height
        );
        context.drawImage(
            this.image,
            this.frames.current,
            0,
            this.image.width,
            this.image.height,
            posX,
            posY,
            this.scaled.width,
            this.scaled.height
        );
    }
}
