export function menu(handleClick) {
  const meshes = ['confused', 'crosseyed', 'disgusted', 'dubious', 'excited', 'goosed', 'sneering', 'wary'];
  const menu = document.createElement('ul');

  meshes.forEach(meshName => {
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.addEventListener('click', () => handleClick(meshName));
    const thumb = document.createElement('img');
    thumb.setAttribute('src', `./images/${meshName}.png`);
    anchor.appendChild(thumb);
    listItem.appendChild(anchor);
    menu.appendChild(listItem);
  });
  return menu;

}