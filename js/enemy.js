class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 150;
        this.health = 50;
        this.isDead = false;
    }

    update(deltaTime, player) {
        // Move towards player
        const angle = Math.atan2(
            player.y + player.height/2 - (this.y + this.height/2),
            player.x + player.width/2 - (this.x + this.width/2)
        );

        this.x += Math.cos(angle) * this.speed * deltaTime;
        this.y += Math.sin(angle) * this.speed * deltaTime;
    }

    draw(ctx) {
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw health bar
        const healthBarWidth = this.width;
        const healthBarHeight = 5;
        const healthPercentage = this.health / 50;

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(
            this.x,
            this.y - healthBarHeight - 2,
            healthBarWidth * healthPercentage,
            healthBarHeight
        );
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        }
    }
}
