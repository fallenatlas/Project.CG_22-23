//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

// render to frame buffer
// heightmap
// fazer load da texture
// definir texture map

const FRUSTUM_SIZE = 600;

const CAMERA_INPUTS = [49, 50];
const KEY_CODE_OFFSET = 49;

const OVNI_SPEED = 32;
const OVNI_N_LIGHTS = 6;

const materials = [
    { mat:  new THREE.MeshBasicMaterial({ color: 'white', wireframe: false }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: false }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'plum', wireframe: false }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'skyblue', wireframe: false }) },
]

const PhongMaterials = [
    { mat:  new THREE.MeshPhongMaterial({ color: 'lightblue', wireframe: false }) }, //cockpit
    { mat:  new THREE.MeshPhongMaterial({ color: 'grey', wireframe: false }) }, // ovni
    { mat:  new THREE.MeshPhongMaterial({ color: 'yellow', wireframe: false }) }, // lights
    { mat:  new THREE.MeshPhongMaterial({ color: 'chocolate', wireframe: false }) }, // tree
    { mat:  new THREE.MeshPhongMaterial({ color: 'darkgreen', wireframe: false }) }, // tree
]

// cameras
let keyCamerasPressed = [false, false];
// generate grass
let key1Pressed = false;
let key1Held = false;
// generate skybox
let key2Pressed = false;
let key2Held = false;

let key6Pressed = false;
let key6Held = false;
// switch moon lights on and off
let keyDPressed = false;
let keyDHeld = false;
// switch OVNI's point lights
let keyPPressed = false;
let keyPHeld = false;
// switch OVNI's spot light
let keySPressed = false;
let keySHeld = false;
// OVNI movement
let keyArrowLPressed = false;
let keyArrowRPressed = false;
let keyArrowUPressed = false;
let keyArrowDPressed = false;
// change materials
let keyWPressed = false;
let keyEPressed = false;
let keyQPressed = false;
let keyRPressed = false;

let activeCamera, cameras, scene, scene1, renderer, clock;
let skyScene, grassScene, moonScene, skyTexture, grassTexture, moonTexture, skyTextureCamera, grassTextureCamera, moonTextureCamera;
let skyMaterial, skydome;
let moonMaterial, moon;
let ovni;
let ambientLight, directionalLight, isLightOn = true;
let lambertMaterial, phongMaterial, toonMaterial;
let ovniLights = [];
let trees = [];

const skyColors = [];
const grassColors = [];
const moonColors = [];
const vertices = new Float32Array( [
    -500.0, -500.0,  500.0, // v0
    500.0, -500.0,  500.0, // v1
    500.0,  500.0,  500.0, // v2

    500.0,  500.0,  500.0, // v3
    -500.0,  500.0,  500.0, // v4
    -500.0, -500.0,  500.0  // v5
] );
let setBackground = false;
let backgroundGeometry1, backgroundGeometry2, backgroundMaterial;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createTextureScene(){
    'use strict';
    //scene = new THREE.Scene();

    /*
    const color = 'lightblue';
    scene.background = new THREE.Color(color);
    */

    initBackground();
    generateSkyboxTexture();
    generateFlowerFieldTexture();
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();

    const color = 'lightblue';
    scene.background = new THREE.Color(color);

    const light = new THREE.AmbientLight( 0xfefcd7, 0.2 );
    scene.add( light );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );

    createField(0,0,0);
    createSkydome(0,0,0);
    createMoon(0,250,0);
    //createOVNI(0, 50, 0);
    //createHouse();
    //create
}

/////////////////////
/* CREATE TEXTURES */
/////////////////////
function addCircle(obj, size, x, y, z, material) {
    'use strict';
    let geometry = new THREE.CircleGeometry(size);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addStars() {
    'use strict';
    for (let i = 0; i < 250; i++) {
        addCircle(skyScene, 2, getRandomInt(490), getRandomInt(490), 501, materials[0].mat);
    }
}

function addFlowers() {
    'use strict';
    for (let i = 0; i < 250; i++) {
        addCircle(grassScene, 2.5, getRandomInt(490), getRandomInt(490), 501, materials[getRandomIndex(3)].mat);
    }
}

function getRandomInt(max) {
    return Math.floor((Math.random()-0.5)* 2 * max);
}

function getRandomIndex(max) {
    return Math.round(Math.random() * max);
}

function initBackground() {
    backgroundGeometry1 = new THREE.BufferGeometry();
    backgroundGeometry2 = new THREE.BufferGeometry();

    const _color = new THREE.Color();
    _color.setColorName('blueviolet');
    skyColors.push( _color.r, _color.g, _color.b );
    _color.setColorName('blueviolet');
    skyColors.push( _color.r, _color.g, _color.b );
    _color.setColorName('darkblue');
    skyColors.push( _color.r, _color.g, _color.b );
    _color.setColorName('darkblue');
    skyColors.push( _color.r, _color.g, _color.b );
    _color.setColorName('darkblue');
    skyColors.push( _color.r, _color.g, _color.b );
    _color.setColorName('blueviolet');
    skyColors.push( _color.r, _color.g, _color.b );

    _color.setColorName('forestgreen');
    grassColors.push( _color.r, _color.g, _color.b );
    grassColors.push( _color.r, _color.g, _color.b );
    grassColors.push( _color.r, _color.g, _color.b );
    grassColors.push( _color.r, _color.g, _color.b );
    grassColors.push( _color.r, _color.g, _color.b );
    grassColors.push( _color.r, _color.g, _color.b );
    _color.setColorName('moon yellow');
    moonColors.push( _color.r, _color.g, _color.b );
    moonColors.push( _color.r, _color.g, _color.b );
    moonColors.push( _color.r, _color.g, _color.b );
    moonColors.push( _color.r, _color.g, _color.b );
    moonColors.push( _color.r, _color.g, _color.b );
    moonColors.push( _color.r, _color.g, _color.b );
    
    backgroundMaterial = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, vertexColors: true } );
}

function generateSkyboxTexture() {
    // Create a different scene to hold our buffer objects 
    skyScene = new THREE.Scene();
    // Create the texture that will store our result 
    skyTexture = new THREE.WebGLRenderTarget( 1000, 1000, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, wrapS: THREE.MirroredRepeatWrapping, wrapT: THREE.MirroredRepeatWrapping});
    
    backgroundGeometry1.setAttribute( 'color', new THREE.Float32BufferAttribute( skyColors, 3 ) );
    backgroundGeometry1.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    let mesh = new THREE.Mesh( backgroundGeometry1, backgroundMaterial );
    skyScene.add( mesh );
    addStars();

    renderer.setSize(1000, 1000);
    renderer.setRenderTarget(skyTexture);
    renderer.render(skyScene, skyTextureCamera);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setRenderTarget(null);

    skyTexture.texture.repeat.set(4, 2);
}

function generateFlowerFieldTexture() {
    // Create a different scene to hold our buffer objects 
    grassScene = new THREE.Scene();
    // Create the texture that will store our result 
    grassTexture = new THREE.WebGLRenderTarget( 1000, 1000, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, wrapS: THREE.MirroredRepeatWrapping, wrapT: THREE.MirroredRepeatWrapping});
 
    backgroundGeometry2.setAttribute( 'color', new THREE.Float32BufferAttribute( grassColors, 3 ) );
    backgroundGeometry2.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    let mesh = new THREE.Mesh( backgroundGeometry2, backgroundMaterial );
    grassScene.add( mesh );
    addFlowers();

    renderer.setSize(1000, 1000);
    renderer.setRenderTarget(grassTexture);
    renderer.render(grassScene, grassTextureCamera);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setRenderTarget(null);

    grassTexture.texture.repeat.set(2, 2);
}

/*
function generateMoonTexture() {
    // Create a different scene to hold our buffer objects
    moonScene = new THREE.Scene();
    // Create the texture that will store our result
    moonTexture = new THREE.WebGLRenderTarget( 1000, 1000, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, wrapS: THREE.MirroredRepeatWrapping, wrapT: THREE.MirroredRepeatWrapping});

    backgroundGeometry2.setAttribute( 'color', new THREE.Float32BufferAttribute( moonColors, 3 ) );
    backgroundGeometry2.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    let mesh = new THREE.Mesh( backgroundGeometry2, backgroundMaterial );
    moonScene.add(mesh);

    renderer.setSize(1000, 1000);
    renderer.setRenderTarget(moonTexture);
    renderer.render(moonScene, moonTextureCamera);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setRenderTarget(null);

    moonTexture.texture.repeat.set(1, 1);
}
*/
/////////////////////
/* CREATE CLOCK    */
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
    skyTextureCamera = createOrthogonalCamera(0, 0, 1215, 1);
    grassTextureCamera = createOrthogonalCamera(0, 0, 1215, 1);
    //let topViewCamera = createOrthogonalCamera(0, 200, 0, 1);
    //let isoCameraO = createOrthogonalCamera(50, 50, 50, 2);
    let isoCameraP1 = createPerspectiveCamera(250, 100, 250, new THREE.Vector3(0, 0, 0));
    //let isoCameraP2 = createPerspectiveCamera(0, 0, 1215, scene.position);
    //let isoCameraP2 = createPerspectiveCamera(1500, 0, 1215, new THREE.Vector3(1500, 0, 0));

    cameras = [
        { cam: isoCameraP1 },
        //{ cam: isoCameraP2 },
    ];

    activeCamera = isoCameraP1;
}

function createOrthogonalCamera(x, y, z, zoom) {
    'use strict';
    let camera = new THREE.OrthographicCamera(-500, 500, 500, -500, 1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.zoom = zoom;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    camera.updateProjectionMatrix();

    return camera;
}

function createPerspectiveCamera(x, y, z, lookat) {
    'use strict';
    const aspect = window.innerWidth / window.innerHeight;
    let camera = new THREE.PerspectiveCamera(70, aspect, 1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(lookat);

    return camera;
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createField(x, y, z) {
    'use strict';
    let geometry = new THREE.PlaneGeometry( 600, 600, 300, 300 );
    const loader = new THREE.TextureLoader();
    const displacement = loader.load('js/heightmap.png');
    //displacement.wrapS = displacement.wrapT = THREE.MirroredRepeatWrapping;
    //displacement.repeat.set(2, 2);
    grassMaterial = new THREE.MeshStandardMaterial({
        displacementScale: 50,
        displacementMap: displacement,
        map: grassTexture.texture
    });

    grassPlane = new THREE.Mesh( geometry, grassMaterial );
    grassPlane.rotateX(-Math.PI / 2);
    grassPlane.position.set(x, y, z);
    scene.add( grassPlane );
}

function createSkydome(x, y, z) {
    'use strict';
    const geometry = new THREE.SphereGeometry( 525, 1120, 560 ); 
    skyMaterial = new THREE.MeshBasicMaterial( {map: skyTexture.texture, side: THREE.BackSide} );

    skydome = new THREE.Mesh( geometry, skyMaterial );
    skydome.position.set(x, y, z);
    scene.add( skydome );
}

function createMoon(x, y, z) {
    'use strict;'
    const geometry = new THREE.SphereGeometry( 50, 32, 32 );
    moonMaterial = new THREE.MeshBasicMaterial( {color:  'moon yellow'} ); // 0xfefcd7 - glowing moon yellow
    
    lambertMaterial = new THREE.MeshLambertMaterial({
        color: 'moon yellow', 
        emissive: 0xffff00,
        emissiveIntensity: 1,
    });
    
    phongMaterial = new THREE.MeshPhongMaterial({
        color: 'moon yellow',
        emissive: 0xffff00,
        emissiveIntensity: 1,
    });
    
    toonMaterial = new THREE.MeshToonMaterial({
        color: 'moon yellow',
        emissive: 0xffff00,
        emissiveIntensity: 1,
    });
    
    moon = new THREE.Mesh(geometry, moonMaterial);
    moon.position.set(x, y, z);
    scene.add(moon);
}

//////////////////
/* MOON LIGHTS  */
//////////////////

function createMoonLights() {
    ambientLight = new AmbientLight('moon yellow', 2);
    
    directionalLight = new DirectionalLight('moon yellow', 5);
    directionalLight.position.set( 10, 10, 10 );
    
    scene.add(ambientLight);
    scene.add(directionalLight);
}

function toggleMoonLight() {
    isLightOn = !isLightOn;
    directionalLight.visible = isLightOn;
}

function createOVNI(x, y, z) {
    'use strict';
    ovni = new THREE.Object3D();
    addBody(ovni, 0, 0, 0);
    addCockpit(ovni, 0, 50*0.35, 0);
    addPointLights(ovni);
    addBottom(ovni, 0, -50*0.35, 0);

    scene.add(ovni);

    ovni.position.set(x, y, z);
}

function addBody(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.SphereGeometry(50);
    let mesh = new THREE.Mesh(geometry, PhongMaterials[1].mat);
    mesh.scale.set(1, 0.35, 1);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCockpit(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.SphereGeometry(20);
    let mesh = new THREE.Mesh(geometry, PhongMaterials[0].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addPointLights(obj, x, y, z) {
    'use strict';
    let rotation = 0;

    for (let i=0; i < OVNI_N_LIGHTS; i++) {
        addPointLight(obj, rotation);
        rotation += Math.PI*2/OVNI_N_LIGHTS;
    }
}

function addPointLight(obj, rotation) {
    'use strict';
    let light = new THREE.Object3D();

    let geometry = new THREE.SphereGeometry(2);
    let mesh = new THREE.Mesh(geometry, PhongMaterials[2].mat);
    mesh.position.set(30, 0, 0);
    light.add(mesh);

    // add light
    let pointlight = new THREE.PointLight(0xffffff, 2, 40);
    pointlight.position.set( 30, -2.5, 0);
    ovniLights.push(pointlight);
    light.add(pointlight);
    
    light.position.set(0, -14, 0);
    light.rotateY(rotation);
    obj.add(light);
    

    //const helper = new THREE.PointLightHelper(pointlight, 1);
    //scene.add(helper);
}

function addBottom(obj, x, y, z) {
    'use strict';
    let bottom = new THREE.Object3D();

    // add cylinder
    let geometry = new THREE.CylinderGeometry( 20, 20, 8, 40 ); 
    let mesh = new THREE.Mesh(geometry, PhongMaterials[1].mat);
    bottom.add(mesh);

    // add Spot Light
    let spotLight = new THREE.SpotLight( 0xffffff, 10, 150, Math.PI/6 );
    ovniLights.push(spotLight);
    bottom.add(spotLight);

    bottom.position.set(x, y, z);
    obj.add(bottom);

    //const helper = new THREE.SpotLightHelper(spotLight);
    //scene.add(helper);

}

function createTrees() {
    'use strict';
    addTree(0, 0, 0, 1, 0);
    addTree(-100, 0, 100, 1.5, Math.PI);
    addTree(0, 0, 200, 0.7, Math.PI/2);
    addTree(0, 0, 0, 1, 0);
}

function addTree(x, y, z, scale, rotation) {
    'use strict';
    let tree = new THREE.Object3D();
    addTrunk(tree, 0, 0, 0);
    addLeaves(tree, 0, 30, 0, 30);
    addSecondaryTrunk(tree, -14, -3, 0);
    addLeaves(tree, -25, 10, 0, 17);
    addThirdTrunk(tree, -12 ,2 ,8);
    addLeaves(tree, -12, 8, 15, 10);
    tree.scale.set(scale, scale, scale);
    tree.rotateY(rotation);
    tree.position.set(x, y+60*scale/2, z);

    scene.add(tree);
    trees.push(tree);
}

function addTrunk(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.CylinderGeometry( 6, 6, 60); 
    let mesh = new THREE.Mesh(geometry, PhongMaterials[3].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addSecondaryTrunk(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.CylinderGeometry( 3, 3, 40); 
    let mesh = new THREE.Mesh(geometry, PhongMaterials[3].mat);
    mesh.position.set(x, y, z);
    mesh.rotateZ(Math.PI/4);
    obj.add(mesh);
}

function addThirdTrunk(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.CylinderGeometry( 2, 2, 20); 
    let mesh = new THREE.Mesh(geometry, PhongMaterials[3].mat);
    mesh.position.set(x, y, z);
    mesh.rotateX(Math.PI/4);
    obj.add(mesh);
}

function addLeaves(obj, x, y, z, raius) {
    'use strict';
    let geometry = new THREE.SphereGeometry(raius); 
    let mesh = new THREE.Mesh(geometry, PhongMaterials[4].mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(1, 0.5, 1);
    obj.add(mesh);
}

////////////
/* UPDATE */
////////////

function handleOvniMovement(delta) {
    'use strict';
    let translation = new THREE.Vector3(0, 0, 0);
    // OVNI movement
    if(keyArrowLPressed) { //left arrow
        translation.x -= 1;
    }
    if(keyArrowRPressed) { //right arrow
        translation.x += 1;
    }
    if(keyArrowUPressed) { //up arrow
        translation.z -= 1;
    }
    if(keyArrowDPressed) { //down arrow
        translation.z += 1;
    }
    if (translation.x != 0 || translation.z != 0) {
        translation.normalize();
        translation = translation.multiplyScalar(OVNI_SPEED * delta);
        ovni.position.add(translation);
    }
    // update spot light's target
    ovniLights[OVNI_N_LIGHTS].target.position.add(translation);
    ovniLights[OVNI_N_LIGHTS].target.updateMatrixWorld();
}

function handleOvniRotation(delta) {
    ovni.rotateY(delta * Math.PI/OVNI_SPEED);
}

function handleOvniLights() {
    if (keyPPressed && !keyPHeld) { //key P
        // activate/deactivate point lights
        keyPHeld = true;
        for (let i=0; i<=OVNI_N_LIGHTS-1; i++) {
            ovniLights[i].visible = !ovniLights[i].visible;
        }
    }

    if (keySPressed && !keySHeld) { //key S
        // activate/deactivate ovni spot light
        keySHeld = true;
        ovniLights[OVNI_N_LIGHTS].visible = !ovniLights[OVNI_N_LIGHTS].visible;
    }
}

function update(){
    'use strict';
    let delta = clock.getDelta();

    //for(let i=0; i<2; i++) {
    //    if (keyCamerasPressed[i]) {
            /*
            if (i == 0) {
                activeCamera = skyTextureCamera;
                renderer.setSize(1000, 1000);
            }
            if (i == 1) {
                activeCamera = cameras[0].cam;
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
            */
            //activeCamera = cameras[i].cam;
    //    }
    //}

    if (key1Pressed && !key1Held) { //key 1
        key1Held = true;
        generateFlowerFieldTexture();
        grassMaterial.map = grassTexture.texture;
    }

    if (key2Pressed && !key2Held) { //key 2
        key2Held = true;
        generateSkyboxTexture();
        skyMaterial.map = skyTexture.texture;
    }

    handleOvniMovement(delta);
    handleOvniRotation(delta);
    handleOvniLights();

    /*
    if (key6Pressed && !key6Held) { //key 6
        key6Held = true;
        for (let i=0; i < 4; i++) {
            materials[i].mat.wireframe = !materials[i].mat.wireframe;
        }
    }
    
    */
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
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

    createCameras();
    createTextureScene();
    createScene();
    createClock();

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
        for (let i = 0; i < 1; i++) {
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
    if (CAMERA_INPUTS.includes(e.keyCode)) { //keys 1 to 5
        keyCamerasPressed[e.keyCode - KEY_CODE_OFFSET] = true;
    }

    if (e.keyCode == 49) {
        key1Pressed = true;
    }

    if (e.keyCode == 50) {
        key2Pressed = true;
    }

    if (e.keyCode == 50) {
        generateSkyboxTexture();
        skyMaterial.map = skyTexture.texture;
    }
    // OVNI lights
    if (e.keyCode == 83) { //key S
        keySPressed = true;
    }

    if (e.keyCode == 80) { //key P
        keyPPressed = true;
    }

    // OVNI movement
    if (e.keyCode == 37) { //key arrow left
        keyArrowLPressed = true;
    }
    if (e.keyCode == 39) { //key arrow right
        keyArrowRPressed = true;
    }
    if (e.keyCode == 38) { //key arrow up
        keyArrowUPressed = true;
    }
    if (e.keyCode == 40) { //key arrow down
        keyArrowDPressed = true;
    }
    // change materials
    if (e.keyCode == 81 || e.keyCode == 113) { //key Q/q
        keyQPressed = true;
    }

    if (e.keyCode == 87 || e.keyCode == 119) { //key W/w
        keyWPressed = true;
    }

    if (e.keyCode == 69 || e.keyCode == 101) { //key E/e
        keyEPressed = true;
    }
    if (e.keyCode == 82 || e.keyCode == 114) { //key R/r
        keyRPressed = true;
    }

    // moon light on
    if (e.keyCode == 68 || e.keyCode == 100) { //key D/d
        toggleMoonLight();
    }
    // moon lambertMaterial
    if (e.keyCode == 81 || e.keyCode == 113) { //key Q/q
        moon.moonMaterial = lambertMaterial;
    }
    // moon phongMaterial
    if (e.keyCode == 69 || e.keyCode == 101) { //key E/e
        moon.moonMaterial = phongMaterial;
    }
    // moon toonMaterial
    if (e.keyCode == 87 || e.keyCode == 119) { //key W/w
        moon.moonMaterial = toonMaterial;
    }

    /*
    if (e.keyCode = 50) {
        generateFlowerFieldTexture();
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
    */
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////

function onKeyUp(e){
    'use strict';
    if (CAMERA_INPUTS.includes(e.keyCode)) { //keys 1 to 5
        keyCamerasPressed[e.keyCode - KEY_CODE_OFFSET] = false;
    }

    if (e.keyCode == 54) { //key 6
        key6Pressed = false;
        key6Held = false;
    }
    if (e.keyCode == 50) { //key 6
        key2Pressed = false;
        key2Held = false;
    }

    // directional light
    if (e.keyCode == 68 || e.keyCode == 100) { //key D/d
        keyDPressed = true;
    }

    // OVNI lights
    if (e.keyCode == 83) { //key S
        keySPressed = false;
        keySHeld = false;
    }

    if (e.keyCode == 80) { //key P
        keyPPressed = false;
        keyPHeld = false;
    }

    // OVNI movement
    if (e.keyCode == 37) { //key arrow left
        keyArrowLPressed = false;
    }
    if (e.keyCode == 39) { //key arrow right
        keyArrowRPressed = false;
    }
    if (e.keyCode == 38) { //key arrow up
        keyArrowUPressed = false;
    }
    if (e.keyCode == 40) { //key arrow down
        keyArrowDPressed = false;
    }
    // change materials
    if (e.keyCode == 81 || e.keyCode == 113) { //key Q/q
        keyQPressed = false;
    }

    if (e.keyCode == 87 || e.keyCode == 119) { //key W/w
        keyWPressed = false;
    }

    if (e.keyCode == 69 || e.keyCode == 101) { //key E/e
        keyEPressed = false;
    }
    if (e.keyCode == 82 || e.keyCode == 114) { //key R/r
        keyRPressed = false;
    }
}

