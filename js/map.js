var myMap;
var multiRoute;

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

  var buttonEditor = new ymaps.control.Button({
    data: { content: 'Создать маршрут' }
  });

  buttonEditor.events.add('select', () => {
    /**
     * Enabling edit mode.
     * As options, you can pass an object with fields:
     * addWayPoints - Allows adding new waypoints by clicking on the map. Default value: false.
     * dragWayPoints - Allows dragging existing waypoints. Default value: true.
     * removeWayPoints - Allows deleting waypoints by double-clicking them. Default value: false.
     * dragViaPoints - Allows dragging existing throughpoints. Default value: true.
     * removeViaPoints - Allows deleting throughpoints by double-clicking them. Default value: true.
     * addMidPoints - Allows adding intermediate points or waypoints by dragging the marker that appears when pointing the mouse at the active route. The type of points to add is set by the midPointsType option. Default value: true.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml#editor
     */
    multiRoute.editor.start({
      addWayPoints: true,
      removeWayPoints: true
    });
  });

  buttonEditor.events.add('deselect', () => {
    // Turning off edit mode.
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
          buttonEditor
        ]
      },
      {
        buttonMaxWidth: 300
      }
    );

    // Adding multiroute to the map.
    myMap.geoObjects.add(multiRoute);

    // Update side layout when add new way point
    multiRoute.model.events.add('requestsuccess', () => {
      updateSideLayout(getNamePoints());
    });
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
        }
      });
    }
  }
}

function getAllDistances() {}
