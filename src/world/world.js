import * as THREE from '../three/build/three.module.js';
import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';
import { loadHead } from './loadHead.js';
import { objectReframer } from './objectReframer.js';

export function world() {
  this.scene = null;
  this.camera = null;
  this.controls = null;
  this.renderer = null;
  this.lights = [];
  this.currentModelName = null;

  return this.init();
}

world.prototype.init = function () {
  this.createScene();
  this.createRenderer();
  this.createCamera();
  this.createLights();
  this.createControls();
  this.objectReframer = new objectReframer({
    camera: this.camera,
    controls: this.controls
  });

  window.addEventListener('resize', () => this.onWindowResize(), false);

  return this.loadNewHead({ name: 'disgusted' }).then(() => {
    return {
      renderer: this.renderer,
      loadNewHead: params => this.loadNewHead(params)
    };
  });
};

world.prototype.onWindowResize = function () {
  const { innerWidth, innerHeight } = window;
  this.camera.aspect = innerWidth / innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(innerWidth, innerHeight);
}

world.prototype.animate = function () {
  window.requestAnimationFrame(() => this.animate());
  this.controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  this.render();
}

world.prototype.render = function () {
  this.renderer.render(this.scene, this.camera);
}

world.prototype.loadNewHead = function ({ name = 'excited' }) {
  return loadHead({ name }).then(object => {
    if (this.currentModelName) {
      var currentModel = this.scene.getObjectByName(this.currentModelName);
      this.scene.remove(currentModel);
    }

    this.scene.add(object);
    object.name = name;
    this.currentModelName = object.name;

    this.objectReframer.reFrame(object);

    this.animate();
  });
};

world.prototype.createScene = function () {
  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color(0x203040);
  // scene.fog = new THREE.FogExp2( 0xffee00, 0.0001 );
}

world.prototype.createRenderer = function () {
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setSize(window.innerWidth, window.innerHeight);
}

world.prototype.createCamera = function () {
  this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 100000);

  this.camera.position.set(1000, 4000, 1170);
}

world.prototype.createLights = function () {
  var light = new THREE.AmbientLight(0x808080);
  this.lights.push(light);

  light = new THREE.DirectionalLight(0xbb8020);
  light.position.set(2, -1, 2);
  this.lights.push(light);

  // light = new THREE.DirectionalLight(0x00eeff);
  // light.position.set(-1, 2, -1);
  // this.lights.push(light);

  this.lights.forEach(light => {
    this.scene.add(light);
  });
}

world.prototype.createSingleLight = function (lightType, colour, direction) {
  const light = new lightType(colour);
  if (direction) {
    light.position.set(1, 1, 1);
  }
}

world.prototype.createControls = function () {
  this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  this.controls.dampingFactor = 0.05;
  this.controls.screenSpacePanning = false;
  this.controls.minDistance = 10;
  this.controls.maxDistance = 100000;
  this.controls.maxPolarAngle = Math.PI;
  // Math.PI / 2;
}
