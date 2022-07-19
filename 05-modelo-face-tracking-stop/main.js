document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {


      const THREE = window.MINDAR.FACE.THREE;
      const mindarThree = new window.MINDAR.FACE.MindARThree({
  container: document.querySelector("#container"),
      });
      const {renderer, scene, camera} = mindarThree;
      const anchor = mindarThree.addAnchor(1);
      const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
      const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );
      const sphere = new THREE.Mesh( geometry, material );
      anchor.group.add(sphere);
      const start = async() => {
  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
      }
      const startButton = document.querySelector("#startButton");
      startButton.addEventListener("click", () => {
  start();
      });
      stopButton.addEventListener("click", () => {
  mindarThree.stop();
  mindarThree.renderer.setAnimationLoop(null);
      });

    }
    });