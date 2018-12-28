var sidebar;
var currentLayout;
var mapContainer; 

function initMap() {
  mapContainer = (document.createElement('div', {id: 'map'}));
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
        let layoutContainer = document.querySelector('.layout-container');
  
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

function updateSideLayout(list) {
  let sideList = document.querySelector('.collection');
  while(sideList.lastChild) {
    sideList.removeChild(sideList.firstChild);
  }

  for (i in list) {
    let newListItem = document.createElement('a');
    newListItem.className = 'collection-item';
    newListItem.innerText = list[i];
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
}




