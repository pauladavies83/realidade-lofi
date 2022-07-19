import {loadGLTF} from "../libs/loader.js";
const THREE = window.MINDAR.FACE.THREE;

const capture = (mindarThree) => {
  const {video, renderer, scene, camera} = mindarThree;
  const renderCanvas = renderer.domElement;

  // output canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = renderCanvas.width;
  canvas.height = renderCanvas.height;

  const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth;
  const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight / video.clientHeight;
  const sw = video.videoWidth - sx * 2; 
  const sh = video.videoHeight - sy * 2; 

  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  
  renderer.preserveDrawingBuffer = true;
  renderer.render(scene, camera); // empty if not run
  context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = false;

  //ao invés de baixar, como no exemplo anterior, é para subir / share
  const data = canvas.toDataURL('image/png');
  return data;
}

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {

    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });

    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    //occluder
    const occluder = await loadGLTF('../assets/sparkar-occluder/headOccluder.glb'); // face occluder do facebook, mas pode ser qualquer um
    const occluderMaterial = new THREE.MeshBasicMaterial({colorWrite: false}); // tem que ser transparente, se não vai sobrepor o rosto da pessoa. Não dá pra diminuir a opacidade para 0, se não daria pra ver. O ideal é que ele não rederize nenhuma cor
    occluder.scene.scale.set(0.065, 0.065, 0.065); // escala e posição foram por tentativa e erro
    occluder.scene.position.set(0, -0.3, 0.15);
    occluder.scene.traverse((o) => {
      if (o.isMesh) {
	o.material = occluderMaterial;
      }
    });
    occluder.scene.renderOrder = 0; // tem que renderizar antes do óculos, se não não adianta

    //âncora para o occluder
    const occluderAnchor = mindarThree.addAnchor(168);
    occluderAnchor.group.add(occluder.scene);

    //acessório 1
    const glasses = await loadGLTF('../assets/glasses/scene.gltf');
    glasses.scene.scale.set(0.005, 0.005, 0.005);
    glasses.scene.renderOrder = 1;

    //âncora para o acessório 1
    const anchor = mindarThree.addAnchor(1);
    anchor.group.add(glasses.scene);

    //captura de imagem
    const previewImage = document.querySelector("#preview-image");
    const previewClose = document.querySelector("#preview-close");
    const preview = document.querySelector("#preview");
    const previewShare = document.querySelector("#preview-share");

    document.querySelector("#capture").addEventListener("click", () => {
      const data = capture(mindarThree);
      preview.style.visibility = "visible";
      previewImage.src = data;
    });

    previewClose.addEventListener("click", () => {
      preview.style.visibility = "hidden";
    });

    previewShare.addEventListener("click", () => {
      const canvas = document.createElement('canvas');
      canvas.width = previewImage.width;
      canvas.height = previewImage.height;
      const context = canvas.getContext('2d');
      context.drawImage(previewImage, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
  const file = new File([blob], "photo.png", {type: "image/png"});
  const files = [file];
  if (navigator.canShare && navigator.canShare({files})) {
    navigator.share({
      files: files,
      title: 'AR Photo',
    })
  } else {
    const link = document.createElement('a');
    link.download = 'photo.png';
    link.href = previewImage.src;
    link.click();
  }
      });
    });

  // trocar a câmera do dispositivo
    document.querySelector("#switch").addEventListener("click", () => {
    mindarThree.switchCamera();
    });

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }

//botão para iniciar
      const startButton = document.querySelector("#startButton");
      startButton.addEventListener("click", () => {
  start();
      });
  //     stopButton.addEventListener("click", () => {
  // mindarThree.stop();
  // mindarThree.renderer.setAnimationLoop(null);
  //     });

});
