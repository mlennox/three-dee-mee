import * as THREE from '../three/build/three.module.js';
import { OBJLoader2 } from '../three/examples/jsm/loaders/OBJLoader2.js';

export function loadHead({ name = 'excited' }) {

  // instantiate the loader
  // and remove duplicate indices and compute normals
  var loader = new OBJLoader2().setUseIndices(true);

  // a matt, double-sided surface
  var faceMaterial = new THREE.MeshLambertMaterial({
    // flatShading: true,
    // reflectivity: 0,
    vertexColors: THREE.VertexColors,
    shadowSide: THREE.DoubleSide,
    side: THREE.DoubleSide,
    // shading: THREE.SmoothShading
  });

  return new Promise((resolve, reject) => {
    // load a resource from provided URL synchronously
    loader.load(`./objs/${name}.obj`,
      (object) => {
        object.name = name;

        // set the material to a matt surface
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = faceMaterial;
          }
        });

        resolve(object);
      },
      () => {
        // no updates
      },
      (error) => {
        console.error(error);
        reject(error)
      }, null, false);
  });
};
