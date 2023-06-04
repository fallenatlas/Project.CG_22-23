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

const lambertMaterials = [
    { mat:  new THREE.MeshLambertMaterial({ color: 'lightblue', wireframe: false }) }, //cockpit
    { mat:  new THREE.MeshLambertMaterial({ color: 'grey', wireframe: false }) }, // ovni
    { mat:  new THREE.MeshLambertMaterial({ color: 'yellow', wireframe: false }) }, // lights
    { mat:  new THREE.MeshLambertMaterial({ color: 'chocolate', wireframe: false }) }, // tree
    { mat:  new THREE.MeshLambertMaterial({ color: 'darkgreen', wireframe: false }) }, // tree
];

const phongMaterials = [
    { mat:  new THREE.MeshPhongMaterial({ color: 'lightblue', wireframe: false }) }, //cockpit
    { mat:  new THREE.MeshPhongMaterial({ color: 'grey', wireframe: false }) }, // ovni
    { mat:  new THREE.MeshPhongMaterial({ color: 'yellow', wireframe: false }) }, // lights
    { mat:  new THREE.MeshPhongMaterial({ color: 'chocolate', wireframe: false }) }, // tree
    { mat:  new THREE.MeshPhongMaterial({ color: 'darkgreen', wireframe: false }) }, // tree
];

const toonMaterials = [
    { mat:  new THREE.MeshToonMaterial({ color: 'lightblue', wireframe: false }) }, //cockpit
    { mat:  new THREE.MeshToonMaterial({ color: 'grey', wireframe: false }) }, // ovni
    { mat:  new THREE.MeshToonMaterial({ color: 'yellow', wireframe: false }) }, // lights
    { mat:  new THREE.MeshToonMaterial({ color: 'chocolate', wireframe: false }) }, // tree
    { mat:  new THREE.MeshToonMaterial({ color: 'darkgreen', wireframe: false }) }, // tree
];

const basicMaterials = [
    { mat:  new THREE.MeshBasicMaterial({ color: 'lightblue', wireframe: false }) }, //cockpit
    { mat:  new THREE.MeshBasicMaterial({ color: 'grey', wireframe: false }) }, // ovni
    { mat:  new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: false }) }, // lights
    { mat:  new THREE.MeshBasicMaterial({ color: 'chocolate', wireframe: false }) }, // tree
    { mat:  new THREE.MeshBasicMaterial({ color: 'darkgreen', wireframe: false }) }, // tree
];

// initialize when creating skydome
let skyMaterials = [];

const moonMaterials = [
    {mat: new THREE.MeshLambertMaterial({ color: 0xffd45f, emissive: 0xffd45f, emissiveIntensity: 0.5 }) },
    {mat: new THREE.MeshPhongMaterial({ color: 0xffd45f, emissive: 0xffd45f, emissiveIntensity: 0.5 }) },
    {mat: new THREE.MeshToonMaterial({ color: 0xffd45f, emissive: 0xffd45f, emissiveIntensity: 0.5 })},
    {mat: new THREE.MeshBasicMaterial({ color: 0xffd45f })},
];

const houseMaterials = [
    {mat: new THREE.MeshLambertMaterial( { vertexColors: true } )},
    {mat: new THREE.MeshPhongMaterial( { vertexColors: true } )},
    {mat: new THREE.MeshToonMaterial( { vertexColors: true } )},
    {mat: new THREE.MeshBasicMaterial( { vertexColors: true } )},
];

// cameras
let keyChangeNormalCameraPressed = false;
let keyChangeNormalCameraHeld = false;
// generate grass
let key1Pressed = false;
let key1Held = false;
// generate skybox
let key2Pressed = false;
let key2Held = false;
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

let effect, stereoCamera, groundCamera, perspectiveCamera, activeCamera;
let scene, scene1, renderer, clock;
let skyScene, grassScene, skyTexture, grassTexture, skyTextureCamera, grassTextureCamera;
let grassMaterial, grassPlane;

// scene objects
let skydome, moon, ovni, house;
let trees = [];

// lights
let directionalLight;
let ovniLights = [];

let button;

const skyColors = [];
const grassColors = [];
//const moonColors = [];
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
    initBackground();
    generateSkyboxTexture();
    generateFlowerFieldTexture();
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();

    //const color = 'lightblue';
    //scene.background = new THREE.Color(color);

    createField(0,0,0);
    createSkydome(0,0,0);
    createMoonLights();
    createMoon();
    createOVNI(0,150,0);
    createTrees();
    createHouse(100, 0, 150);
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

    renderer.xr.enabled = false;
    renderer.setSize(1000, 1000);
    renderer.setRenderTarget(skyTexture);
    renderer.render(skyScene, skyTextureCamera);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setRenderTarget(null);

    skyTexture.texture.repeat.set(4, 2);

    renderer.xr.enabled = true;
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

    renderer.xr.enabled = false;
    renderer.setSize(1000, 1000);
    renderer.setRenderTarget(grassTexture);
    renderer.render(grassScene, grassTextureCamera);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setRenderTarget(null);

    grassTexture.texture.repeat.set(2, 2);
    renderer.xr.enabled = true;
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
    stereoCamera = new THREE.StereoCamera();
    stereoCamera.aspect = 0.5;
    stereoCamera.eyeSep = 1;
    perspectiveCamera = createPerspectiveCamera(250, 100, 250, new THREE.Vector3(0, 0, 0));
    groundCamera = createPerspectiveCamera(0, 250, 0, new THREE.Vector3(0, 250, -10));
    //let isoCameraP2 = createPerspectiveCamera(0, 0, 1215, scene.position);
    //let isoCameraP2 = createPerspectiveCamera(1500, 0, 1215, new THREE.Vector3(1500, 0, 0));

    activeCamera = perspectiveCamera;
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

//////////////////
/* MOON LIGHTS  */
//////////////////

function createMoonLights() {
    'use strict';
    let ambientLight = new THREE.AmbientLight( 0xffd45f, 0.2 );

    directionalLight = new THREE.DirectionalLight( 0xffd45f, 0.5 );
    directionalLight.position.set( -200, 190, 50 );
    
    scene.add(ambientLight);
    scene.add(directionalLight);

    //const helper = new THREE.DirectionalLightHelper( directionalLight );
    //scene.add( helper );
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
    skyMaterials = [
        {mat: new THREE.MeshLambertMaterial({map: skyTexture.texture, side: THREE.BackSide}) },
        {mat: new THREE.MeshPhongMaterial({map: skyTexture.texture, side: THREE.BackSide}) },
        {mat: new THREE.MeshToonMaterial({map: skyTexture.texture, side: THREE.BackSide})},
        {mat: new THREE.MeshBasicMaterial({map: skyTexture.texture, side: THREE.BackSide})},
    ];
    const geometry = new THREE.SphereGeometry( 525, 1120, 560 ); 
    skydome = new THREE.Mesh( geometry, skyMaterials[1].mat );
    skydome.position.set(x, y, z);
    scene.add( skydome );
}

function createMoon(x, y, z) {
    'use strict;'
    const geometry = new THREE.SphereGeometry(20);
    moon = new THREE.Mesh(geometry, moonMaterials[1].mat);
    moon.position.set(-200, 190, 50);
    scene.add(moon);
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
    let mesh = new THREE.Mesh(geometry, phongMaterials[1].mat);
    mesh.scale.set(1, 0.35, 1);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCockpit(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.SphereGeometry(20);
    let mesh = new THREE.Mesh(geometry, phongMaterials[0].mat);
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
    let mesh = new THREE.Mesh(geometry, phongMaterials[2].mat);
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
    let mesh = new THREE.Mesh(geometry, phongMaterials[1].mat);
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
    let mesh = new THREE.Mesh(geometry, phongMaterials[3].mat);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addSecondaryTrunk(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.CylinderGeometry( 3, 3, 40); 
    let mesh = new THREE.Mesh(geometry, phongMaterials[3].mat);
    mesh.position.set(x, y, z);
    mesh.rotateZ(Math.PI/4);
    obj.add(mesh);
}

function addThirdTrunk(obj, x, y, z) {
    'use strict';
    let geometry = new THREE.CylinderGeometry( 2, 2, 20); 
    let mesh = new THREE.Mesh(geometry, phongMaterials[3].mat);
    mesh.position.set(x, y, z);
    mesh.rotateX(Math.PI/4);
    obj.add(mesh);
}

function addLeaves(obj, x, y, z, raius) {
    'use strict';
    let geometry = new THREE.SphereGeometry(raius); 
    let mesh = new THREE.Mesh(geometry, phongMaterials[4].mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(1, 0.5, 1);
    obj.add(mesh);
}

function createHouse(x, y, z) {
    'use strict';
    house = new THREE.Object3D();
    addWalls(house);
    addAccessories(house);

    house.position.set(x, y, z);
    scene.add(house);
} 

function addWalls(obj) {
    'use strict';
    let geometry = new THREE.BufferGeometry();

    let vertices = new Float32Array( [
	    -50.0, 0.0,  0.0, // v0
	     50.0, 0.0,  0.0, // v1
	     50.0, 50.0, 0.0, // v2
	    -50.0, 50.0, 0.0, // v3
        -50.0, 0.0, -120.0, // v4
	    50.0, 0.0, -120.0, // v5
	    50.0, 50.0, -120.0, // v6
	    -50.0,  50.0, -120.0, // v7
        0.0, 70.0, 0.0, // v8
        0.0, 70.0, -120.0, // v9
        50.0, 50.0, -10.0, // v10
        50.0, 50.0, -110.0, // v11
        50.0, 0.0,  -10.0, // v12
        50.0, 0.0, -110.0, // v13
        50.0, 40.0,  -10.0, // v14
        50.0, 40.0, -110.0, // v15
        50.0, 25.0,  -10.0, // v16
        50.0, 25.0,  -30.0, // v17
        50.0, 0.0,  -30.0, // v18
        50.0, 40.0,  -30.0, // v19
        50.0, 40.0,  -45.0, // v20
        50.0, 0.0,  -45.0, // v21
        50.0, 40.0,  -75.0, // v22
        50.0, 40.0,  -90.0, // v23
        50.0, 0.0,  -75.0, // v24
        50.0, 0.0,  -90.0, // v25
        50.0, 25.0,  -90.0, // v26
        50.0, 25.0,  -110.0, // v27
    ] );

    const indices = [
	    0, 1, 2, // side near
	    2, 3, 0, // side near
        3, 2, 8, // side near (top)
        4, 6, 5, // side far
	    6, 4, 7, // side far
        6, 7, 9, // side far (top)
        4, 0, 3, // back
        3, 7, 4, // back
        1, 12, 2, // front (face 1)
        12, 10, 2, // front (face 1)
        16, 12, 18, // front (face 2)
        18, 17, 16, // front (face 2)
        18, 21, 19, // front (face 3)
        19, 21, 20, // front (face 3)
        22, 24, 25, // front (face 4)
        22, 25, 23, // front (face 4)
        26, 25, 13, // front (face 5)
        26, 13, 27, // front (face 5)
        5, 11, 13, // front (face 6)
        5, 6, 11, // front (face 6)
        10, 14, 15, // front (face 7)
        10, 15, 11, // front (face 7)

    ];

    const colors = [];
    const _color = new THREE.Color();
    _color.setColorName('white');
    for (let i=0; i < 28; i++) {
        colors.push( _color.r, _color.g, _color.b );
    }

    geometry.setIndex( indices );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh( geometry, houseMaterials[1].mat );

    obj.add(mesh);
}

function addAccessories(obj) {
    'use strict';
    const geometry = new THREE.BufferGeometry();
    
    const vertices = new Float32Array( [
	     50.0, 50.0, 0.0, // v0 roof
	    -50.0, 50.0, 0.0, // v1 roof
	    50.0, 50.0, -120.0, // v2 roof
	    -50.0,  50.0, -120.0, // v3 roof
        0.0, 70.0, 0.0, // v4 roof
        0.0, 70.0, -120.0, // v5 roof
        50.0, 0.0, -45.0, // v6 door
        50.0, 0.0, -75.0, // v7 door
        50.0, 40.0, -45.0, // v8 door
        50.0, 40.0, -75.0, // v9 door
        50.0, 25.0, -10.0, // v10 left window
        50.0, 25.0, -30.0, // v11 left window
        50.0, 40.0, -10.0, // v12 left window
        50.0, 40.0, -30.0, // v13 left window
        50.0, 25.0, -90.0, // v14 right window
        50.0, 25.0, -110.0, // v15 right window
        50.0, 40.0, -90.0, // v16 right window
        50.0, 40.0, -110.0, // v17 right window
    ] );

    const indices = [
	    0, 2, 5, // roof
        5, 4, 0, // roof
        3, 4, 5, // roof
        1, 4, 3, // roof
        7, 9, 8, // door
        6, 7, 8, // door
        11, 13, 12, // left window
        10, 11, 12, // left window
        15, 17, 16, // right window
        14, 15, 16, // right window
    ];

    const colors = [];
    const _color = new THREE.Color();
    _color.setColorName('orangered');
    for (let i=0; i < 6; i++) {
        colors.push( _color.r, _color.g, _color.b );
    }
    _color.setColorName('saddlebrown');
    for (let i=0; i < 4; i++) {
        colors.push( _color.r, _color.g, _color.b );
    }
    _color.setColorName('lightblue');
    for (let i=0; i < 8; i++) {
        colors.push( _color.r, _color.g, _color.b );
    }

    geometry.setIndex( indices );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh( geometry, houseMaterials[1].mat );

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
    'use strict';
    ovni.rotateY(delta * Math.PI/OVNI_SPEED);
}

function handleLights() {
    'use strict';

    if (keyDPressed && !keyDHeld) { //key D
        // activate/deactivate directional light
        keyDHeld = true;
        directionalLight.visible = !directionalLight.visible;
    }

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

function changeMaterials() {
    'use strict';
    if (keyQPressed) { // Lambert
        skydome.material= skyMaterials[0].mat;
        moon.material= moonMaterials[0].mat;
        changeHouseMaterial(0);
        changeTreesMaterial(lambertMaterials);
        changeOvniMaterial(lambertMaterials);
    }
    if (keyWPressed) { // Phong
        skydome.material= skyMaterials[1].mat;
        moon.material= moonMaterials[1].mat;
        changeHouseMaterial(1);
        changeTreesMaterial(phongMaterials);
        changeOvniMaterial(phongMaterials);
    }
    if (keyEPressed) { // Toon
        skydome.material= skyMaterials[2].mat;
        moon.material= moonMaterials[2].mat;
        changeHouseMaterial(2);
        changeTreesMaterial(toonMaterials);
        changeOvniMaterial(toonMaterials);

    }
    if (keyRPressed) { // Basic
        skydome.material= skyMaterials[3].mat;
        moon.material= moonMaterials[3].mat;
        changeHouseMaterial(3);
        changeTreesMaterial(basicMaterials);
        changeOvniMaterial(basicMaterials);

    }
}

function changeHouseMaterial(pos) {
    'use strict';
    house.traverse( ( obj ) => {
        if ( obj instanceof THREE.Mesh ) obj.material = houseMaterials[pos].mat;
    } );
}

function changeTreesMaterial(materials) {
    'use strict';
    const colors = [3, 4, 3, 4, 3, 4];
    for (let i=0; i < 3; i++) {
        let j=0;
        trees[i].traverse( ( obj ) => {
            if ( obj instanceof THREE.Mesh ) {
                obj.material = materials[colors[j]].mat;
                j++;
            }
        } );
    }
}

function changeOvniMaterial(materials) {
    'use strict';
    const colors = [1, 0, 2, 2, 2, 2, 2, 2, 1];
    let j=0;
    ovni.traverse( ( obj ) => {
        if ( obj instanceof THREE.Mesh ) {
            obj.material = materials[colors[j]].mat;
            j++;
        }
    } );
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

    if (keyChangeNormalCameraPressed && !keyChangeNormalCameraHeld) { //key 1
        keyChangeNormalCameraHeld = true;
        //const button = document.getElementById("VRButton");
        //button.click();
        //button.onSessionEnded();
        activeCamera = perspectiveCamera;
    }

    if (key1Pressed && !key1Held) { //key 1
        key1Held = true;
        generateFlowerFieldTexture();
        grassMaterial.map = grassTexture.texture;
    }

    if (key2Pressed && !key2Held) { //key 2
        key2Held = true;
        generateSkyboxTexture();
        for (let i=0; i<4; i++) {
            skyMaterials[i].mat.map = skyTexture.texture;
        }
    }

    changeMaterials();
    handleLights();
    handleOvniMovement(delta);
    handleOvniRotation(delta);
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    if (renderer.xr.isPresenting) {
        activeCamera = groundCamera;
        
        activeCamera.updateWorldMatrix();
        stereoCamera.update(activeCamera);

        let size = new THREE.Vector2();
        renderer.getSize(size);

        renderer.setScissorTest(true);

        renderer.setScissor(0, 0, size.width / 2, size.height);
        renderer.setViewport(0, 0, size.width / 2, size.height);
        renderer.render(scene, stereoCamera.cameraL);

        renderer.setScissor(size.width / 2, 0, size.width / 2, size.height);
        renderer.setViewport(size.width / 2, 0, size.width / 2, size.height);
        renderer.render(scene, stereoCamera.cameraR);

        renderer.setScissorTest(false);
    }
    else {
        renderer.render(scene, activeCamera);
    }
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

    // vr camera
    button = VRButton.createButton( renderer );
    document.body.appendChild( button );
    renderer.xr.enabled = true;

    renderer.setAnimationLoop( animate );

    createCameras();
    createTextureScene();
    createScene();
    createClock();

    render();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);

    //renderer.xr.addEventListener('sessionstart', hi);

    //renderer.xr.addEventListener('sessionend', hi);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////

function animate() {
    'use strict';
    update();
    render();
    //requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        const aspect = window.innerWidth / window.innerHeight;
        perspectiveCamera.aspect = aspect;
        perspectiveCamera.updateProjectionMatrix();

        groundCamera.aspect = aspect;
        groundCamera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////

function onKeyDown(e) {
    'use strict';
    if (e.keyCode == 53) { //keys 1 to 5
        keyChangeNormalCameraPressed = true;
    }

    if (e.keyCode == 49) { //key 1
        key1Pressed = true;
    }

    if (e.keyCode == 50) { // key 2
        key2Pressed = true;
    }

     // moon diretional light
     if (e.keyCode == 68 || e.keyCode == 100) { //key D/d
        keyDPressed = true;
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

    // change materials to lambertMaterial
    if (e.keyCode == 81 || e.keyCode == 113) { //key Q/q
        keyQPressed = true;
    }
    // change materials to phongMaterial
    if (e.keyCode == 87 || e.keyCode == 119) { //key W/w
        keyWPressed = true;
    }
    // change materials to toonMaterial
    if (e.keyCode == 69 || e.keyCode == 101) { //key E/e
        keyEPressed = true;
    }
    
    if (e.keyCode == 82 || e.keyCode == 114) { //key R/r
        keyRPressed = true;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////

function onKeyUp(e){
    'use strict';
    if (e.keyCode == 53) { //keys 1 to 5
        keyChangeNormalCameraPressed = false;
        keyChangeNormalCameraHeld = false;
    }

    if (e.keyCode == 49) { //key 1
        key1Pressed = false;
        key1Held = false;
    }
    if (e.keyCode == 50) { //key 2
        key2Pressed = false;
        key2Held = false;
    }

    // directional light
    if (e.keyCode == 68 || e.keyCode == 100) { //key D/d
        keyDPressed = false;
        keyDHeld = false;
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


/*
let skyScene, grassScene, moonScene, skyTexture, grassTexture, moonTexture, skyTextureCamera, grassTextureCamera, moonTextureCamera;
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

initBackground
_color.setColorName('moon yellow');
    moonColors.push( _color.r, _color.g, _color.b );
    moonColors.push( _color.r, _color.g, _color.b );
    moonColors.push( _color.r, _color.g, _color.b );
    moonColors.push( _color.r, _color.g, _color.b );
    moonColors.push( _color.r, _color.g, _color.b );
    moonColors.push( _color.r, _color.g, _color.b );
*/

/*
function toggleMoonLight() {
    isLightOn = !isLightOn;
    directionalLight.visible = isLightOn;
}
*/

