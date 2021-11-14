const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor(0xb7c3f3, 1);

const light = new THREE.AmbientLight( 0xffffff ); // LUZ AMBIENTE PARA VER LA FIGURA
scene.add( light );

const start_pos = 3;
const end_pos = -start_pos;
const text = document.querySelector('.text');
const TIME_LIMIT = 10;
let gameStat = 'loading';
let isLookingBackward = true;

function createCube(size, positionX, rotY = 0, color = 0xfbc851) {
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);  // DEFINIMOS LA FORMA GEOMÉTRICA
    const material = new THREE.MeshBasicMaterial( { color: color } ); //DEFINIMOS EL MATERIAL DE LA FORMA, AHORA MISMO SOLO EL COLOR
    const cube = new THREE.Mesh( geometry, material ); //CREAMOS UNA RED QUE COMBINA LA FORMA GEOMÉTRICA Y EL MATERIAL
    cube.position.x = positionX;
    cube.rotation.y = rotY;
    scene.add( cube );
    return cube;
}

camera.position.z = 5; //POSICIÓN DE LA CÁMARA, A MÁS VALOR MÁS PEQUEÑO SE VERÁ EL OBJETO

const loader = new THREE.GLTFLoader();
//FUNCIÓN PARA DETERMINAR CUÁNDO TARDARÁ EN MOVERSE LA MUÑECA
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Doll{
    constructor(){
        //CARGAMOS LA FIGURA. OJO, NO CARGA CON CHROME EL RECURSO EN LOCAL, YO HE UTILIZADO LA EXTENSIÓN LIVE SERVER PARA VSCODE QUE ME PERMITE HACERLO
        loader.load("models/scene.gltf", (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.scale.set(.4, .4, .4);
        gltf.scene.position.set(0, -1, 0);
        this.doll = gltf.scene;
    })
    }

    lookBack() {
        // this.doll.rotation.y = -3.15;
        gsap.to(this.doll.rotation, {y: -3.15, duration: .45})
        setTimeout(() => isLookingBackward = true, 150);
    }

    lookForward() {
        gsap.to(this.doll.rotation, {y: 0, duration: .45})
        setTimeout(() => isLookingBackward = false, 450);
    }
//BUCLE DE MOVIMIENTO DE LA MUÑECA
    async start() {
        this.lookBack();
        await delay((Math.random() * 1000) + 1000);
        this.lookForward();
        await delay((Math.random() * 750) + 750);
        this.start();
    }
}

//FUNCIÓN PARA GENERAR AL CAMINITO A PARTIR DE 3 CUBOS
function createTrack() {
    createCube({w: start_pos * 2 + .2, h: 1.5, d: 1}, 0, 0, 0xe5a716).position.z = -1;
    createCube({w: .2, h: 1.5, d: 1}, start_pos, -.35);
    createCube({w: .2, h: 1.5, d: 1}, end_pos, .35);
}
createTrack();

class Player {
    constructor() {
        const geometry = new THREE.SphereGeometry( .3, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.z = 1;
        sphere.position.x = start_pos;
        scene.add( sphere );
        this.player = sphere;
        this.playerInfo = {
            positionX: start_pos,
            velocity: 0
        }
    }

    run() {
        this.playerInfo.velocity = .03;
    }

    stop() {
        // this.playerInfo.velocity = 0;
        gsap.to(this.playerInfo, {velocity: 0, duration: .2})
    }

    check() {
        if (this.playerInfo.velocity > 0 && !isLookingBackward === true) {
            text.innerText = 'Has muerto, inútil'
            gameStat = 'over'
        }
        if (this.playerInfo.positionX < end_pos + .4) {
            text.innerText = 'Has ganado'
            gameStat = 'over'
        }
    }

    update() {
        this.check();
        this.playerInfo.positionX -= this.playerInfo.velocity;
        this.player.position.x = this.playerInfo.positionX;
    }
}

let player = new Player;
let doll = new Doll;

async function init() {
    await delay(1000);
    text.innerText = "Empieza en 3"
    await delay(1000);
    text.innerText = "Empieza en 2"
    await delay(1000);
    text.innerText = "Empieza en 1"
    await delay(1000);
    text.innerText = "Vamoh a jugá"
    startGame();
}

function startGame() {
    gameStat = 'running';
    let progressBar = createCube({w: 5, h: .1, d: 1}, 0)
    progressBar.position.y = 3.35;
    gsap.to(progressBar.scale, {x: 0, duration: TIME_LIMIT, ease: 'none'})
    doll.start();
    setTimeout(() => {
        if (gameStat !== 'over') {
            text.innerText = 'Se acabó el tiempo, estás fiambre';
            gameStat = 'over';
        }
    }, TIME_LIMIT * 1000);
}
init();

//FUNCIÓN PARA ANIMAR LA FORMA
function animate() {
    if (gameStat === 'over') return;
    // PARA VER ESTA FORMA, NECESARIO RENDERIZAR ASÍ
	renderer.render( scene, camera );
    //SE VUELVE A LLAMAR A LA FUNCIÓN AL FINAL PARA CREAR UN LOOP DE MOVIMIENTO INFINITO
    requestAnimationFrame( animate );
    player.update();

}
animate();

window.addEventListener('resize', onWindowResize, false);
//CON ESTA FUNCIÓN, QUE SE LLAMARÁ CUANDO CAMBIE EL TAMAÑO DE LA VENTANA, HACEMOS A LA FIGURA RESPONSIVE
function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('keydown', (e) => {
    if(gameStat !== 'running') return;
    if(e.key === 'ArrowUp') {
        player.run();
    }
})
window.addEventListener('keyup', (e) => {
    if(e.key === 'ArrowUp') {
        player.stop();
    }
})