import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';

class Enemy3D {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.speed = Math.random() * 0.05 + 0.01;

        const loader = new GLTFLoader();
        loader.load('https://threejs.org/examples/models/gltf/Duck/Duck.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(0.5, 0.5, 0.5);
            this.mesh.position.set(
                Math.random() * 10 - 5,
                Math.random() * 10 - 5,
                -10
            );
            this.scene.add(this.mesh);
        });
    }

    update() {
        if (this.mesh) {
            this.mesh.position.z += this.speed;
            if (this.mesh.position.z > 10) {
                this.scene.remove(this.mesh);
            }
        }
    }
}

export default Enemy3D;
