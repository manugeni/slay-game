class Enemy {
    constructor(position, scene, type = 'normal') {
        this.scene = scene;
        this.type = type;
        this.position = position;
        this.health = this.getInitialHealth();
        this.speed = this.getSpeed();
        this.damage = this.getDamage();
        this.points = this.getPoints();
        this.alive = true;

        this.createEnemy();
    }

    getInitialHealth() {
        switch(this.type) {
            case 'elite': return 100;
            case 'boss': return 500;
            default: return 50;
        }
    }

    getSpeed() {
        switch(this.type) {
            case 'elite': return 8;
            case 'boss': return 4;
            default: return 6;
        }
    }

    getDamage() {
        switch(this.type) {
            case 'elite': return 20;
            case 'boss': return 40;
            default: return 10;
        }
    }

    getPoints() {
        switch(this.type) {
            case 'elite': return 200;
            case 'boss': return 1000;
            default: return 100;
        }
    }

    createEnemy() {
        // Create enemy mesh based on type
        const geometry = this.type === 'boss' 
            ? new THREE.BoxGeometry(2, 2, 2)
            : new THREE.BoxGeometry(1, 1, 1);

        const material = new THREE.MeshStandardMaterial({
            color: this.getEnemyColor(),
            metalness: 0.7,
            roughness: 0.3,
            emissive: this.getEnemyColor(),
            emissiveIntensity: 0.2
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // Add health bar
        this.createHealthBar();

        this.scene.add(this.mesh);
    }

    getEnemyColor() {
        switch(this.type) {
            case 'elite': return 0xff0000;
            case 'boss': return 0xff00ff;
            default: return 0x8B0000;
        }
    }

    createHealthBar() {
        const healthBarGeometry = new THREE.PlaneGeometry(1.5, 0.2);
        const healthBarMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        });
        
        this.healthBar = new THREE.Mesh(healthBarGeometry, healthBarMaterial);
        this.healthBar.position.y = 1.5;
        this.mesh.add(this.healthBar);
    }

    update(deltaTime, playerPosition) {
        if (!this.alive) return;

        // Calculate direction to player
        const direction = new THREE.Vector3()
            .subVectors(playerPosition, this.mesh.position)
            .normalize();

        // Move towards player
        this.mesh.position.add(
            direction.multiplyScalar(this.speed * deltaTime)
        );

        // Update health bar
        this.updateHealthBar();

        // Look at player
        this.mesh.lookAt(playerPosition);
    }

    updateHealthBar() {
        const healthPercent = this.health / this.getInitialHealth();
        this.healthBar.scale.x = Math.max(0, healthPercent);
        this.healthBar.material.color.setHSL(
            healthPercent * 0.3, // Hue (red to green)
            1,                   // Saturation
            0.5                  // Lightness
        );
    }

    takeDamage(amount) {
        this.health -= amount;
        
        // Hit effect
        gsap.to(this.mesh.material, {
            emissiveIntensity: 1,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.alive = false;
        
        // Death animation
        gsap.to(this.mesh.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "back.in",
            onComplete: () => {
                this.scene.remove(this.mesh);
                this.mesh.geometry.dispose();
                this.mesh.material.dispose();
            }
        });
    }
}
