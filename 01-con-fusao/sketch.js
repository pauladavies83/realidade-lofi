// let capture;
// let pn = 0;
// let tam = 5;
// let nuvem = 10000;

// function setup() {
//   createCanvas(320, 240);
//   capture = createCapture(VIDEO);
//   capture.size(320, 240);
//   capture.hide();
// }

// function draw() {
//   background(255);
//   image(capture, 0, 0, 320, 240);

//     for (let i = 0; i < nuvem; i++) {
//       let x = map(noise(pn), 0, 1, 0, width-tam);
//       let y = map(noise(pn+10), 0, 1, 0, height-tam);

//       fill(50);
//       noStroke();
//       circle(x, y, tam);
//       pn += 0.01;


//     }
// }

import {mockWithVideo} from '../../libs/camera-mock';
const THREE = window.MINDAR.FACE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    mockWithVideo('../../assets/mock-videos/face1.mp4');

    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    //o target não é mais requerido, deve estar incluso nas bibliotecas

    // o que acontece em cima do target
     const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
     const material = new THREE.MeshBasicMaterial({color: "#0000FF"});
     const cube = new THREE.Mesh(geometry, material);
       cube.position.set(0, 0, -2);


    //determina a âncora
    //486 facial landmarks. Index 1 é a ponta do nariz. Ver mapa aqui: https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/mesh_map.jpg
    const anchor = mindarThree.addAnchor(1);
    anchor.group.add(cube);


    // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();


});



