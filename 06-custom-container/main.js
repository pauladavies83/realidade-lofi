import {loadGLTF} from "../libs/loader.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.querySelector("#ar-box"), // o tamanho da tela onde vai aparecer a AR, definina no index
    });
    const {renderer, scene, camera} = mindarThree;

    //acessório 1
    const glasses = await loadGLTF('../assets/hypno/scene.gltf');
    glasses.scene.scale.set(0.03, 0.03, 0.03);
    glasses.scene.renderOrder = 1;

    //âncora para o acessório 1
    const anchor = mindarThree.addAnchor(1);
    anchor.group.add(glasses.scene);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
