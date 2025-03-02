class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.player = new Player(
            this.canvas.width / 2,
            this.canvas.height / 2
        );
        
        this.enemies = [];
        this.gameLoop = this.gameLoop.bind(this);
        this.lastTime = 0;
        this.enemySpawnInterval = 2000; // ms
        this.lastEnemySpawn = 0;
        
        this.setupEventListeners();
        this.start();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.player.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.player.handleKeyUp(e));
        this.canvas.addEventListener('click', (e) => this.player.shoot(e, this.canvas));
    }

    spawnEnemy() {
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x, y;
        
        switch(side) {
            case 0: // top
                x = Math.random() * this.canvas.width;
                y = -20;
                break;
            case 1: // right
                x = this.canvas.width + 20;
                y = Math.random() * this.canvas.height;
                break;
            case 2: // bottom
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + 20;
                break;
            case 3: // left
                x = -20;
                y = Math.random() * this.canvas.height;
                break;
        }

        this.enemies.push(new Enemy(x, y));
    }

    start() {
        requestAnimationFrame(this.gameLoop);
    }

    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Spawn enemies
        if (currentTime - this.lastEnemySpawn > this.enemySpawnInterval) {
            this.spawnEnemy();
            this.lastEnemySpawn = currentTime;
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw player
        this.player.update(deltaTime, this.canvas);
        this.player.draw(this.ctx);

        // Update and draw enemies
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(deltaTime, this.player);
            enemy.draw(this.ctx);
            return !enemy.isDead;
        });

        // Check collisions
        this.checkCollisions();

        // Update UI
        document.getElementById('healthValue').textContent = this.player.health;
        document.getElementById('scoreValue').textContent = this.player.score;

        if (this.player.health > 0) {
            requestAnimationFrame(this.gameLoop);
        } else {
            alert('Game Over! Your score: ' + this.player.score);
        }
    }

    checkCollisions() {
        // Check player projectiles with enemies
        this.player.projectiles = this.player.projectiles.filter(projectile => {
            let projectileHit = false;
            
            this.enemies.forEach(enemy => {
                if (this.detectCollision(projectile, enemy)) {
                    enemy.takeDamage(projectile.damage);
                    if (enemy.health <= 0) {
                        enemy.isDead = true;
                        this.player.score += 100;
                    }
                    projectileHit = true;
                }
            });

            return !projectileHit;
        });

        // Check enemy collision with player
        this.enemies.forEach(enemy => {
            if (this.detectCollision(this.player, enemy)) {
                this.player.takeDamage(10);
                enemy.isDead = true;
            }
        });
    }

    detectCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
}

// Start the game when the window loads
window.onload = () => {
    new Game();
};
