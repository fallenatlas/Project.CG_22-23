//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

const frustumSize = 600;

const cameraInputs = [49, 50, 51, 52, 53];
const keyCodeOffset = 49;

let activeCamera, cameras, scene, renderer, clock;

// switch solid colors/wireframe view
let key6Pressed = false;
let key6Holded = false;
// active/deactivate axes helper
let keyGPressed = false;
let keyGHolded = false;
// head rotation
let keyRHolded = false;
let keyFHolded = false;
// arm translation
let keyEHolded = false;
let keyDHolded = false;
// feet rotation
let keyQHolded = false;
let keyAHolded = false;
// legs rotation
let keyWHolded = false;
let keySHolded = false;
// trailer slide
let keyArrowLHolded = false;
let keyArrowRHolded = false;
let keyArrowUHolded = false;
let keyArrowDHolded = false;


// boolean to indicate if it is in truck or robot mode
let CollisionDetected = false;

const foldingSpeed = 2;
const materials = [
    { mat:  new THREE.MeshBasicMaterial({ color: 'black', wireframe: true }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'red', wireframe: true }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'grey', wireframe: true }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'darkblue', wireframe: true }) },
]

let head, leftArm, rightArm, leftLeg, rightLeg, leftFoot, rightFoot;
let robot, trailer;
let trailerHelper;

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
    let frontViewCamera = createOrthogonalCamera(0, 0, 50);
    // let frontViewCamera = createPerspectiveCamera(0, 20, 200);
    let latViewCamera = createOrthogonalCamera(50, 0, 0);
    // let latViewCamera = createPerspectiveCamera(100, -20, 0);
    let topViewCamera = createOrthogonalCamera(0, 50, 0);
    // let topViewCamera = createPerspectiveCamera(0, 100, 0);
    let isoCameraO = createOrthogonalCamera(50, 50, 50);
    // let isoCameraO = createPerspectiveCamera(50, 50, 50);
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

function createOrthogonalCamera(x, y, z) {
    'use strict';
    const aspect = window.innerWidth / window.innerHeight;
    let camera = new THREE.OrthographicCamera( - 0.5 * frustumSize * aspect, 0.5 * frustumSize * aspect, frustumSize / 2, frustumSize / - 2, 1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.zoom = 2;
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
    // legs are in truck mode if nTimes = 16
    rightLeg.userData = { nTimes: 0 };
    leftFoot = new THREE.Object3D();
    rightFoot = new THREE.Object3D();
    // feet are in truck mode if nTimes = 16
    rightFoot.userData = { nTimes: 0 };

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
    robot.userData = { xMax : 28, xMin : -28, yMax : 25, yMin : -44, zMax : 14.5, zMin : -100};
    
    const box = new THREE.Box3( new THREE.Vector3( robot.userData.xMin, robot.userData.yMin, robot.userData.zMin ), new THREE.Vector3( robot.userData.xMax, robot.userData.yMax, robot.userData.zMax ) );
    //box.setFromCenterAndSize( new THREE.Vector3( trailer.userData.xMin, trailer.userData.yMin, -172.5 ), new THREE.Vector3( trailer.userData.xMax, trailer.userData.yMax, 0 ) );

    const helper = new THREE.Box3Helper( box, 0xffff00 );
    scene.add( helper );
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

    addWheel(trailer, 4+17, -34, -32.5);
    addWheel(trailer, -4-17, -34, -32.5);
    addWheel(trailer, 4+17, -34, -57.5);
    addWheel(trailer, -4-17, -34, -57.5);
    addContainer(trailer, 0, 0, 0);
    addConnectionPiece(trailer, 0, -22.5, 70);

    scene.add(trailer);
    trailer.position.set(x, y, z);
    trailer.userData = { xMax : 25, xMin : -25, yMax : 25, yMin : -44, zMax : -167.5, zMin : -307.5};

    const box = new THREE.Box3( new THREE.Vector3( trailer.userData.xMin, trailer.userData.yMin, trailer.userData.zMin ), new THREE.Vector3( trailer.userData.xMax, trailer.userData.yMax, trailer.userData.zMax ) );
    //box.setFromCenterAndSize( new THREE.Vector3( trailer.userData.xMin, trailer.userData.yMin, -172.5 ), new THREE.Vector3( trailer.userData.xMax, trailer.userData.yMax, 0 ) );

    trailerHelper = new THREE.Box3Helper( box, 0xffff00 );
    scene.add( trailerHelper );
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';
    // bounding box
    return robot.userData.xMax > trailer.userData.xMin && robot.userData.xMin < trailer.userData.xMax && robot.userData.yMax > trailer.userData.yMin && robot.userData.yMin < trailer.userData.yMax && robot.userData.zMax > trailer.userData.zMin && robot.userData.zMin < trailer.userData.zMax;

}


///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(delta){
    'use strict';
    // final x = 0; z = -12.5
    // final zMax = -12.5, xMax = 25
    let movementX = 25 - trailer.userData.x;
    let movementZ = -12.5 - trailer.userData.z;
    let direction = new THREE.Vector3(movementX, 0, movementZ);
    direction.normalize();
    // t_total_x = movementX/16; t_total_y = movementY/16
    trailer.translateOnAxis(direction, 16 * delta);
    //trailer.translateX(movementX);
    //trailer.translateZ(movementZ);
}

////////////
/* UPDATE */
////////////
function isTruck(){
    'use strict';
    return head.userData.nTimes == foldingSpeed && rightArm.userData.nTimes == foldingSpeed &&
    rightFoot.userData.nTimes == foldingSpeed && rightLeg.userData.nTimes == foldingSpeed;
}

function handleMovement(delta) {
    'use strict';
    // head rotation (max rotation = -PI rads)
    if (keyRHolded && head.userData.nTimes < foldingSpeed) { //key R/r
        // fold head
        /*
        let delta_head = head.userData.nTimes + delta > foldingSpeed ? foldingSpeed - head.userData.nTimes : delta;
        head.userData.nTimes += delta_head;
        head.rotateX(-Math.PI/foldingSpeed * delta_head);
        */
        head.userData.nTimes += delta;
        head.rotation.x = THREE.MathUtils.clamp(head.rotation.x - (Math.PI/foldingSpeed * delta), -Math.PI, 0);
        if (head.rotation.x == -Math.PI) {
            head.userData.nTimes = foldingSpeed;
        }
    }

    if (keyFHolded && head.userData.nTimes > 0) { //key F/f
        /*head.userData.nTimes -= delta;
        head.rotateX(Math.PI/foldingSpeed * delta);*/
        head.userData.nTimes -= delta;
        head.rotation.x = THREE.MathUtils.clamp(head.rotation.x + (Math.PI/foldingSpeed * delta), -Math.PI, 0);
        if (head.rotation.x == 0) {
            head.userData.nTimes = 0;
        }
        
    }
    // arm translation (max translation = 8)
    if (keyDHolded && rightArm.userData.nTimes > 0) { //key D/d
        // arms out
        /*rightArm.userData.nTimes -= delta;
        rightArm.translateX(0.5 * delta);
        leftArm.translateX(-0.5 * delta);*/
        rightArm.userData.nTimes -= delta;
        rightArm.position.x = THREE.MathUtils.clamp(rightArm.position.x + (8/foldingSpeed * delta), 29-8, 29);
        leftArm.position.x = THREE.MathUtils.clamp(leftArm.position.x - (8/foldingSpeed * delta), -29, -29+8);
        if (rightArm.position.x == 29) {
            rightArm.userData.nTimes = 0;
        }
    }

    if (keyEHolded && rightArm.userData.nTimes < foldingSpeed) { //key E/e
        // arms in
        /*rightArm.userData.nTimes += delta;
        rightArm.translateX(-0.5 * delta);
        leftArm.translateX(0.5 * delta);*/

        rightArm.userData.nTimes += delta;
        rightArm.position.x = THREE.MathUtils.clamp(rightArm.position.x - (8/foldingSpeed * delta), 29-8, 29);
        leftArm.position.x = THREE.MathUtils.clamp(leftArm.position.x + (8/foldingSpeed * delta), -29, -29+8);
        if (rightArm.position.x == 29-8) {
            rightArm.userData.nTimes = foldingSpeed;
        }
    }
    // feet rotation (max rotation = -PI rads)
    if (keyQHolded && rightFoot.userData.nTimes < foldingSpeed) { //key Q\q
        // fold feet
        /*
        rightFoot.userData.nTimes += delta;
        leftFoot.rotateX((Math.PI/2)/foldingSpeed * delta);
        rightFoot.rotateX((Math.PI/2)/foldingSpeed * delta);
        */
       
        rightFoot.userData.nTimes += delta;
        leftFoot.rotation.x = THREE.MathUtils.clamp(leftFoot.rotation.x + ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        rightFoot.rotation.x = THREE.MathUtils.clamp(rightFoot.rotation.x + ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        if (rightFoot.rotation.x == Math.PI/2) {
            rightFoot.userData.nTimes = foldingSpeed;
        }
    }

    if (keyAHolded && rightFoot.userData.nTimes > 0) { //key A/a
        /*
        rightFoot.userData.nTimes -= delta;
        leftFoot.rotateX(-(Math.PI/2)/foldingSpeed * delta);
        rightFoot.rotateX(-(Math.PI/2)/foldingSpeed * delta);
        */
       
        rightFoot.userData.nTimes -= delta;
        leftFoot.rotation.x = THREE.MathUtils.clamp(leftFoot.rotation.x - ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        rightFoot.rotation.x = THREE.MathUtils.clamp(rightFoot.rotation.x - ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        if (rightFoot.rotation.x == 0) {
            rightFoot.userData.nTimes = 0;
        }
    }
    // legs rotation (max rotation = -PI rads)
    if (keyWHolded && rightLeg.userData.nTimes < foldingSpeed) { //key W\w
        // fold feet
        /*
        rightLeg.userData.nTimes += delta;
        leftLeg.rotateX((Math.PI/2)/foldingSpeed * delta);
        rightLeg.rotateX((Math.PI/2)/foldingSpeed * delta);
        */

        rightLeg.userData.nTimes += delta;
        leftLeg.rotation.x = THREE.MathUtils.clamp(leftLeg.rotation.x + ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        rightLeg.rotation.x = THREE.MathUtils.clamp(rightLeg.rotation.x + ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        if (rightLeg.rotation.x == Math.PI/2) {
            rightLeg.userData.nTimes = foldingSpeed;
        }
    }

    if (keySHolded && rightLeg.userData.nTimes > 0) { //key S/s
        /*
        rightLeg.userData.nTimes -= delta;
        leftLeg.rotateX(-(Math.PI/2)/foldingSpeed * delta);
        rightLeg.rotateX(-(Math.PI/2)/foldingSpeed * delta);
        */
       
        rightLeg.userData.nTimes -= delta;
        leftLeg.rotation.x = THREE.MathUtils.clamp(leftLeg.rotation.x - ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        rightLeg.rotation.x = THREE.MathUtils.clamp(rightLeg.rotation.x - ((Math.PI/2)/foldingSpeed * delta), 0, Math.PI/2);
        if (rightLeg.rotation.x == 0) {
            rightLeg.userData.nTimes = 0;
        }
    }
    
    let movementX = 0;
    let movementZ = 0;
    // trailer movimentation
    if(keyArrowLHolded) { //left arrow
        movementX -= 16 * delta;
        //trailer.translateX(movement);
    }
    if(keyArrowRHolded) { //right arrow
        movementX += 16 * delta;
        //trailer.translateX(16 * delta);
    }
    if(keyArrowUHolded) { //up arrow
        movementZ -= 16 * delta;
    }
    if(keyArrowDHolded) { //down arrow
        movementZ += 16 * delta;
        //trailer.translateZ(16 * delta);
    }

    trailer.translateX(movementX);
    trailer.translateZ(movementZ);
    trailer.userData.xMax += movementX;
    trailer.userData.xMin += movementX;
    trailer.userData.zMax += movementZ;
    trailer.userData.zMin += movementZ;
}

function update(){
    'use strict';
    let delta = clock.getDelta();
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

    if (!CollisionDetected) {
        handleMovement(delta);
        if (isTruck() && checkCollisions()) {
            CollisionDetected = true;
        }
    }
    if (CollisionDetected) {
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
            cameras[i].cam.left = - 0.5 * frustumSize * aspect;
            cameras[i].cam.right = 0.5 * frustumSize * aspect;
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

    if (e.keyCode == 71) { //g (remove)
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
    // feet rotation
    if (e.keyCode == 81 || e.keyCode == 113) { //key Q/q
        keyQHolded = true;
    }
    if (e.keyCode == 65 || e.keyCode == 97) { //key A/a
        keyAHolded = true;
    }
    // leg rotation
    if (e.keyCode == 87 || e.keyCode == 119) { //key W/w
        keyWHolded = true;
    }
    if (e.keyCode == 83 || e.keyCode == 115) { //key S/s
        keySHolded = true;
    }
    // trailer slide
    if (e.keyCode == 37) { //key arrow left
        keyArrowLHolded = true;
    }
    if (e.keyCode == 39) { //key arrow right
        keyArrowRHolded = true;
    }
    if (e.keyCode == 38) { //key arrow up
        keyArrowUHolded = true;
    }
    if (e.keyCode == 40) { //key arrow down
        keyArrowDHolded = true;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    if (e.keyCode == 71) { //key g (remove)
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
    // feet rotation
    if (e.keyCode == 81 || e.keyCode == 113) { //key Q/q
        keyQHolded = false;
    }
    if (e.keyCode == 65 || e.keyCode == 97) { //key A/a
        keyAHolded = false;
    }
    // leg rotation
    if (e.keyCode == 87 || e.keyCode == 119) { //key W/w
        keyWHolded = false;
    }
    if (e.keyCode == 83 || e.keyCode == 115) { //key S/s
        keySHolded = false;
    }
    // trailer slide
    if (e.keyCode == 37) { //key arrow left
        keyArrowLHolded = false;
    }
    if (e.keyCode == 39) { //key arrow right
        keyArrowRHolded = false;
    }
    if (e.keyCode == 38) { //key arrow up
        keyArrowUHolded = false;
    }
    if (e.keyCode == 40) { //key arrow down
        keyArrowDHolded = false;
    }
}