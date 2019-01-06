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
        switch (layout) {
          case 'routes':
            newLayout = getRoutesLayout();
            break;
          case 'notes':
            newLayout = getNotesLayout();
            break;
          case 'map':
            newLayout = getMapLayout();
            break;
          default:
            console.log('Wrong layout');
          }
        currentLayout = layout;
        layoutContainer.appendChild(newLayout);
      }
    });
  });
}
// columns = ['123', '122', '124'];
// data = [['11', '11', '11'], 
//         ['22', '23', '24']];
function getRoutesLayout() {
  const columns = ['123', '122', '124'];
  const data = [['11', '11', '11'], ['22', '23', '24']];
  const tableContainer = document.createElement('div');
  const table = createTable(columns, data, {icons: ['delete', 'menu', 'edit'], eventFunctions: []});;
  tableContainer.append(table);
  return tableContainer;
}

function createTable(columns, data, rowEventObject) {
  const table = document.createElement('table');
  table.className = 'highlight noselect';

  const tableHead = document.createElement('thead');
  const trHead = document.createElement('tr');
  trHead.className = 'noselect';

  if (rowEventObject) {
    const buttonTh = document.createElement('th');
    buttonTh.style.width = '15%';
    trHead.appendChild(buttonTh);
  
  }
  columns.forEach((col) => {
    const newTh = document.createElement('th');
    newTh.innerText = col;
    trHead.appendChild(newTh);
  });
  tableHead.appendChild(trHead);
  table.append(tableHead);

  const tableBody = document.createElement('tbody');
  data.forEach((row) => {
    const tr = document.createElement('tr');
    tr.className = '';

    if (rowEventObject) {
      const newButtons = createRowButtons(rowEventObject);
      const td = document.createElement('td');
      newButtons.forEach((button) => {
        td.appendChild(button);
      });
      tr.appendChild(td);
    }

    row.forEach((element) => {
      const td = document.createElement('td');
      td.innerText = element;
      tr.appendChild(td);
    });
    tableBody.append(tr);
  });
  table.append(tableBody);
  return table;
}
/**
 * 
 * @param {icons: [], eventFunctions: function[]} rowEventObject 
 * @returns the button element
 */
function createRowButtons(rowEventObject) {
  const buttons = [];
  for (let idx = 0; idx < rowEventObject.icons.length; idx++) {
    const button = document.createElement('a');
    button.className = 'btn-floating btn-small waves-effect waves-light';
    button.style.margin = '5px';
    const i = document.createElement('i');
    i.className = 'material-icons';
    i.innerText = rowEventObject.icons[idx];
    button.appendChild(i);
    button.addEventListener('click', rowEventObject.eventFunctions[idx]);
    buttons.push(button);
  }
  return buttons;
}

function getNotesLayout() {

}
function getMapLayout() {
  return mapContainer;
}



function updateSideLayout(pointsList) {
  const LIST_ITEM_CLASS = 'collection-item noselect';

  let sideList = document.querySelector('#side-list');

  if (pointsList.length > 0) {
    sideList.className = 'collection'; 
    // if (pointsList.length > 1) {
    //   document
    //   .querySelector('#side-bar-button-click').classList.push('disabled');
    // }
  } 
  else sideList.className = '';

  while (sideList.lastChild) {
    sideList.removeChild(sideList.firstChild);
  }

  iter = 0;
  for (i of pointsList) {
    let newListItem = document.createElement('a');
    newListItem.className = LIST_ITEM_CLASS;    
    // <li class="collection-item">
    //   <div>
    //     Alvin
    //     <a href="#!" class="secondary-content">
    //       <i class="material-icons">send</i>
    //     </a>
    //   </div>
    // </li>

    newListItem.innerText = i;
    newListItem.dataset.index = iter;
    if (currentLayout === 'map') {
      const badgeSpan = document.createElement('a');
      badgeSpan.className = 'secondary-content';
      badgeSpan.innerHTML = '<i class="material-icons">close</i>';
      badgeSpan.addEventListener('click', el => {
        const newCoordsNumbers = [...Array(getCoordPoints().length).keys()];
        newCoordsNumbers.splice(el.currentTarget.parentElement.dataset.index, 1);
        setNewWay(newCoordsNumbers);
      });
      newListItem.appendChild(badgeSpan);
      iter++;
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
