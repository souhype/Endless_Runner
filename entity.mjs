import { Sprite } from './sprite.mjs';
export { Entity };

class Entity extends Sprite {
    constructor(argument) {
        super(argument);
        this.position = argument.position || { x: 0, y: 0 };
        this.velocity = argument.velocity || { x: 0, y: 0 };
        this.speed = argument.speed || 2.5;
        this.horizontalFriction = argument.horizontalFriction || 0.9;
        this.verticalFriction = argument.verticalFriction || 0.97;
        this.gravity = argument.gravity || 2;
        this.jumpForce = argument.jumpForce || 40;
        this.floatForce = argument.floatForce || 0.6;
        this.dashForce = argument.dashForce || 20;
        this.timingBuffer = argument.timingBuffer || 300;
        this.jumpCount = 0;
        this.onGround = true;
        this.timePressedLeft = 0;
        this.timePressedRight = 0;
        this.keyBindings = {
            left: argument.leftKey || 'a',
            right: argument.rightKey || 'd',
            jump: argument.jumpKey || 'w',
            crouch: argument.crouchKey || 's',
            float: argument.floatKey || ' ',
        };
        this.keyPressed = {
            left: false,
            right: false,
            jump: false,
            crouch: false,
            float: false,
        };
        this.bottomOffset = argument.bottomOffset || 50;
    }

    input() {
        onkeydown = event => {
            if (event.key === this.keyBindings.right) {
                this.dashright();
                this.keyPressed.right = true;
            }
            if (event.key === this.keyBindings.left) {
                this.dashleft();
                this.keyPressed.left = true;
            }
            if (
                event.key === this.keyBindings.jump &&
                this.jumpCount < 2 &&
                !this.keyPressed.jump &&
                !this.keyPressed.crouch &&
                !this.keyPressed.float
            ) {
                this.velocity.y = -this.jumpForce;
                this.jumpCount++;
                this.keyPressed.jump = true;
            }
            if (event.key === this.keyBindings.crouch) this.keyPressed.crouch = true;
            if (event.key === this.keyBindings.float) this.keyPressed.float = true;
        };
        onkeyup = event => {
            if (event.key === this.keyBindings.right) this.keyPressed.right = false;
            if (event.key === this.keyBindings.left) this.keyPressed.left = false;
            if (event.key === this.keyBindings.jump) this.keyPressed.jump = false;
            if (event.key === this.keyBindings.crouch) this.keyPressed.crouch = false;
            if (event.key === this.keyBindings.float) this.keyPressed.float = false;
        };
    }

    dashleft() {
        this.timePressedLeft;
        let now = new Date().getTime();
        let delta = now - this.timePressedLeft;
        if (delta > 0 && delta < this.timingBuffer && !this.keyPressed.left)
            this.velocity.x = -this.speed * this.dashForce;
        this.timePressedLeft = new Date().getTime();
    }

    dashright() {
        this.timePressedRight;
        let now = new Date().getTime();
        let delta = now - this.timePressedRight;
        if (delta > 0 && delta < this.timingBuffer && !this.keyPressed.right)
            this.velocity.x = this.speed * this.dashForce;
        this.timePressedRight = new Date().getTime();
    }

    float() {
        if (this.keyPressed.float && !this.keyPressed.jump && !this.keyPressed.crouch)
            this.velocity.y *= this.floatForce;
        else this.velocity.y *= this.verticalFriction;
    }

    crouch() {
        if (this.keyPressed.crouch && !this.keyPressed.jump) {
            if (!this.onGround && !this.keyPressed.float) this.velocity.y = this.jumpForce;
        }
    }

    move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x *= this.horizontalFriction;
        this.velocity.y *= this.verticalFriction;

        if (this.keyPressed.right) {
            this.velocity.x += this.speed;
        }

        if (this.keyPressed.left) {
            this.velocity.x -= this.speed;
        }
    }

    collision(width, height) {
        if (this.position.y + this.hitbox.offset.y + this.hitbox.height >= height - this.bottomOffset) {
            this.position.y = height - this.hitbox.height - this.hitbox.offset.y - this.bottomOffset;
            this.jumpCount = 0;
            this.onGround = true;
        } else {
            this.velocity.y += this.gravity;
            this.onGround = false;
        }

        if (this.position.x + this.hitbox.offset.x < 0) this.position.x = -this.hitbox.offset.x;
        else if (this.position.x + this.hitbox.offset.x + this.hitbox.width > width)
            this.position.x = width - this.hitbox.width - this.hitbox.offset.x;
    }

    update(context, width, height) {
        this.input();
        this.crouch();
        this.float();
        this.move();
        this.collision(width, height);
        this.animate();
        this.draw(context, this.position.x, this.position.y);
    }
}
