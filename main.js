import './style.css';

import * as THREE from './libs/three/three.module.js';
import { GLTFLoader } from './libs/three/examples/jsm/loaders/GLTFLoader.js';

function easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
camera.position.setZ(30);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const loader = new GLTFLoader();
let gameboy = null;
loader.load(
    'gameboy_classic/scene.gltf', // Replace with the path to your GLTF file
    (gltf) => {
        console.log('here');
        gameboy = gltf.scene;
        gameboy.scale.set(4, 4, 4); // Scale the model to make it bigger
        gameboy.position.set(3, -8, 0); // Center the model
        gameboy.rotation.set(0.6, -0.20, 0.4);
        scene.add(gameboy);
    },
    (xhr) => {
        console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
    }
);

let cartridge = null;
loader.load(
    'gameboy_cartridge/scene.gltf', // Replace with the path to your GLTF file
    (gltf) => {
        console.log('here');
        cartridge = gltf.scene;
        cartridge.scale.set(4, 4, 4); // Scale the model to make it bigger
        cartridge.position.set(-8, -8, 0); // Center the model
        cartridge.rotation.set(Math.PI / 2, -Math.PI / 2, 0);
        scene.add(cartridge);
    },
    (xhr) => {
        console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
    }
);

let x = 0;
let y = 0;
document.addEventListener('mousemove', function(event) {
    x = event.clientX;
    y = event.clientY;
});

const clock = new THREE.Clock(true);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let closestObject = null;

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function getClosestIntersection(camera, scene) {
    raycaster.setFromCamera(mouse, camera);

    // Perform intersection test
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        closestObject = intersects[0].object; // First item is always the closest
    } else {
        closestObject = null;
    }
}

function isChildOf(child, parent) {
    while (child) {
        if (child === parent) return true;
        child = child.parent;
    }
    return false;
}

let gameboyTimer = 0;
function animate() {
    requestAnimationFrame(animate);
    getClosestIntersection(camera, scene);
    renderer.clear();

    const dt = clock.getDelta();

    console.log(gameboy)
    console.log(closestObject)
    if (isChildOf(closestObject, gameboy)) {
        gameboyTimer += dt;
        if (gameboyTimer > 1) gameboyTimer = 1;
        const t = easeInOutQuart(gameboyTimer);
        const z = (1 - t) * 0 + t * 4;

        gameboy.position.z = z;
    } else {
        gameboyTimer -= dt;
        if (gameboyTimer < 0) gameboyTimer = 0;
        const t = easeInOutQuart(gameboyTimer);
        const z = (1 - t) * 0 + t * 4;

        gameboy.position.z = z;
    }

    renderer.render(scene, camera);
}

animate();
