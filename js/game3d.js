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
        this.setupGround();
        this.setupSkybox();
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

    setupGround() {
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        this.scene.add(ground);
    }

    setupSkybox() {
        const path = 'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/';
        const format = '.jpg';
        const urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];

        const reflectionCube = new THREE.CubeTexture
