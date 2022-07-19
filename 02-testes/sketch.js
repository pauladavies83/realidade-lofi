import * as THREE from '../../libs/three.js-r132/build/three.module.js';

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


  const camera = new THREE.PerspectiveCamera();
  camera.position.set(1, 1, 5);

  const renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(500, 500);
  document.body.appendChild(renderer.domElement);

  function animate() {
  requestAnimationFrame( animate );
  cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
  renderer.render( scene, camera );
}
animate();

