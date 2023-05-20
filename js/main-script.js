//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

const frustumSize = 600;

const cameraInputs = [49, 50, 51, 52, 53];
const keyCodeOffset = 49;

let activeCamera, cameras, scene, renderer;

//let geometry, material, mesh;

let key6Pressed = false;
let key6Holded = false;
let keyGPressed = false;
let keyGHolded = false;
// head rotation
let keyRHolded = false;
let keyFHolded = false;
// arm translation
let keyEHolded = false;
let keyDHolded = false;

const materials = [
    { mat:  new THREE.MeshBasicMaterial({ color: 'black', wireframe: true }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'red', wireframe: true }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'grey', wireframe: true }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'darkblue', wireframe: true }) },
]

let head, leftArm, rightArm, leftLeg, rightLeg, leftFoot, rightFoot;

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
    let latViewCamera = createPerspectiveCamera(100, -20, 0);
    //let topViewCamera = createOrthogonalCamera(0, 50, 0);
    let topViewCamera = createPerspectiveCamera(0, 100, 0);
    //let isoCameraO = createOrthogonalCamera(50, 50, 50);
    let isoCameraO = createPerspectiveCamera(50, 50, 50);
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

////////////////////////
/* CREATE HEAD */

function addFace(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(16, 16, 16);
    let mesh = new THREE.Mesh(geometry, materials[1].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addEye(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.CylinderGeometry(1.5, 1.5, 1);
    let mesh = new THREE.Mesh(geometry, materials[0].mat);
    mesh.rotateX(Math.PI / 2);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addAntenna(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.CylinderGeometry(1, 1, 9);
    let mesh = new THREE.Mesh(geometry, materials[3].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(obj, x, y, z) {
    'use strict';
    head = new THREE.Object3D();
    // head is in truck mode if nTimes = 16
    head.userData = { nTimes: 0 };
    addFace(head, 0, 8, 0);
    addEye(head, 3, 10, 8);
    addEye(head, -3, 10, 8);
    addAntenna(head, 8+1, 12.5, 0);
    addAntenna(head, -8-1, 12.5, 0);

    obj.add(head);

    head.position.set(x, y, z);
}

////////////////////////
/* CREATE TRUNK */

function addTrunk(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(50, 30, 25);
    let mesh = new THREE.Mesh(geometry, materials[3].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

////////////////////////
/* CREATE ARMS */

function addUpperArm(obj, x, y, z, isLeft) {
    'use strict';
    // arm
    let geometry1 = new THREE.BoxGeometry(8, 30, 8);
    let arm = new THREE.Mesh(geometry1, materials[1].mat);
    
    // pipe
    let geometry2 = new THREE.CylinderGeometry(1.5, 1.5, 20);
    let pipe = new THREE.Mesh(geometry2, materials[2].mat);
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
    let mesh = new THREE.Mesh(geometry, materials[3].mat);
    mesh.position.set(x, y-4, z);
    obj.add(mesh);
}

function addArm(obj, arm, x, y, z, isLeft) {
    'use strict';
    addUpperArm(arm, 0, 0, -12.5+4, isLeft);
    addLowerArm(arm, 0, -15, 0);

    obj.add(arm);

    arm.position.set(x, y, z);
}

function addArms(obj) {
    'use strict';
    leftArm = new THREE.Object3D();
    rightArm = new THREE.Object3D();
    // arms are in truck mode if nTimes = 16
    rightArm.userData = { nTimes: 0 };

    addArm(obj, leftArm, -29, 0, 0, true);
    addArm(obj, rightArm, 29, 0, 0, false);
}

////////////////////////
/* CREATE ABDOMEN TO FEET */

function addAbdomen(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(34, 19, 25);
    let mesh = new THREE.Mesh(geometry, materials[1].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWaist(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(50, 12, 2);
    let mesh = new THREE.Mesh(geometry, materials[2].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addLeg(obj, side, x, y, z) {
    'use strict'
    let leg = new THREE.Object3D();

    addTopLeg(leg, 0, -12.5, -3.5);
    addBottomLeg(leg, 0, -25-25, -0);
    addWheel(leg, (7 + 4) * side, -25-10-5, 0);
    addWheel(leg, (7 + 4) * side, -25-10-5-5-10-10, 0);

    if (side == 1) { rightFoot = addFoot(leg, 0, -25-50, -7); }
    else { leftFoot = addFoot(leg, 0, -25-50, -7); }

    leg.position.set(x, y, z);

    obj.add(leg);
}

function addWheel(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.CylinderGeometry( 10, 10, 8, 32 ); 
    let mesh = new THREE.Mesh(geometry, materials[0].mat);
    mesh.rotateZ(Math.PI / 2);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTopLeg(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(7, 25, 7);
    let mesh = new THREE.Mesh(geometry, materials[2].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addBottomLeg(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(14, 50, 14);
    let mesh = new THREE.Mesh(geometry, materials[3].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addFoot(obj, x, y, z) {
    'use strict'
    let foot = new THREE.Object3D();

    addFootBase(foot, 0, 7, 12.5);

    foot.position.set(x, y, z);

    obj.add(foot);
}

function addFootBase(obj, x, y, z) {
    'use strict'
    let geometry = new THREE.BoxGeometry(14, 14, 25);
    let mesh = new THREE.Mesh(geometry, materials[3].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addWaistToFeet(obj, x, y, z) {
    'use strict'
    let waistToFeet = new THREE.Object3D();
    //0, 0, 4.5
    addWaist(waistToFeet, 0, 0, 12.5+1);
    addWheel(waistToFeet, 4+17, 0, 0); // objeto novo para a roda e rodar esse??
    addWheel(waistToFeet, -4-17, 0, 0);
    leftLeg = addLeg(waistToFeet, 1, 10, 0, 0);
    rightLeg = addLeg(waistToFeet, -1, -10, 0, 0);

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

////////////////////////
/* CREATE ROBOT */

function createRobot(x, y, z) {
    'use strict';
    let robot = new THREE.Object3D();
    addHead(robot, 0, 15, 0);
    addTrunk(robot, 0, 0, 0);
    addArms(robot);
    addAbdomenToFeet(robot, 0, -15, 0);

    scene.add(robot);

    robot.position.set(x, y, z);
}

////////////////////////
/* CREATE TRAILER */

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

    if (keyGPressed && !keyGHolded) { //g
        keyGHolded = true;
        scene.traverse(function (node) {
            if (node instanceof THREE.AxesHelper) {
                node.visible = !node.visible;
            }
        });
    }
    if (key6Pressed && !key6Holded) { //key 6
        key6Holded = true;
        for (let i=0; i < 4; i++) {
            materials[i].mat.wireframe = !materials[i].mat.wireframe;
        }
    }

    // head rotation (max rotation = -PI rads)
    if (keyFHolded && head.userData.nTimes < 16) { //key F/f
        // fold head
        head.userData.nTimes += 1;
        head.rotateX(-Math.PI/16);
    }

    if (keyRHolded && head.userData.nTimes > 0) { //key R/r
        head.userData.nTimes -= 1;
        head.rotateX(Math.PI/16);
    }
    // arm translation (max translation = 8)
    if (keyDHolded && rightArm.userData.nTimes > 0) { //key D/d
        // arms out
        rightArm.userData.nTimes -= 1;
        rightArm.translateX(0.5);
        leftArm.translateX(-0.5);
    }

    if (keyEHolded && rightArm.userData.nTimes < 16) { //key E/e
        // arms in
        rightArm.userData.nTimes += 1;
        rightArm.translateX(-0.5);
        leftArm.translateX(0.5);
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
        /*for (let i = 0; i < 4; i++) {
            cameras[i].cam.left = - 0.5 * frustumSize * aspect / 2;
            cameras[i].cam.right = 0.5 * frustumSize * aspect / 2;
            cameras[i].cam.top = frustumSize / 2;
            cameras[i].cam.bottom = - frustumSize / 2;
            cameras[i].cam.updateProjectionMatrix();

        }
        cameras[4].cam.aspect = aspect;
        cameras[4].cam.updateProjectionMatrix();*/
        for (let i = 0; i < 5; i++) {
            cameras[i].cam.aspect = aspect;
            cameras[i].cam.updateProjectionMatrix();
        }
        
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

    if (e.keyCode == 71) { //g
        keyGPressed = true;
    }
    if (cameraInputs.includes(e.keyCode)) { //keys 1 to 5
        activeCamera = cameras[e.keyCode-keyCodeOffset].cam;
    }
    if (e.keyCode == 54) { //tecla 6
        key6Pressed = true;
    }
    // head rotation
    if (e.keyCode == 82 || e.keyCode == 114) { //key R/r
        keyRHolded = true;
    }
    if (e.keyCode == 70 || e.keyCode == 102) { //key F/f
        keyFHolded = true;
    }
    // arm translation
    if (e.keyCode == 68 || e.keyCode == 100) { //key D/d
        keyDHolded = true;
    }
    if (e.keyCode == 69 || e.keyCode == 101) { //key E/e
        keyEHolded = true;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    if (e.keyCode == 71) { //key g
        keyGPressed = false;
        keyGHolded = false;
    }
    if (e.keyCode == 54) { //key 6
        key6Pressed = false;
        key6Holded = false;
    }
    // head rotation
    if (e.keyCode == 82 || e.keyCode == 114) { //key R/r
        keyRHolded = false;
    }
    if (e.keyCode == 70 || e.keyCode == 102) { //key F/f
        keyFHolded = false;
    }
    // arm translation
    if (e.keyCode == 68 || e.keyCode == 100) { //key D/d
        keyDHolded = false;
    }
    if (e.keyCode == 69 || e.keyCode == 101) { //key E/e
        keyEHolded = false;
    }
}

///////////////////////
/* LEG */
///////////////////////

// re-adjust orthographic camera
/*
function render() {
 
    if (resizeRendererToDisplaySize(renderer)) {
      camera.right = canvas.width;
      camera.bottom = canvas.height;
      camera.updateProjectionMatrix();
    }
*/