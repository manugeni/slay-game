class Player {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.health = 100;
        this.maxHealth = 100;
        this.score = 0;
        this.moveSpeed = 10;
        this.sprintSpeed = 15;
        this.currentSpeed = this.moveSpeed;
        this.jumpForce = 15;
        this.gravity = -30;
        this.velocity = new THREE.Vector3();
        this.jumping = false;
        
        this.setupControls();
        this.weapon = new Weapon(scene, camera);
        this.projectiles = [];
    }

    setupControls() {
        this.controls = new THREE.PointerLockControls(this.camera, document.body);
        
        this.movement = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            sprint: false
        };

        // Event listeners
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('click', () => this.onClick());
        
        // Lock pointer on canvas click
        document.addEventListener('click', () => {
            if (!this.controls.isLocked) {
                this.controls.lock();
            }
        });
    }

    onKeyDown(event) {
        switch(event.code) {
            case 'KeyW': this.movement.forward = true; break;
            case 'KeyS': this.movement.backward = true; break;
            case 'KeyA': this.movement.left = true; break;
            case 'KeyD': this.movement.right = true; break;
            case 'Space': 
                if (!this.jumping) {
                    this.jump();
                }
                break;
            case 'ShiftLeft':
                this.movement.sprint = true;
                this.currentSpeed = this.sprintSpeed;
                break;
            case 'KeyR':
                this.weapon.reload();
                break;
        }
    }

    onKeyUp(event) {
        switch(event.code) {
            case 'KeyW': this.movement.forward = false; break;
            case 'KeyS': this.movement.backward = false; break;
            case 'KeyA': this.movement.left = false; break;
            case 'KeyD': this.movement.right = false; break;
            case 'ShiftLeft':
                this.movement.sprint = false;
                this.currentSpeed = this.moveSpeed;
                break;
        }
    }

    onClick() {
        if (this.controls.isLocked) {
            const shot = this.weapon.shoot(this.projectiles);
            if (shot) {
                // Camera recoil effect
                gsap.to(this.camera.rotation, {
                    x: `-=${0.02}`,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            }
        }
    }

    jump() {
        if (!this.jumping) {
            this.velocity.y = this.jumpForce;
            this.jumping = true;
        }
    }

    update(deltaTime) {
        if (!this.controls.isLocked) return;

        // Update movement
        const direction = new THREE.Vector3();
        
        if (this.movement.forward) direction.z -= 1;
        if (this.movement.backward) direction.z += 1;
        if (this.movement.left) direction.x -= 1;
        if (this.movement.right) direction.x += 1;

        direction.normalize();
        
        // Apply movement in camera direction
        if (direction.z !== 0) {
            this.velocity.x += direction.z * Math.sin(this.camera.rotation.y) * this.currentSpeed;
            this.velocity.z += direction.z * Math.cos(this.camera.rotation.y) * this.currentSpeed;
        }
        if (direction.x !== 0) {
            this.velocity.x += direction.x * Math.cos(this.camera.rotation.y) * this.currentSpeed;
            this.
