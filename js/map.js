var myMap;
var multiRoute;
var lastPointedCoords;

function init() {
  /**
   * Creating a multiroute.
   * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
   */
  multiRoute = new ymaps.multiRouter.MultiRoute(
    {
      referencePoints: [],
      params: {
        reverseGeocoding: true
      }
    },
    {
      /**
       * A type of intermediate points that can be added
       * when editing.
       */
      editorMidPointsType: 'via',
      // In the mode for adding new waypoints, we do not allow putting points on top of the map objects.
      editorDrawOver: false
    }
  );

  var createRouteButton = new ymaps.control.Button({
    data: { content: 'Редактирование маршрута' }
  });
  var createNoteButton = new ymaps.control.Button({
    data: { content: 'Отметить точку на карте' }
  });
  var showPlacemaks = new ymaps.control.Button({
    data: { content: 'Отображать отмеченные точки' },
    state: { selected: true }
  });

  showPlacemaks.events.add('select', () => {
    setAllPoints();
  });
  showPlacemaks.events.add('deselect', () => {
    const routeWasEditing = createRouteButton.isSelected();

    myMap.geoObjects.removeAll();
    myMap.geoObjects.add(multiRoute);
    if (routeWasEditing) {
      multiRoute.editor.start({
        addWayPoints: true,
        removeWayPoints: true
      });
    }
  });

  let cursor;
  createNoteButton.events.add('select', () => {
    cursor = myMap.cursors.push('crosshair');
    createRouteButton.deselect();
    myMap.events.once('click', function(e) {
      lastPointedCoords = e.get('coords');
      cursor.remove();
      openModalForSavePoint();
      createNoteButton.deselect();
    });
  });
  createNoteButton.events.add('deselect', () => {
    if (cursor) cursor.remove();
    myMap.events.remove('click');
  });

  createRouteButton.events.add('select', () => {
    createNoteButton.deselect();
    multiRoute.editor.start({
      addWayPoints: true,
      removeWayPoints: true
    });
  });

  createRouteButton.events.add('deselect', () => {
    multiRoute.editor.stop();
  });

  ymaps.geolocation.get().then(res => {
    myMap = new ymaps.Map(
      'map',
      {
        center: res.geoObjects.position,
        zoom: 10,
        controls: [
          'searchControl',
          'typeSelector',
          'fullscreenControl',
          'zoomControl',
          'geolocationControl',
          createRouteButton,
          createNoteButton
        ]
      },
      {
        buttonMaxWidth: 300,
        suppressMapOpenBlock: true
      }
    );
    myMap.controls.add(showPlacemaks, {
      float: 'none',
      position: { bottom: 10, left: 10 }
    });
    setAllPoints();
    myMap.geoObjects.add(multiRoute);

    initNewRoute();
  });
}

function setAllPoints() {
  const points = dbhelper.getNotePointsForMap();
  points.forEach(val => {
    if (val.coords && val.coords.length > 0) {
      saveNewPointOnMap(val);
    }
  });
}
function saveNewPointOnMap(val) {
  myMap.geoObjects.add(
    new ymaps.Placemark(
      val.coords,
      {
        balloonContent: val.note,
        iconCaption: val.name
      },
      {
        preset: 'islands#blueCircleDotIconWithCaption',
        iconCaptionMaxWidth: '70'
      }
    )
  );
}

function initNewRoute() {
  // Update side layout when add new way point
  multiRoute.model.events.add('requestsuccess', () => {
    updateSideLayout(getNamePoints());
  });
}

function getCoordPoints() {
  return multiRoute.model.getAllPoints().map(x => x.getReferencePoint());
}

function getNamePoints() {
  return multiRoute.model.getAllPoints().map(x => x.properties.get('name'));
}

function setBestWay() {
  const points = getCoordPoints();
  let results = [];

  // getting all the distances between each point
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      ymaps.route([points[i], points[j]]).then(function(route) {
        results.push({
          start: points[i],
          end: points[j],
          distance: route.getLength()
        });

        //waiting for all the results...
        if (results.length == ((points.length - 1) * points.length) / 2) {
          //then find the best way
          findBestWay(points, results);
        }
      });
    }
  }
}

function setNewWay(pointNumbers) {
  const points = getCoordPoints();
  const names = getNamePoints();
  myMap.geoObjects.remove(multiRoute);
  multiRoute = new ymaps.multiRouter.MultiRoute(
    {
      referencePoints: pointNumbers.map(x => points[x]),
      params: {
        reverseGeocoding: true
      }
    },
    {
      editorMidPointsType: 'via',
      editorDrawOver: false
    }
  );
  myMap.geoObjects.add(multiRoute);
  initNewRoute();
  multiRoute.editor.start({
    addWayPoints: true,
    removeWayPoints: true
  });
  updateSideLayout(pointNumbers.map(x => names[x]));
}

function getAllDistances() {}
