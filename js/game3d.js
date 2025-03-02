import Player3D from './player3d.js';
import Enemy3D from './enemy3d.js';
import Weapons3D from './weapons3d.js';

class Game3D {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.player = new Player3D(this.scene);
        this.enemies = [];
        this.weapons = new Weapons3D(this.scene);

        this.camera.position.z = 10;

        this.setupLighting();
        this.setupEventListeners();

        this.animate = this.animate.bind(this);
        this.animate();
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                this.weapons.shoot(this.player.mesh.position);
            }
        });
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.controls.update();
        this.updateEnemies();
        this.weapons.update();
        this.renderer.render(this.scene, this.camera);
    }

    addEnemy() {
        const enemy = new Enemy3D(this.scene);
        this.enemies.push(enemy);
    }

    updateEnemies() {
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if (enemy.mesh.position.z > 10) {
                this.scene.remove(enemy.mesh);
                this.enemies.splice(index, 1);
            }
        });
    }
}

const game = new Game3D();

// Add enemies periodically
setInterval(() => {
    game.addEnemy();
}, 2000);

// In game3d.js, add the following method
setupGround() {
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    this.scene.add(ground);
}

// Call setupGround in the constructor
constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    this.player = new Player3D(this.scene);
    this.enemies = [];
    this.weapons = new Weapons3D(this.scene);

    this.camera.position.z = 10;

    this.setupLighting();
    this.setupGround();
    this.setupEventListeners();

    this.animate = this.animate.bind(this);
    this.animate();
}
