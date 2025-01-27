import './style.css';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, document.body.scrollWidth / document.body.scrollHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'), alpha: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(document.body.scrollWidth, document.body.scrollHeight);
camera.position.setZ(30);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

let car = null;
let x = 0;
let y = 0;

const loader = new GLTFLoader();
loader.load(
    'car/scene.gltf', // Replace with the path to your GLTF file
    (gltf) => {
        console.log('here');
        car = gltf.scene;
        car.scale.set(1.2, 1.2, 1.2); // Scale the model to make it bigger
        car.position.set(0, 12, 0); // Center the model
        car.rotation.x = Math.PI / 2;
        scene.add(car);
        car.getWorldPosition(worldPosition);
        worldPosition.project(camera);
        x = (worldPosition.x + 1) * 0.5 * document.body.scrollWidth;
        y = (-worldPosition.y + 1) * 0.5 * document.body.scrollHeight;
        scrollTo(0, y - screen.height / 2 + 50);
    },
    (xhr) => {
        console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
    }
);

let forward = false;
let left = false;
let back = false;
let right = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        forward = true;
    } else if (event.key === 'a') {
        left = true;
    } else if (event.key === 's') {
        back = true;
    } else if (event.key === 'd') {
        right = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') {
        forward = false;
    } else if (event.key === 'a') {
        left = false;
    } else if (event.key === 's') {
        back = false;
    } else if (event.key === 'd') {
        right = false;
    }
});

const links = document.getElementsByClassName("link");
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        for (let i = 0; i < links.length; i++) {
            let rect = links[i].getBoundingClientRect();
            const top = rect.top + document.documentElement.scrollTop; 
            const bottom = rect.bottom + document.documentElement.scrollTop; 
            const left = rect.left;
            const right = rect.right;

            console.log(y, top, bottom, x, left, right);

            if (y > top && y < bottom && x > left && x < right) {
                const href = links[i].getAttribute("href");
                console.log("here");
                if (href) {
                    window.open(href, "_self");
                }
            } else {
                console.log("not in link");
            }
        }
    } else if (event.key === 'r') {
        car.position.x = 0;
        car.position.y = 12;
        car.position.z = 0;
        car.rotation.x = Math.PI / 2;
        car.rotation.y = 0;
        car.rotation.z = 0;

        car.getWorldPosition(worldPosition);
        worldPosition.project(camera);
        x = (worldPosition.x + 1) * 0.5 * document.body.scrollWidth;
        y = (-worldPosition.y + 1) * 0.5 * document.body.scrollHeight;
        scrollTo(0, y - screen.height / 2 + 50);
    }
});

function animate() {
    requestAnimationFrame(animate);
    renderer.clear();

    let worldPosition = new THREE.Vector3();
    car.getWorldPosition(worldPosition);
    worldPosition.project(camera);
    x = (worldPosition.x + 1) * 0.5 * document.body.scrollWidth;
    y = (-worldPosition.y + 1) * 0.5 * document.body.scrollHeight;

    if (forward) {
        scrollTo(0, y - screen.height / 2 + 50);
        car.position.x += 0.3 * Math.sin(car.rotation.y);
        car.position.y -= 0.3 * Math.cos(car.rotation.y);
    }
    if (back) {
        scrollTo(0, y - screen.height / 2 + 50);
        car.position.x -= 0.3 * Math.sin(car.rotation.y);
        car.position.y += 0.3 * Math.cos(car.rotation.y);
    }
    if (left && forward) {
        scrollTo(0, y - screen.height / 2 + 50);
        car.rotation.y += 0.09;

    }
    if (right && forward) {
        scrollTo(0, y - screen.height / 2 + 50);
        car.rotation.y -= 0.09;

    }
    if (left && back) {
        scrollTo(0, y - screen.height / 2 + 50);
        car.rotation.y -= 0.09;
    }
    if (right && back) {
        scrollTo(0, y - screen.height / 2 + 50);
        car.rotation.y += 0.09;
    }


    renderer.render(scene, camera);
}

animate();
