import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';

class Player3D {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;

        const loader = new GLTFLoader();
        loader.load('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(0.5, 0.5, 0.5);
            this.mesh.position.set(0, 0, 0);
            this.scene.add(this.mesh);
        });

        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.mesh.position.z -= 0.1;
                    break;
                case 'ArrowDown':
                    this.mesh.position.z += 0.1;
                    break;
                case 'ArrowLeft':
                    this.mesh.position.x -= 0.1;
                    break;
                case 'ArrowRight':
                    this.mesh.position.x += 0.1;
                    break;
            }
        });
    }
}

export default Player3D;
