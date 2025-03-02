class Weapon {
    constructor() {
        this.damage = 25;
        this.projectileSpeed = 500;
        this.fireRate = 250; // ms between shots
        this.lastShot = 0;
    }

    shoot(x, y, angle, projectiles) {
        const currentTime = Date.now();
        if (currentTime - this.lastShot >= this.fireRate) {
            projectiles.push(new Projectile(x, y, angle, this.projectileSpeed, this.damage));
            this.lastShot = currentTime;
        }
    }
}

class Projectile {
    constructor(x, y, angle, speed, damage) {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;
        this.speed = speed;
        this.damage = damage;
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
    }

    update(deltaTime) {
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
    }

    draw(ctx) {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, 
                    this.width, this.height);
    }

    isActive(canvas) {
        return this.x >= 0 && this.x <= canvas.width &&
               this.y >= 0 && this.y <= canvas.height;
    }
}
