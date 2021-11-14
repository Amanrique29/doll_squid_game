
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();  // DEFINIMOS LA FORMA GEOMÉTRICA
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); //DEFINIMOS EL MATERIAL DE LA FORMA, AHORA MISMO SOLO EL COLOR
const cube = new THREE.Mesh( geometry, material ); //CREAMOS UNA RED QUE COMBINA LA FORMA GEOMÉTRICA Y EL MATERIAL
scene.add( cube );

camera.position.z = 5; //POSICIÓN DE LA CÁMARA, A MÁS VALOR MÁS PEQUEÑO SE VERÁ EL OBJETO

//FUNCIÓN PARA ANIMAR LA FORMA
function animate() {
    // PARA VER ESTA FORMA, NECESARIO RENDERIZAR ASÍ
	renderer.render( scene, camera );

    //AQUÍ LE DAMOS UN MOVIMIENTO A LA FORMA. EN ESTE CASO ROTACIÓN VERTICAL, SI PONEMOS "Y" SERÍA HORIZONTAL
    // EL NÚMERO INDICA LA VELOCIDAD DE ROTACIÓN
    cube.rotation.x += 0.01

    //SE VUELVE A LLAMAR A LA FUNCIÓN AL FINAL PARA CREAR UN LOOP DE MOVIMIENTO INFINITO
    requestAnimationFrame( animate );

}
animate();
