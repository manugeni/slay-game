class Weapon {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.damage = 25;
        this.projectileSpeed = 500;
        this.fireRate = 250;
        this.lastShot = 0;
        this.recoil = 0.2;
        this.recoilRecovery = 0.1;
        this.currentRecoil = 0;
        
        this.setupWeaponModel();
    }

    setupWeaponModel() {
        // Create weapon mesh
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);
        const material = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.8,
            roughness: 0.2
        });
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Position weapon
        this.defaultPosition = new THREE.Vector3(0.3, -0.2, -0.5);
        this.mesh.position.copy(this.defaultPosition);
        
        // Add muzzle flash light
        this.muzzleFlash = new THREE.PointLight(0xffff00, 0, 3);
        this.muzzleFlash.position.set(0.3, -0.2, -1);
        
        this.camera.add(this.mesh);
        this.camera.add(this.muzzleFlash);
    }

    shoot(projectiles) {
        const currentTime = Date.now();
        if (currentTime - this.lastShot < this.fireRate) return false;

        // Create projectile
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        
        // Add spread based on recoil
        direction.x += Utils.randomFloat(-this.currentRecoil, this.currentRecoil);
        direction.y += Utils.randomFloat(-this.currentRecoil, this.currentRecoil);
        
        const projectile = new Projectile(
            this.camera.position.clone(),
            direction,
            this.scene,
            this.projectileSpeed,
            this.damage
        );
        
        projectiles.push(projectile);
        this.lastShot = currentTime;

        // Apply recoil
        this.applyRecoil();
        
        // Muzzle flash effect
        this.muzzleFlash.intensity = 2;
        setTimeout(() => {
            this.muzzleFlash.intensity = 0;
        }, 50);

        return true;
    }

    applyRecoil() {
        this.currentRecoil = Math.min(this.currentRecoil + this.recoil, 0.5);
        
        // Visual recoil animation
        gsap.to(this.mesh.position, {
            z: this.defaultPosition.z + 0.2,
            y: this.defaultPosition.y + 0.05,
            duration: 0.05,
            yoyo: true,
            repeat: 1
        });
    }

    update(deltaTime) {
        // Recover from recoil
        this.currentRecoil = Math.max(0, this.currentRecoil - this.recoilRecovery * deltaTime);
    }
}

class Projectile {
    constructor(position, direction, scene, speed, damage) {
        this.position = position;
        this.direction = direction;
        this.scene = scene;
        this.speed = speed;
        this.damage = damage;
        this.alive = true;
        this.lifeTime = 3000; // milliseconds
        this.createdAt = Date.now();

        this.createProjectile();
    }

    createProjectile() {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        
        // Add point light to projectile
        this.light = new THREE.PointLight(0xffff00, 1, 3);
        this.mesh.add(this.light);
        
        this.scene.add(this.mesh);
    }

    update(deltaTime) {
        if (!this.alive) return;

        // Move projectile
        this.mesh.position.x += this.direction.x * this.speed * deltaTime;
        this.mesh.position.y += this.direction.y * this.speed * deltaTime;
        this.mesh.position.z += this.direction.z * this.speed * deltaTime;

        // Check lifetime
        if (Date.now() - this.createdAt > this.lifeTime) {
            this.destroy();
        }
    }

    destroy() {
        this.alive = false;
        this.scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }

    checkCollision(target) {
        return this.mesh.position.distanceTo(target.position) < 1;
    }
}
