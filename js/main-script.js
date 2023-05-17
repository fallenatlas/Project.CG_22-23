//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

const frustumSize = 600;

const cameraInputs = [49, 50, 51, 52, 53];
const keyCodeOffset = 49;

let activeCamera, cameras, scene, renderer;

let geometry, material, mesh;

//let ball;

let key6Pressed = false;
let key6Holded = false;
let keyEPressed = false;
let keyEHolded = false;

var materials;
var head, leftArm, rightArm;

//key pressed
//6 for exemple
//let key6pressed = false
//onKeyDown : key6pressed = true
//onKeyUp : key6pressed = false


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));

    const color = 'lightblue';
    scene.background = new THREE.Color(color);
    // create materials
    let material1 = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    let material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
    let material3 = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    materials = [material1, material2, material3]
    createRobot(0, 0, 0);
    //createTrailer(0, 0, 15);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCameras() {
    'use strict';
    //let frontViewCamera = createOrthogonalCamera(0, 0, 50);
    let frontViewCamera = createPerspectiveCamera(0, 20, 200);
    //let latViewCamera = createOrthogonalCamera(50, 0, 0);
    let latViewCamera = createPerspectiveCamera(100, 20, 0);
    //let topViewCamera = createOrthogonalCamera(0, 50, 0);
    let topViewCamera = createPerspectiveCamera(0, 100, 0);
    let isoCameraO = createOrthogonalCamera(50, 50, 50);
    let isoCameraP = createPerspectiveCamera(50, 50, 50);

    cameras = [
        { cam: frontViewCamera },
        { cam: latViewCamera },
        { cam: topViewCamera },
        { cam: isoCameraO },
        { cam: isoCameraP },
    ];

    activeCamera = frontViewCamera;
}

function createOrthogonalCamera(x, y, z) {
    'use strict';
    const aspect = window.innerWidth / window.innerHeight;
    let camera = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);
    camera.zoom = 1;

    return camera;
}

function createPerspectiveCamera(x, y, z) {
    'use strict';
    const aspect = window.innerWidth / window.innerHeight;
    let camera = new THREE.PerspectiveCamera(70, aspect, 1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);

    return camera;
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function addFace(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.SphereGeometry(8, 10, 10);
    let mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addEye(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.SphereGeometry(1.5, 10, 10);
    let mesh = new THREE.Mesh(geometry, materials[2]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addAntenna(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.CylinderGeometry(1, 1, 9);
    let mesh = new THREE.Mesh(geometry, materials[1]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(obj, x, y, z) {
    'use strict';
    head = new THREE.Object3D();

    addFace(head, 0, 8, 0);
    addEye(head, 3, 10, 7);
    addEye(head, -3, 10, 7);
    addAntenna(head, 8, 12.5, 0);
    addAntenna(head, -8, 12.5, 0);

    obj.add(head);

    head.position.set(x, y, z);
}

function addTrunk(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(50, 30, 25);
    let mesh = new THREE.Mesh(geometry, materials[1]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addUpperArm(obj, x, y, z, isLeft) {
    'use strict';
    // arm
    let geometry1 = new THREE.BoxGeometry(8, 30, 8);
    let arm = new THREE.Mesh(geometry1, materials[0]);
    
    // pipe
    let geometry2 = new THREE.CylinderGeometry(1.5, 1.5, 20);
    let pipe = new THREE.Mesh(geometry2, materials[2]);
    if (isLeft) {
        pipe.position.set(-4-1.5, 15, 0);
    }
    else {
        pipe.position.set(+4+1.5, 15, 0);
    }

    // upper arm
    let upperArm = new THREE.Object3D();
    upperArm.add(arm);
    upperArm.add(pipe);
    upperArm.position.set(x, y, z);
    obj.add(upperArm);
}

function addLowerArm(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(8, 8, 25);
    let mesh = new THREE.Mesh(geometry, materials[2]);
    mesh.position.set(x, y-4, z);
    obj.add(mesh);
}

function addArm(obj, arm, x, y, z, isLeft) {
    'use strict';
    arm = new THREE.Object3D();
    addUpperArm(arm, 0, 0, -12.5+4, isLeft);
    addLowerArm(arm, 0, -15, 0);

    obj.add(arm);

    arm.position.set(x, y, z);
}

function addAbdomen(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(34, 19, 25);
    let mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWaist(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(50, 12, 2);
    let mesh = new THREE.Mesh(geometry, materials[1]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWheel() {
    // têm que ter raio 10
}

function addLegs() {
    // legs -> variável global
}

function addWaistToFeet(obj, x, y, z) {
    'use strict';
    let waistToFeet = new THREE.Object3D();
    addWaist(waistToFeet, 0, 5, 12.5+1);
    //addWheel(waistToFeet, hroda/2+17, 0, 0);
    //addWheel(waistToFeet, -hroda/2-17, 0, 0);
    //addLegs(waistToFeet);
    waistToFeet.position.set(x, y, z);
    obj.add(waistToFeet);
}

function addAbdomenToFeet(obj, x, y, z) {
    'use strict';
    let abdomenToFeet = new THREE.Object3D();
    // abdomen
    addAbdomen(abdomenToFeet, 0, -9.5, 0);

    //lower body: waist, legs, wheels and feet
    addWaistToFeet(abdomenToFeet, 0, -19, 0);
    
    obj.add(abdomenToFeet);
    abdomenToFeet.position.set(x, y, z);
}

function createRobot(x, y, z) {
    'use strict';

    let robot = new THREE.Object3D();
    addHead(robot, 0, 15, 0);
    addTrunk(robot, 0, 0, 0);
    addArm(robot, leftArm, -29, 0, 0, true);
    addArm(robot, rightArm, 29, 0, 0, false);
    addAbdomenToFeet(robot, 0, -15, 0);
    //addAbdomen();
    //-->addCintura();
    //---->addWheel();
    //---->addLeg();
    //------->addFoot();

    scene.add(robot);

    robot.position.set(x, y, z);
}

function createTrailer(x, y, z) {
    'use strict';

    let trailer = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    
    //addContainer();
    //addWheel();

    scene.add(trailer);

    trailer.position.set(x, y, z);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

    if (keyEPressed && !keyEHolded) { //e
        keyEHolded = true;
        scene.traverse(function (node) {
            if (node instanceof THREE.AxesHelper) {
                node.visible = !node.visible;
            }
        });
    }
    if (key6Pressed && !key6Holded) { //tecla 6
        key6Holded = true;
        for (let i=0; i < 3; i++) {
            materials[i].wireframe = !materials[i].wireframe;
        }
    }

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    //renderer.clear();
    renderer.render(scene, activeCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCameras();

    render();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    
    /*if (ball.userData.jumping) {
        ball.userData.step += 0.04;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }*/
    update();
    render();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        const aspect = window.innerWidth / window.innerHeight;
        for (let i = 0; i < 4; i++) {
            cameras[i].cam.left = - 0.5 * frustumSize * aspect / 2;
            cameras[i].cam.right = 0.5 * frustumSize * aspect / 2;
            cameras[i].cam.top = frustumSize / 2;
            cameras[i].cam.bottom = - frustumSize / 2;
            cameras[i].cam.updateProjectionMatrix();

        }
        cameras[4].cam.aspect = aspect;
        cameras[4].cam.updateProjectionMatrix();
    }
}


///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    /*
    if (e.keyCode == 69) { //e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxesHelper) {
                node.visible = !node.visible;
            }
        });
    }
    if (cameraInputs.includes(e.keyCode)) { // teclas 1 a 5
        activeCamera = cameras[e.keyCode-keyCodeOffset].cam;
    }
    if (e.keyCode == 54) { //tecla 6
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
    }
    */

    if (e.keyCode == 69) { //e
        keyEPressed = true;
    }
    if (cameraInputs.includes(e.keyCode)) { // teclas 1 a 5
        activeCamera = cameras[e.keyCode-keyCodeOffset].cam;
    }
    if (e.keyCode == 54) { //tecla 6
        key6Pressed = true;
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    if (e.keyCode == 69) { //e
        keyEPressed = false;
        keyEHolded = false;
    }
    if (e.keyCode == 54) { //tecla 6
        key6Pressed = false;
        key6Holded = false;
    }

}



// re-adjust orthographic camera
/*
function render() {
 
    if (resizeRendererToDisplaySize(renderer)) {
      camera.right = canvas.width;
      camera.bottom = canvas.height;
      camera.updateProjectionMatrix();
    }
*/