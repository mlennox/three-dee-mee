import { world } from './world.js';
import { menu } from './menu.js'

window.addEventListener('load', () => {

  new world().then(world => {
    const container = document.getElementById('main');
    container.appendChild(world.renderer.domElement);

    const menuList = menu(clickee => {
      world.loadNewHead({ name: clickee })
    });
    const menuContainer = document.getElementsByClassName('overlay')[0];
    menuContainer.appendChild(menuList);
  });
});