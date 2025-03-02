class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 300;
        this.health = 100;
        this.score = 0;
        this.projectiles = [];
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.weapon = new Weapon();
    }

    handleKeyDown(e) {
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.movement.up = true;
                break;
            case 's':
            case 'arrowdown':
                this.movement.down = true;
                break;
            case 'a':
            case 'arrowleft':
                this.movement.left = true;
                break;
            case 'd':
            case 'arrowright':
                this.movement.right = true;
                break;
        }
    }

    handleKeyUp(e) {
        switch(e.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.movement.up = false;
                break;
            case 's':
            case 'arrowdown':
                this.movement.down = false;
                break;
            case 'a':
            case 'arrowleft':
                this.movement.left = false;
                break;
            case 'd':
            case 'arrowright':
                this.movement.right = false;
                break;
        }
    }

    shoot(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const angle = Math.atan2(mouseY - (this.y + this.height/2), 
                               mouseX - (this.x + this.width/2));
        
        this.weapon.shoot(this.x + this.width/2, this.y + this.height/2, angle, this.projectiles);
    }

    update(deltaTime, canvas) {
        // Update position based on movement
        if (this.movement.up) this.y -= this.speed * deltaTime;
        if (this.movement.down) this.y += this.speed * deltaTime;
        if (this.movement.left) this.x -= this.speed * deltaTime;
        if (this.movement.right) this.x += this.speed * deltaTime;

        // Keep player in bounds
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));

        // Update projectiles
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update(deltaTime);
            return projectile.isActive(canvas);
        });
    }

    draw(ctx) {
        // Draw player
        ctx.fillStyle = '#ff3434';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw projectiles
        this.projectiles.forEach(projectile => projectile.draw(ctx));
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }
}
