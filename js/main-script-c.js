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
const OVNI_ROTATION = 16;

const materials = [
    { mat:  new THREE.MeshBasicMaterial({ color: 'white', wireframe: false }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: false }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'plum', wireframe: false }) },
    { mat:  new THREE.MeshBasicMaterial({ color: 'skyblue', wireframe: false }) },
]

// cameras
let keyCamerasPressed = [false, false];
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

let activeCamera, cameras, scene, scene1, renderer, clock;
let skyScene, grassScene, moonScene, skyTexture, grassTexture, moonTexture, skyTextureCamera, grassTextureCamera, moonTextureCamera;
let skyMaterial, skydome;
let moonMaterial, moon;
let ovni;
let ambientLight, directionalLight, isLightOn = true;
let lambertMaterial, phongMaterial, toonMaterial;

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
    //generateFlowerFieldTexture();
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();

    const color = 'lightblue';
    scene.background = new THREE.Color(color);

    //createField(0,0,0);
    createSkydome(0,0,0);
    createMoon(0,100,0);
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

    grassTexture.texture.repeat.set(1, 1);
}

// propriedades de emissividade do material por forma a que a lua seja brilhante
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
    let isoCameraP1 = createPerspectiveCamera(250, 250, 250, new THREE.Vector3(0, 0, 0));
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
    const geometry = new THREE.PlaneGeometry( 500, 500 );
    const loader = new THREE.TextureLoader();
    const displacement = loader.load('heightmap.png');
    const material = new THREE.MeshStandardMaterial({
        displacementMap: displacement,
        displacementScale: 1,
        map: grassTexture
    });

    const plane = new THREE.Mesh( geometry, material );
    plane.position.set(x, y, z);
    scene.add( plane );
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

////////////
/* UPDATE */
////////////
/*
function handleOvniMovement(delta) {
    'use strict';
    let translation = new THREE.Vector3(0, 0, 0);
    // trailer movement
    if(keyArrowLHeld) { //left arrow
        translation.x -= 1;
    }
    if(keyArrowRHeld) { //right arrow
        translation.x += 1;
    }
    if(keyArrowUHeld) { //up arrow
        translation.z -= 1;
    }
    if(keyArrowDHeld) { //down arrow
        translation.z += 1;
    }
    if (translation.x != 0 || translation.z != 0) {
        translation.normalize();
        translation = translation.multiplyScalar(TRAILER_SPEED * delta);
        trailer.position.add(translation);
        updateAABBTrailer(translation.x, translation.z);
    }
}

function handleOvniRotation() {

}

function handleMovement(delta) {
    'use strict';
    handleOvniMovement(delta);
}

*/

function update(){
    'use strict';
    let delta = clock.getDelta();

    for(let i=0; i<2; i++) {
        if (keyCamerasPressed[i]) {
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
        }
    }

    /*
    if (key6Pressed && !key6Held) { //key 6
        key6Held = true;
        for (let i=0; i < 4; i++) {
            materials[i].mat.wireframe = !materials[i].mat.wireframe;
        }
    }
    
    handleMovement(delta);
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
        for (let i = 0; i < 2; i++) {
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

    if (e.keyCode == 50) {
        generateSkyboxTexture();
        skyMaterial.map = skyTexture.texture;
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

    // moon light off
    if (e.keyCode == 68 || e.keyCode == 100) { //key D/d
        keyDHeld = true;
    }
    /*
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
    */
}

