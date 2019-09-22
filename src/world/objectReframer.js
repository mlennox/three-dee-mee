import * as THREE from '../three/build/three.module.js';

export function objectReframer({ camera, controls }) {
  this.camera = camera;
  this.controls = controls;
}

objectReframer.prototype.reFrame = function (object) {
  // compute the box that contains all the stuff
  // from root and below
  const box = new THREE.Box3().setFromObject(object);

  const boxSize = box.getSize(new THREE.Vector3()).length();
  const boxCenter = box.getCenter(new THREE.Vector3());

  // set the camera to frame the box
  this.frameArea(boxSize * 1.2, boxSize, boxCenter);
  this.updateControls(boxSize, boxCenter);
}

objectReframer.prototype.updateControls = function (boxSize, boxCenter) {
  // update the Trackball controls to handle the new size
  this.controls.maxDistance = boxSize * 10;
  this.controls.target.copy(boxCenter);
  this.controls.update();
}

objectReframer.prototype.frameArea = function (sizeToFitOnScreen, boxSize, boxCenter) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.Math.degToRad(this.camera.fov * .5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
  // compute a unit vector that points in the direction the camera is now
  // in the xz plane from the center of the box
  const direction = (new THREE.Vector3())
    .subVectors(this.camera.position, boxCenter)
    .multiply(new THREE.Vector3(1, 0, 1))
    .normalize();

  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  this.camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

  // pick some near and far values for the frustum that
  // will contain the box.
  this.camera.near = boxSize / 100;
  this.camera.far = boxSize * 100;

  this.camera.updateProjectionMatrix();

  // point the camera to look at the center of the box
  this.camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}