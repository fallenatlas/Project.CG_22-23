//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

const FRUSTUM_SIZE = 600;

const CAMERA_INPUTS = [49, 50, 51, 52, 53];
const KEY_CODE_OFFSET = 49;

const TRAILER_SPEED = 32;

const IS_TRUCK = 0;
const IS_ROBOT = 1;
const IS_FOLDING = -1;

let activeCamera, cameras, scene, renderer, clock;

// switch solid colors/wireframe view
let key6Pressed = false;
let key6Held = false;
// head rotation
let keyRHeld = false;
let keyFHeld = false;
// arm translation
let keyEHeld = false;
let keyDHeld = false;
// feet rotation
let keyQHeld = false;
let keyAHeld = false;
// legs rotation
let keyWHeld = false;
let keySHeld = false;
// trailer slide
let keyArrowLHeld = false;
let keyArrowRHeld = false;
let keyArrowUHeld = false;
let keyArrowDHeld = false;

// To know if animation should be activated
let activeAnimation= false;
let CollisionPreviousFrame = false;
let CollisionCurrentFrame = false;

const foldingSpeed = 2;
const materials = [
    { mat:  new THREE.MeshBasicMaterial({ color: 'black', wireframe: true }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'red', wireframe: true }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'grey', wireframe: true }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'darkblue', wireframe: true }) },
]

let head, leftArm, rightArm, leftLeg, rightLeg, leftFoot, rightFoot;
let robot, trailer;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();

    const color = 'lightblue';
    scene.background = new THREE.Color(color);

    createRobot(0, 0, 0);
    createTrailer(0, 0, -240);
}
/////////////////////
/* CREATE CLOCK */
/////////////////////
function createClock(){
    'use strict';
    clock = new THREE.Clock();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCameras() {
    'use strict';
    let frontViewCamera = createOrthogonalCamera(0, 0, 50, 2);
    let latViewCamera = createOrthogonalCamera(50, 0, 0, 2);
    let topViewCamera = createOrthogonalCamera(0, 200, 0, 1);
    let isoCameraO = createOrthogonalCamera(50, 50, 50, 2);
    let isoCameraP = createPerspectiveCamera(100, 100, 100);

    cameras = [
        { cam: frontViewCamera },
        { cam: latViewCamera },
        { cam: topViewCamera },
        { cam: isoCameraO },
        { cam: isoCameraP },
    ];

    activeCamera = frontViewCamera;
}

function createOrthogonalCamera(x, y, z, zoom) {
    'use strict';
    const aspect = window.innerWidth / window.innerHeight;
    let camera = new THREE.OrthographicCamera( - 0.5 * FRUSTUM_SIZE * aspect, 0.5 * FRUSTUM_SIZE * aspect, FRUSTUM_SIZE / 2, FRUSTUM_SIZE / - 2, 1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.zoom = zoom;
    camera.lookAt(scene.position);
    
    camera.updateProjectionMatrix();

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
    head.userData = { state: IS_ROBOT };
    addFace(head, 0, 8, 0);
    addEye(head, 3, 10, 8);
    addEye(head, -3, 10, 8);
    addAntenna(head, 9, 12.5, 0);
    addAntenna(head, -9, 12.5, 0);

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
        pipe.position.set(-5.5, 15, 0);
    }
    else {
        pipe.position.set(5.5, 15, 0);
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
    addUpperArm(arm, 0, 0, -8.5, isLeft);
    addLowerArm(arm, 0, -15, 0);

    obj.add(arm);

    arm.position.set(x, y, z);
}

function addArms(obj) {
    'use strict';
    leftArm = new THREE.Object3D();
    rightArm = new THREE.Object3D();
    rightArm.userData = { state: IS_ROBOT };

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

function addLeg(obj, leg, side, x, y, z) {
    'use strict'
    addTopLeg(leg, 0, -12.5, -3.5);
    addBottomLeg(leg, 0, -25-25, -0);
    addWheel(leg, (7 + 4) * side, -25-10-5, 0);
    addWheel(leg, (7 + 4) * side, -25-10-5-5-10-10, 0);

    if (side == 1) { addFoot(leg, rightFoot, 0, -25-50, -7); }
    else { addFoot(leg, leftFoot, 0, -25-50, -7); }
    
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

function addFoot(obj, foot, x, y, z) {
    'use strict'
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
    addWaist(waistToFeet, 0, 0, 12.5+1);
    addWheel(waistToFeet, 4+17, 0, 0); // objeto novo para a roda e rodar esse??
    addWheel(waistToFeet, -4-17, 0, 0);
    addLegs(waistToFeet);

    waistToFeet.position.set(x, y, z);

    obj.add(waistToFeet);
}

function addLegs(obj) {
    leftLeg = new THREE.Object3D();
    rightLeg = new THREE.Object3D();
    rightLeg.userData = { state: IS_ROBOT };

    leftFoot = new THREE.Object3D();
    rightFoot = new THREE.Object3D();
    rightFoot.userData = { state: IS_ROBOT };

    addLeg(obj, leftLeg, 1, 10, 0, 0);
    addLeg(obj, rightLeg, -1, -10, 0, 0);
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
    robot = new THREE.Object3D();
    addHead(robot, 0, 15, 0);
    addTrunk(robot, 0, 0, 0);
    addArms(robot);
    addAbdomenToFeet(robot, 0, -15, 0);

    scene.add(robot);

    robot.position.set(x, y, z);
    // Points for AABB
    robot.userData = { xMax : 28, xMin : -28, yMax : 25, yMin : -44, zMax : 14.5, zMin : -100};
}

////////////////////////
/* CREATE TRAILER */

function addContainer(obj, x, y, z) {
    'use strict';    
    let geometry = new THREE.BoxGeometry(34, 50, 135);
    let mesh = new THREE.Mesh(geometry, materials[3].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addConnectionPiece(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(5, 5, 5);
    let mesh = new THREE.Mesh(geometry, materials[2].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createTrailer(x, y, z) {
    'use strict';
    trailer = new THREE.Object3D();

    addWheel(trailer, 21, -34, -32.5);
    addWheel(trailer, -21, -34, -32.5);
    addWheel(trailer, 21, -34, -57.5);
    addWheel(trailer, -21, -34, -57.5);
    addContainer(trailer, 0, 0, 0);
    addConnectionPiece(trailer, 0, -22.5, 70);

    scene.add(trailer);
    trailer.position.set(x, y, z);
    // Initial points for AABB
    trailer.userData = { xMax : 25, xMin : -25, yMax : 25, yMin : -44, zMax : -167.5, zMin : -307.5};
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';
    return robot.userData.xMax > trailer.userData.xMin && robot.userData.xMin < trailer.userData.xMax &&
    robot.userData.yMax > trailer.userData.yMin && robot.userData.yMin < trailer.userData.yMax &&
    robot.userData.zMax > trailer.userData.zMin && robot.userData.zMin < trailer.userData.zMax;

}


///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(delta){
    'use strict';
    // Trailer's final position zMax = -12.5, xMax = 25
    let distanceX = 25 - trailer.userData.xMax;
    let distanceZ = -12.5 - trailer.userData.zMax;
    if (distanceX == 0 && distanceZ == 0) {
        // End of trailer's animation
        activeAnimation = false;
        return;
    }
    // Calculate translationV vector
    let translationV = new THREE.Vector3(distanceX, 0, distanceZ);
    translationV.normalize();
    translationV = translationV.multiplyScalar(TRAILER_SPEED * delta);
    // Set translationV equal to distance if it goes beyond target 
    if (Math.abs(translationV.x) > Math.abs(distanceX)) {
        translationV.x = distanceX;
    }

    if (Math.abs(translationV.z) > Math.abs(distanceZ)) {
        translationV.z = distanceZ;
    }
    // Apply translation
    trailer.translateX(translationV.x);
    trailer.translateZ(translationV.z);
    updateAABBTrailer(translationV.x, translationV.z);
}



////////////
/* UPDATE */
////////////
function updateAABBTrailer(x, z) {
    'use strict';
    trailer.userData.xMax += x;
    trailer.userData.xMin += x;
    trailer.userData.zMax += z;
    trailer.userData.zMin += z;
}

function isTruck(){
    'use strict';
    return head.userData.state == IS_TRUCK && rightArm.userData.state == IS_TRUCK &&
    rightFoot.userData.state == IS_TRUCK && rightLeg.userData.state == IS_TRUCK;
}

function handleHeadMovement(delta) {
    'use strict';
    // head rotation (max rotation = -PI rads)
    if (keyRHeld && head.userData.state != IS_TRUCK) { //key R/r
        // fold head
        head.rotation.x = THREE.MathUtils.clamp(head.rotation.x - (Math.PI/foldingSpeed * delta), -Math.PI, 0);
        if (head.rotation.x == -Math.PI) {
            head.userData.state = IS_TRUCK;
        }
        else {
            head.userData.state = IS_FOLDING;
        }
    }
    if (keyFHeld && head.userData.state != IS_ROBOT) { //key F/f
        head.rotation.x = THREE.MathUtils.clamp(head.rotation.x + (Math.PI/foldingSpeed * delta), -Math.PI, 0);
        if (head.rotation.x == 0) {
            head.userData.state = IS_ROBOT;
        }
        else {
            head.userData.state = IS_FOLDING;
        }
    }
}

function handleArmsMovement(delta) {
    'use strict';
    // arm translation (max translation = 8)
    if (keyDHeld && rightArm.userData.state != IS_ROBOT) { //key D/d
        // arms out
        rightArm.position.x = THREE.MathUtils.clamp(rightArm.position.x + (8/foldingSpeed * delta), 29-8, 29);
        leftArm.position.x = THREE.MathUtils.clamp(leftArm.position.x - (8/foldingSpeed * delta), -29, -29+8);
        if (rightArm.position.x == 29) {
            rightArm.userData.state = IS_ROBOT;
        }
        else {
            rightArm.userData.state = IS_FOLDING;
        }
    }
    if (keyEHeld && rightArm.userData.state != IS_TRUCK) { //key E/e
        // arms in
        rightArm.position.x = THREE.MathUtils.clamp(rightArm.position.x - (8/foldingSpeed * delta), 29-8, 29);
        leftArm.position.x = THREE.MathUtils.clamp(leftArm.position.x + (8/foldingSpeed * delta), -29, -29+8);
        if (rightArm.position.x == 29-8) {
            rightArm.userData.state = IS_TRUCK;
        }
        else {
            rightArm.userData.state = IS_FOLDING;
        }
    }
}

function handleFeetMovement(delta) {
    'use strict';
    // feet rotation (max rotation = -PI rads)
    if (keyQHeld && rightFoot.userData.state != IS_TRUCK) { //key Q\q
        // fold feet      
        leftFoot.rotation.x = THREE.MathUtils.clamp(leftFoot.rotation.x + ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        rightFoot.rotation.x = THREE.MathUtils.clamp(rightFoot.rotation.x + ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        if (rightFoot.rotation.x == Math.PI/2) {
            rightFoot.userData.state = IS_TRUCK;
        }
        else {
            rightFoot.userData.state = IS_FOLDING;
        }
    }

    if (keyAHeld && rightFoot.userData.state != IS_ROBOT) { //key A/a
        leftFoot.rotation.x = THREE.MathUtils.clamp(leftFoot.rotation.x - ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        rightFoot.rotation.x = THREE.MathUtils.clamp(rightFoot.rotation.x - ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        if (rightFoot.rotation.x == 0) {
            rightFoot.userData.state = IS_ROBOT;
        }
        else {
            rightFoot.userData.state = IS_FOLDING;
        }
    }
}

function handleLegsMovement(delta) {
    'use strict';
    // legs rotation (max rotation = -PI rads)
    if (keyWHeld && rightLeg.userData.state != IS_TRUCK) { //key W\w
        // fold legs
        leftLeg.rotation.x = THREE.MathUtils.clamp(leftLeg.rotation.x + ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        rightLeg.rotation.x = THREE.MathUtils.clamp(rightLeg.rotation.x + ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        if (rightLeg.rotation.x == Math.PI/2) {
            rightLeg.userData.state = IS_TRUCK;
        }
        else {
            rightLeg.userData.state = IS_FOLDING;
        }
    }

    if (keySHeld && rightLeg.userData.state != IS_ROBOT) { //key S/s
        leftLeg.rotation.x = THREE.MathUtils.clamp(leftLeg.rotation.x - ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        rightLeg.rotation.x = THREE.MathUtils.clamp(rightLeg.rotation.x - ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        if (rightLeg.rotation.x == 0) {
            rightLeg.userData.state = IS_ROBOT;
        }
        else {
            rightLeg.userData.state = IS_FOLDING;
        }
    }
}

function handleTrailerMovement(delta) {
    'use strict';
    let movementX = 0;
    let movementZ = 0;
    // trailer movement
    if(keyArrowLHeld) { //left arrow
        movementX -= 1;
    }
    if(keyArrowRHeld) { //right arrow
        movementX += 1;
    }
    if(keyArrowUHeld) { //up arrow
        movementZ -= 1;
    }
    if(keyArrowDHeld) { //down arrow
        movementZ += 1;
    }
    if (movementX != 0 || movementZ != 0) {
        let translationV = new THREE.Vector3(movementX, 0, movementZ);
        translationV.normalize();
        translationV = translationV.multiplyScalar(TRAILER_SPEED * delta);
        trailer.translateX(translationV.x);
        trailer.translateZ(translationV.z);
        updateAABBTrailer(translationV.x, translationV.z);
    }
}

function handleMovement(delta) {
    'use strict';
    handleHeadMovement(delta);
    handleArmsMovement(delta);
    handleFeetMovement(delta);
    handleLegsMovement(delta);
    handleTrailerMovement(delta);
}

function update(){
    'use strict';
    let delta = clock.getDelta();
    if (key6Pressed && !key6Held) { //key 6
        key6Held = true;
        for (let i=0; i < 4; i++) {
            materials[i].mat.wireframe = !materials[i].mat.wireframe;
        }
    }
    
    if (!activeAnimation) {
        handleMovement(delta);
        CollisionPreviousFrame = CollisionCurrentFrame;
        if (isTruck() && checkCollisions()) {
            CollisionCurrentFrame = true;
            if (!CollisionPreviousFrame && CollisionCurrentFrame) {
                // only activate animation if there was no collision in previous frame
                activeAnimation = true;
            }
        }
        else {
            CollisionCurrentFrame = false;
        }
    }
    if (activeAnimation) {
        handleCollisions(delta);
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
    createClock();
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
        for (let i = 0; i < 4; i++) {
            cameras[i].cam.left = - 0.5 * FRUSTUM_SIZE * aspect;
            cameras[i].cam.right = 0.5 * FRUSTUM_SIZE * aspect;
            cameras[i].cam.top = FRUSTUM_SIZE / 2;
            cameras[i].cam.bottom = - FRUSTUM_SIZE / 2;
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
    if (CAMERA_INPUTS.includes(e.keyCode)) { //keys 1 to 5
        activeCamera = cameras[e.keyCode-KEY_CODE_OFFSET].cam;
    }
    if (e.keyCode == 54) { //tecla 6
        key6Pressed = true;
    }
    // head rotation
    if (e.keyCode == 82 || e.keyCode == 114) { //key R/r
        keyRHeld = true;
    }
    if (e.keyCode == 70 || e.keyCode == 102) { //key F/f
        keyFHeld = true;
    }
    // arm translation
    if (e.keyCode == 68 || e.keyCode == 100) { //key D/d
        keyDHeld = true;
    }
    if (e.keyCode == 69 || e.keyCode == 101) { //key E/e
        keyEHeld = true;
    }
    // feet rotation
    if (e.keyCode == 81 || e.keyCode == 113) { //key Q/q
        keyQHeld = true;
    }
    if (e.keyCode == 65 || e.keyCode == 97) { //key A/a
        keyAHeld = true;
    }
    // leg rotation
    if (e.keyCode == 87 || e.keyCode == 119) { //key W/w
        keyWHeld = true;
    }
    if (e.keyCode == 83 || e.keyCode == 115) { //key S/s
        keySHeld = true;
    }
    // trailer slide
    if (e.keyCode == 37) { //key arrow left
        keyArrowLHeld = true;
    }
    if (e.keyCode == 39) { //key arrow right
        keyArrowRHeld = true;
    }
    if (e.keyCode == 38) { //key arrow up
        keyArrowUHeld = true;
    }
    if (e.keyCode == 40) { //key arrow down
        keyArrowDHeld = true;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    if (e.keyCode == 54) { //key 6
        key6Pressed = false;
        key6Held = false;
    }
    // head rotation
    if (e.keyCode == 82 || e.keyCode == 114) { //key R/r
        keyRHeld = false;
    }
    if (e.keyCode == 70 || e.keyCode == 102) { //key F/f
        keyFHeld = false;
    }
    // arm translation
    if (e.keyCode == 68 || e.keyCode == 100) { //key D/d
        keyDHeld = false;
    }
    if (e.keyCode == 69 || e.keyCode == 101) { //key E/e
        keyEHeld = false;
    }
    // feet rotation
    if (e.keyCode == 81 || e.keyCode == 113) { //key Q/q
        keyQHeld = false;
    }
    if (e.keyCode == 65 || e.keyCode == 97) { //key A/a
        keyAHeld = false;
    }
    // leg rotation
    if (e.keyCode == 87 || e.keyCode == 119) { //key W/w
        keyWHeld = false;
    }
    if (e.keyCode == 83 || e.keyCode == 115) { //key S/s
        keySHeld = false;
    }
    // trailer slide
    if (e.keyCode == 37) { //key arrow left
        keyArrowLHeld = false;
    }
    if (e.keyCode == 39) { //key arrow right
        keyArrowRHeld = false;
    }
    if (e.keyCode == 38) { //key arrow up
        keyArrowUHeld = false;
    }
    if (e.keyCode == 40) { //key arrow down
        keyArrowDHeld = false;
    }
}