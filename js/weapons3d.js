import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

class Weapons3D {
    constructor(scene) {
        this.scene = scene;
        this.bullets = [];
    }

    shoot(position) {
        const bullet = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        bullet.position.copy(position);
        bullet.position.z += 1;
        this.scene.add(bullet);
        this.bullets.push(bullet);
    }

    update() {
        this.bullets.forEach((bullet, index) => {
            bullet.position.z += 0.1;
            if (bullet.position.z > 10) {
                this.scene.remove(bullet);
                this.bullets.splice(index, 1);
            }
        });
    }
}

export default Weapons3D;
