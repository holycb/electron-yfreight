var sidebar;
var currentLayout;
var mapContainer;
var calcRoute = require('./js/utils.js');

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
            document.querySelector('.side-layout').style.width = '0px';
            document.querySelector('.main-layout').style.width = '100%';
            newLayout = getRoutesLayout();
            break;
          case 'points':
            document.querySelector('.side-layout').style.width = '0px';
            document.querySelector('.main-layout').style.width = '100%';
            newLayout = getPointsLayout();
            break;
          case 'cars':
            document.querySelector('.side-layout').style.width = '0px';
            document.querySelector('.main-layout').style.width = '100%';
            newLayout = getCarsLayout();
            var elems = newLayout.querySelector('#side-bar-add-car-button');
            var instances = M.Tooltip.init(elems);
            break;
          case 'map':
            document.querySelector('.side-layout').style.width = '300px';
            document.querySelector('.main-layout').style.width =
              'calc(100% - 300px)';
            newLayout = getMapLayout();
            break;
          default:
            console.log('Wrong layout');
            return;
        }
        currentLayout = layout;
        layoutContainer.appendChild(newLayout);
      }
    });
  });
}

function getRoutesLayout() {
  const columns = [
    { text: '', width: '45px' },
    { text: 'Название' },
    { text: 'Описание' }
  ];
  const data = dbhelper.getAllRoutes();
  let tableContainer;
  if (data.length > 0) {
    tableContainer = document.createElement('div');
    const table = createTable(columns, data, {
      icons: ['map', 'delete'],
      eventFunctions: [
        function(el) {
          //show
          const tableRow = el.target.parentNode.parentElement.parentElement;
          const route = dbhelper.getRoutePoints(tableRow.dataset.id).map((x) => {[x[2], x[3]]});
          // returns value like: [ [id1, routeid, x1, y1], [id2, routeid, x2, y2] ]
          // getRoutePoints: function(routeId){
          var toastHTML = `<span>${tableRow.children[1].textContent} - открыт</span>`;
          M.toast({html: toastHTML});
          openMapLayoutWithRoute(route);
        },
        function(el) {
          //delete
          const tableRow = el.target.parentNode.parentElement.parentElement;
          var toastHTML = `<span>${tableRow.children[1].textContent} - удалена</span>`;
          M.toast({html: toastHTML});
          dbhelper.deleteRoute(tableRow.dataset.id);
          tableRow.remove();
        }
      ]
    });
    tableContainer.append(table);
  } else {
    tableContainer = noTableElementsDiv('маршрутов');
  }
  return tableContainer;
}

function openMapLayoutWithRoute(route) {
  let layoutContainer = document.querySelector('.main-layout');

  while (layoutContainer.firstChild) {
    layoutContainer.removeChild(layoutContainer.firstChild);
  }
  currentLayout = 'map';
  document.querySelector('.side-layout').style.width = '300px';
  document.querySelector('.main-layout').style.width =
    'calc(100% - 300px)';
  layoutContainer.appendChild(getMapLayout());
  setNewCoords(coords);
}

function noTableElementsDiv(elemNames) {
  // указывать в родительном падеже (например - "маршрутов")
  const tableContainer = document.createElement('div');
  tableContainer.style.width = '100%';
  tableContainer.style.height = '100%';
  tableContainer.className = 'valign-wrapper noselect';
  const h = document.createElement('h4');
  h.style.width = '100%';
  h.className = 'center-align';
  h.innerText = 'Нет сохраненных ' + elemNames;
  tableContainer.appendChild(h);
  return tableContainer;
}

/**
 *
 * @param {string[]} columns
 * @param {string[][]} data
 * @param {icons[], eventFunctions[]} rowEventObject
 */
function createTable(columns, data, rowEventObject) {
  const table = document.createElement('table');
  table.className = 'highlight noselect centered';

  const tableHead = document.createElement('thead');
  const trHead = document.createElement('tr');
  trHead.className = 'noselect';

  columns.forEach(col => {
    const newTh = document.createElement('th');
    newTh.innerText = col.text;
    newTh.style.width = col.width || '';
    trHead.appendChild(newTh);
  });
  if (rowEventObject) {
    const buttonTh = document.createElement('th');
    buttonTh.style.width = '15%';
    trHead.appendChild(buttonTh);
  }
  tableHead.appendChild(trHead);
  table.append(tableHead);

  const tableBody = document.createElement('tbody');

  let rowCount = 0;
  data.forEach(row => {
    rowCount = rowCount + 1;
    const tr = document.createElement('tr');
    tr.className = '';

    let colCount = 0;
    tr.dataset.id = row[0];
    row.forEach(element => {
      const td = document.createElement('td');

      if (colCount === 0) {
        td.innerText = rowCount;
      } else {
        td.innerText = element;
      }

      tr.appendChild(td);
      colCount = colCount + 1;
    });
    if (rowEventObject) {
      const newButtons = createRowButtons(rowEventObject);
      const td = document.createElement('td');
      newButtons.forEach(button => {
        td.appendChild(button);
      });
      tr.appendChild(td);
    }
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
    button.className = 'waves-effect btn-flat table-button';
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

function getPointsLayout() {
  const columns = [
    { text: '', width: '45px' },
    { text: 'Название' },
    { text: 'Описание' }
  ];
  const data = dbhelper.getNotePoints();
  let tableContainer;
  if (data.length > 0) {
    tableContainer = document.createElement('div');
    const table = createTable(columns, data, {
      icons: ['edit', 'delete'],
      eventFunctions: [
        function(el) {
          //edit
          const tableRow = el.target.parentNode.parentElement.parentElement;
          document.getElementById('name-inline').setAttribute('disabled', '');
          document.getElementById('name-input-label').innerText = tableRow.children[1].textContent;
          document.querySelector('#side-bar-save-button').modalInstance.mode = 'point-edit';
          document.getElementById('modal-name').innerText = 'Изменение заметки для точки на карте';
          document.querySelector('#side-bar-save-button').modalInstance.currentId = tableRow.dataset.id;
          document.querySelector('#side-bar-save-button').modalInstance.open();
        },
        function(el) {
          //delete
          const tableRow = el.target.parentNode.parentElement.parentElement;
          var toastHTML = `<span>${tableRow.children[1].textContent} - удалена</span>`;
          M.toast({html: toastHTML});
          dbhelper.deleteNotePoint(tableRow.dataset.id);
          tableRow.remove();
        }
      ]
    });
    tableContainer.append(table);
  } else {
    tableContainer = noTableElementsDiv('пунктов');
  }
  return tableContainer;
}

function updateCurrentTable() {
  let layoutContainer = document.querySelector('.main-layout');

  while (layoutContainer.firstChild) {
    layoutContainer.removeChild(layoutContainer.firstChild);
  }

  var newLayout;
  switch (currentLayout) {
    case 'routes':
      document.querySelector('.side-layout').style.width = '0px';
      document.querySelector('.main-layout').style.width = '100%';
      newLayout = getRoutesLayout();
      break;
    case 'points':
      document.querySelector('.side-layout').style.width = '0px';
      document.querySelector('.main-layout').style.width = '100%';
      newLayout = getPointsLayout();
      break;
    case 'cars':
      newLayout = getCarsLayout();
      break;
    }
    layoutContainer.appendChild(newLayout);
}

function getCarsLayout() {
  const columns = [
    { text: ''},
    { text: 'Название'},
    { text: 'Номер'},
    { text: 'Потребление (л.)'},
    { text: 'Для текущего маршрута (л.)'},
    { text: 'Цена'}
  ];
  const data = dbhelper.getAllCars();
  data.forEach((row) => {
    let fuel;
    if (multiRoute.getActiveRoute())
      fuel = calcRoute.calculateFuelForRoute(multiRoute.getActiveRoute().model.properties.get("distance").value, row[3]);
    else fuel = 0;
    row.push(fuel);
    row.push(calcRoute.calculateFuelCostForRoute(fuel));
  });
  let tableContainer;
  if (data.length > 0) {
    tableContainer = document.createElement('div');
    const table = createTable(columns, data, {
      icons: ['delete'],
      eventFunctions: [
        function(el) {
          //delete
          const tableRow = el.target.parentNode.parentElement.parentElement;
          var toastHTML = `<span>${tableRow.children[1].textContent} - удалена</span>`;
          M.toast({html: toastHTML});
          dbhelper.deleteCar(tableRow.dataset.id);
          tableRow.remove();
        }
      ]
    });
    tableContainer.innerHTML = `
      <a
        class="waves-effect btn-flat tooltipped modal-trigger"
        href="#modal2"
        data-position="left"
        data-tooltip="Добавить новое транспортное средство"
        id="side-bar-add-car-button"
      >
        <i class="material-icons">add</i>
      </a>`;
    tableContainer.append(table);
  } else {
    tableContainer = noTableElementsDiv('транспортных средств');
  }
  return tableContainer;
}

function getMapLayout() {
  updateMap();
  return mapContainer;
}

function updateSideLayout(pointsList) {
  const LIST_ITEM_CLASS = 'collection-item noselect';

  //  sideList = document.querySelector('#side-list');
  document.querySelector('#side-list').innerHTML = '';
  let sideList = document.createElement('ul');
  sideList.className = 'collection';

  if (pointsList.length > 0) {
    if (currentLayout === 'map') {
      const className = document.querySelector('#side-bar-save-button')
        .className;
      document.querySelector(
        '#side-bar-save-button'
      ).className = className.replace('disabled', '');
    }

    iter = 0;
    for (i of pointsList) {
      let newListItem = document.createElement('li');
      newListItem.className = LIST_ITEM_CLASS;
      newListItem.innerText = i;
      newListItem.dataset.index = iter;
      if (currentLayout === 'map') {
        const badgeSpan = document.createElement('a');
        badgeSpan.className = 'secondary-content';
        badgeSpan.innerHTML = '<i class="material-icons">close</i>';
        badgeSpan.addEventListener('click', el => {
          const newCoordsNumbers = [...Array(getCoordPoints().length).keys()];
          const names = getNamePoints();
          newCoordsNumbers.splice(
            el.currentTarget.parentElement.dataset.index,
            1
          );
          setNewWay(newCoordsNumbers);
          setSpinner();
          const interval = setInterval(() => {
            clearInterval(interval);
            removeSpinner();
          }, 700);
          M.toast({
            html: `${
              names[el.currentTarget.parentElement.dataset.index]
            } - удалено из текущего маршрута`,
            classes: 'rounded'
          });
        });
        newListItem.appendChild(badgeSpan);
        iter++;
      }
      sideList.appendChild(newListItem);
    }
  } else {
    sideList = document.createElement('div');
    sideList.className = 'center-align';
    const i = document.createElement('i');
    i.className = 'material-icons center-align noselect';
    i.innerText = 'more_horiz';
    i.addEventListener('click', () => {
      if (currentLayout === 'map') {
        M.toast({ html: 'Маршрут не выбран!', classes: 'rounded' });
        const className = document.querySelector('#side-bar-save-button')
          .className;
        if (!className.includes('disabled'))
          document.querySelector('#side-bar-save-button').className =
            className + 'disabled';
      }
    });
    sideList.appendChild(i);
  }

  document.querySelector('#side-list').appendChild(sideList);
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
  updateSideLayout([]);
}

function setSpinner() {
  const background = document.getElementById('loading-background');
  background.style.display = 'block';
}

function removeSpinner() {
  const background = document.getElementById('loading-background');
  background.style.display = 'none';
}

function modalSaveEvent() {
  if (
    document.querySelector('#side-bar-save-button').modalInstance.mode ===
    'route'
  ) {
    const route = {
      name: document.getElementById('name-inline').value,
      note: document.getElementById('route-note').value,
      coords: getCoordPoints()
    };
    if (
      dbhelper.isRouteNameExists(route.name) ||
      !route.name ||
      route.name === ''
    ) {
      document.querySelector('#name-inline').className = 'validate invalid';
    } else {
      const id = dbhelper.insertRoute([route.name, route.note])[0];
      if (route.coords.length > 0)
        dbhelper.saveRoutePoints(id, route.coords);
      document.getElementById('name-inline').value = '';
      document.getElementById('route-note').value = '';
      document.querySelector('#side-bar-save-button').modalInstance.close();
      M.toast({ html: 'Маршрут сохранен!', classes: 'rounded' });
      setNewWay([]);
    }
  } else if (document.querySelector('#side-bar-save-button').modalInstance.mode ===
  'point'){
    const point = {
      name: document.getElementById('name-inline').value,
      note: document.getElementById('route-note').value,
      coords: lastPointedCoords
    };
    dbhelper.insertNotePoint([
      point.name,
      point.coords[0],
      point.coords[1],
      point.note
    ]);
    document.getElementById('name-inline').value = '';
    document.getElementById('route-note').value = '';
    document.querySelector('#side-bar-save-button').modalInstance.close();
    M.toast({ html: 'Точка на карте сохранена!', classes: 'rounded' });
    saveNewPointOnMap(point);
  } else {
    const point = {
      name: document.getElementById('name-inline').value,
      note: document.getElementById('route-note').value
    };
    dbhelper.setNotePointNotice([
      document.querySelector('#side-bar-save-button').modalInstance.currentId,
      point.note
    ]);
    document.getElementById('name-inline').removeAttribute('disabled');
    document.getElementById('name-inline').value = '';
    document.getElementById('route-note').value = '';
    document.querySelector('#side-bar-save-button').modalInstance.close();
    M.toast({ html: `Заметка успешно изменена`, classes: 'rounded' });
    updateCurrentTable();
  }
}

function openModalForSavePoint() {
  document.querySelector('#side-bar-save-button').modalInstance.mode = 'point';
  document.getElementById('modal-name').innerText = 'Сохранение точки на карте';
  document.getElementById('name-inline').removeAttribute('disabled');
  document.getElementById('name-input-label').innerText = 'Название';
  document.querySelector('#side-bar-save-button').modalInstance.open();
}

function modalSaveCar() {
  const car = {
    number: document.getElementById('car-input-number').value,
    consumption: document.getElementById('car-input-consumption').value,
    name: document.getElementById('car-input-name').value
  };
  dbhelper.insertCar([car.name, car.number, car.consumption]);

  document.getElementById('car-input-number').value = '';
  document.getElementById('car-input-consumption').value = '';
  document.getElementById('car-input-name').value = '';
  document.getElementById('modal2').modalInstance.close();
  M.toast({ html: 'Транспортное средство сохранено!', classes: 'rounded' });
  updateCurrentTable();
  
}
