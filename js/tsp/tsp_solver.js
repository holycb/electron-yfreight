var POPULATION_SIZE;
var ELITE_RATE;
var CROSSOVER_PROBABILITY;
var MUTATION_PROBABILITY;
var OX_CROSSOVER_RATE;
var UNCHANGED_GENS;

var mutationTimes;
var dis;
var bestValue, best;
var currentGeneration;
var currentBest;
var population;
var values;
var fitnessValues;
var roulette;

var distances;

function initData() {
  running = false;
  POPULATION_SIZE = 30;
  ELITE_RATE = 0.3;
  CROSSOVER_PROBABILITY = 0.9;
  MUTATION_PROBABILITY = 0.01;
  //OX_CROSSOVER_RATE = 0.05;
  UNCHANGED_GENS = 0;
  mutationTimes = 0;
  doPreciseMutate = true;

  bestValue = undefined;
  best = [];
  currentGeneration = 0;
  currentBest;
  population = []; //new Array(POPULATION_SIZE);
  values = new Array(POPULATION_SIZE);
  fitnessValues = new Array(POPULATION_SIZE);
  roulette = new Array(POPULATION_SIZE);
}

function findBestWay(wayPoints, wayDistances, setWayFunc) {
  initData();
  points = wayPoints;
  distances = wayDistances;
  GAInitialize();
  running = true;
  setSpinner();
  const interval = setInterval(() => {
    console.log(currentGeneration);
    if (running) {
      GANextGeneration();
      if (currentGeneration === 500) {
        running = false;
      }
    } else {
      console.log(
        'There are ' +
          points.length +
          ' points in the map, ' +
          'the ' +
          currentGeneration +
          'th generation with ' +
          mutationTimes +
          ' times of mutation. best value: ' +
          ~~bestValue
      );
      console.log(solution);
      solution = solution
        .slice(solution.indexOf(0), solution.length)
        .concat(solution.slice(0, solution.indexOf(0)));
      clearInterval(interval);
      setNewWay(solution);
      removeSpinner();
    }
  }, 10);
}
