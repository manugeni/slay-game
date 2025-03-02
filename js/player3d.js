class Player {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.health = 100;
        this.score = 0;
        this.ammo = 30;
        this.maxAmmo = 30;
        this.reloadTime = 2000;
        this.isReloading = false;
        this.projectiles = [];
        
        this.setupControls();
        this.setupWeapon();
        this.updateUI();
    }

    setupControls() {
        this.controls = new THREE.PointerLockControls(this.camera, document.body);
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = true;
        this.velocity = new THREE.Vector3();

        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    setupWeapon() {
        // Create weapon model
        const weaponGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.5);
        const weaponMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
        this.weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
        
        // Position weapon in front of camera
        this.weapon.position.set(0.3, -0.2, -0.5);
        this.camera.add(this.weapon);
        this.scene.add(this.camera);
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;
            case 'Space':
                if (this.canJump) {
                    this.velocity.y += 350;
                    this.canJump = false;
                }
                break;
            case 'KeyR':
                this.reload();
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;
        }
    }

    shoot() {
        if (this.isReloading || this.ammo <= 0) {
            if (this.ammo <= 0) this.reload();
            return;
        }

        const projectile = new Projectile(
            this.camera.position.clone(),
            this.camera.getWorldDirection(new THREE.Vector3()),
            this.scene
        );
        this.projectiles.push(projectile);
        this.ammo--;
        this.updateUI();

        // Weapon recoil animation
        gsap.to(this.weapon.position, {
            z: -0.3,
            duration: 0.05,
            yoyo: true,
            repeat: 1
        });
    }

    reload() {
        if (this.isReloading || this.ammo === this.maxAmmo) return;
        
        this.isReloading = true;
        document.getElementById('ammoValue').textContent = 'Reloading...';
        
        setTimeout(() => {
            this.ammo = this.maxAmmo;
            this.isReloading = false;
            this.updateUI();
        }, this.reloadTime);
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        this.updateUI();
        
        if (this.health <= 0) {
            alert(`Game Over! Final Score: ${this.score}`);
