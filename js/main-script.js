//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

const frustumSize = 600;

const cameraInputs = [49, 50, 51, 52, 53];
const keyCodeOffset = 49;

let activeCamera, cameras, scene, renderer;

let geometry, material, mesh;

let ball;

let key6Pressed = false;
let key6Holded = false;
let keyEPressed = false;
let keyEHolded = false;

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

    //createRobot(0, 8, 0);
    //createTrailer(0, 0, 15);
    createTable(0, 8, 0);
    createBall(0, 0, 15);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCameras() {
    'use strict';
    let frontViewCamera = createOrthogonalCamera(0, 0, 50);
    let latViewCamera = createOrthogonalCamera(50, 0, 0);
    let topViewCamera = createOrthogonalCamera(0, 50, 0);
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

function addTableLeg(obj, x, y, z) {
    'use strict';

    let geometry = new THREE.BoxGeometry(2, 6, 2);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);
}

function addTableTop(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.BoxGeometry(60, 2, 20);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createBall(x, y, z) {
    'use strict';

    ball = new THREE.Object3D();
    ball.userData = { jumping: true, step: 0 };

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.SphereGeometry(4, 10, 10);
    mesh = new THREE.Mesh(geometry, material);

    ball.add(mesh);

    scene.add(ball);

    ball.position.set(x, y, z);
}


function createTable(x, y, z) {
    'use strict';

    let table = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    
    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -25, -1, -8);
    addTableLeg(table, -25, -1, 8);
    addTableLeg(table, 25, -1, 8);
    addTableLeg(table, 25, -1, -8);

    scene.add(table);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}

function addFace(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.SphereGeometry(2, 2, 2);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addEye(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.SphereGeometry(0.5, 0.5, 0.5);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addAntenna(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.SphereGeometry(1, 3, 1);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(obj, x, y, z) {
    let head = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addFace(head, 0, 2, 0);
    addEye(head, 1, 3, 1.4);
    addEye(head, -1, 3, 1.4);
    addAntenna(head, 2, 3.5, 0);
    addAntenna(head, -2, 3.5, 0);

    obj.add(head);

    head.position.x = x;
    head.position.y = y;
    head.position.z = z;
}

function createRobot(x, y, z) {
    'use strict';

    let robot = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addHead();
    addAbdomen();
    //-->addCintura();
    //---->addWheel();
    //---->addLeg();
    //------->addFoot();
    addArm();

    scene.add(robot);

    robot.position.x = x;
    robot.position.y = y;
    robot.position.z = z;
}

function createTrailer(x, y, z) {
    'use strict';

    let trailer = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    
    //addContainer();
    //addWheel();

    scene.add(trailer);

    trailer.position.x = x;
    trailer.position.y = y;
    trailer.position.z = z;
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
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
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
    
    if (ball.userData.jumping) {
        ball.userData.step += 0.04;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }
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