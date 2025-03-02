class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.clock = new THREE.Clock();
        this.stats = new Stats();
        
        this.init();
        this.setupEnvironment();
        this.setupLighting();
        this.setupPlayer();
        this.setupEnemies();
        this.addEventListeners();
        
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(this.stats.dom);

        // Setup scene fog for atmosphere
        this.scene.fog = new THREE.FogExp2(0x000000, 0.02);
    }

    setupEnvironment() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add random obstacles
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.BoxGeometry(2, Math.random() * 3 + 1, 2);
            const material = new THREE.MeshStandardMaterial({
                color: 0x666666,
                roughness: 0.7,
                metalness: 0.3
            });
            const obstacle = new THREE.Mesh(geometry, material);
            obstacle.position.x = Math.random() * 80 - 40;
            obstacle.position.z = Math.random() * 80 - 40;
            obstacle.position.y = geometry.parameters.height / 2;
            obstacle.castShadow = true;
            obstacle.receiveShadow = true;
            this.scene.add(obstacle);
        }
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 200, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);

        // Point lights for atmosphere
        const colors = [0xff0000, 0x00ff00, 0x0000ff];
        colors.forEach((color, i) => {
            const light = new THREE.PointLight(color, 1, 50);
            light.position.set(
                Math.cos(i * Math.PI * 2 / 3) * 30,
                10,
                Math.sin(i * Math.PI * 2 / 3) * 30
            );
            this.scene.add(light);
        });
    }

    setupPlayer() {
        this.player = new Player(this.camera, this.scene);
        this.camera.position.y = 2;
    }

    setupEnemies() {
        this.enemies = [];
        this.lastEnemySpawn = 0;
        this.enemySpawnInterval = 2000;
    }

    spawnEnemy() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 40;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        
        const enemy = new Enemy(x, z, this.scene);
        this.enemies.push(enemy);
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('click', () => {
            if (!this.player.controls.isLocked) {
                this.player.controls.lock();
            } else {
                this.player.shoot();
            }
        });
    }

    updateEnemies(deltaTime) {
        const currentTime = Date.now();
        if (currentTime - this.lastEnemySpawn > this.enemySpawnInterval) {
            this.spawnEnemy();
            this.lastEnemySpawn = currentTime;
        }

        this.enemies = this.enemies.filter(enemy => {
            enemy.update(deltaTime, this.player.camera.position);
            return !enemy.isDead;
        });
    }

    checkCollisions() {
        // Check projectile hits
        this.player.projectiles.forEach(projectile => {
            this.enemies.forEach(enemy => {
                if (projectile.position.distanceTo(enemy.mesh.position) < 1) {
                    enemy.takeDamage(25);
                    projectile.hit = true;
                    if (enemy.isDead) {
                        this.player.score += 100;
                        document.getElementById('scoreValue').textContent = this.player.score;
                    }
                }
            });
        });

        // Check enemy collisions with player
        this.enemies.forEach(enemy => {
            if (enemy.mesh.position.distanceTo(this.player.camera.position) < 2) {
                this.player.takeDamage(10);
                enemy.isDead = true;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        this.stats.begin();
        
        this.player.update(deltaTime);
        this.updateEnemies(deltaTime);
        this.checkCollisions();
        
        this.renderer.render(this.scene, this.camera);
        
        this.stats.end();
    }
}

// Start the game when the window loads
window.onload = () => {
    new Game();
};
