var sidebar;
var currentLayout;
var mapContainer;

function initMap() {
  mapContainer = document.createElement('div', { id: 'map' });
  mapContainer.id = 'map';
  document.querySelector('.main-layout').appendChild(mapContainer);
  // Y API
  ymaps.ready(init); // calls init function from map.js
  mapContainer = document.querySelector('#map');
}

function initButtons() {
  document.querySelector('#side-bar-button').addEventListener('click', () => {
    if (sidebar.isOpen) sidebar.close();
    else sidebar.open();
  });

  document.querySelectorAll('.navigation-button').forEach(element => {
    element.addEventListener('click', el => {
      let layout = el.target.id.replace('-button', '');
      if (layout !== currentLayout) {
        let layoutContainer = document.querySelector('.main-layout');

        while (layoutContainer.firstChild) {
          layoutContainer.removeChild(layoutContainer.firstChild);
        }

        var newLayout;
        if (layout === 'map') {
          newLayout = mapContainer;
        } else {
          newLayout = document.createElement('div');
          newLayout.className = layout;
        }

        layoutContainer.appendChild(newLayout);
      }
    });
  });
}

function updateSideLayout(pointsList) {
  const LIST_ITEM_CLASS = 'collection-item noselect';
  const BUTTON_BADGE_CLASS = 'btn-floating btn-small waves-effect waves-light red';


  let sideList = document.querySelector('#side-list');

  if (pointsList.length > 0) sideList.className = 'collection';
  else sideList.className = '';

  while (sideList.lastChild) {
    sideList.removeChild(sideList.firstChild);
  }
  
  for (i of pointsList) {
    let newListItem = document.createElement('a');
    newListItem.className = LIST_ITEM_CLASS;
    newListItem.innerText = i;
    if (currentLayout === 'map') {

      const badgeSpan = document.createElement('span');
      badgeSpan.className = 'badge';
      badgeSpan.innerHTML = '<i class="material-icons">close</i>';
      badgeSpan.addEventListener('click', () => {
      // TODO: удалять элемент из маршрута
      });
      newListItem.appendChild(badgeSpan);
  
    }
    
    sideList.appendChild(newListItem);
  }
  
}

function initSideNav() {
  document.addEventListener('DOMContentLoaded', () => {
    var elems = document.querySelector('.sidenav');
    sidebar = M.Sidenav.init(elems);
  });
}

function initialLayout() {
  initMap();
  currentLayout = 'map';
}

function setSpinner() {
  const background = document.getElementById('loading-background');
  background.style.display = 'block';
}

function removeSpinner() {
  const background = document.getElementById('loading-background');
  background.style.display = 'none';
}