class Player3D {
    constructor(scene) {
        this.scene = scene;
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        this.mesh.position.set(0, 0, 0);
        this.scene.add(this.mesh);

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
