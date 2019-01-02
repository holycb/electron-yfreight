//https://github.com/parano/GeneticAlgorithm-TSP/blob/master/src/algorithm.js

function GAInitialize() {
  countDistances();
  for (var i = 0; i < POPULATION_SIZE; i++) {
    population.push(randomIndivial(points.length));
  }
  setBestValue();
}
function GANextGeneration() {
  currentGeneration++;
  selection();
  crossover();
  mutation();
  
  //if(UNCHANGED_GENS > POPULATION_SIZE + ~~(points.length/10)) {
  //MUTATION_PROBABILITY = 0.05;
  //if(doPreciseMutate) {
  //  best = preciseMutate(best);
  //  best = preciseMutate1(best);
  //  if(evaluate(best) < bestValue) {
  //    bestValue = evaluate(best);
  //    UNCHANGED_GENS = 0;
  //    doPreciseMutate = true;
  //  } else {
  //    doPreciseMutate = false;
  //  }
  //}
  //} else {
  //doPreciseMutate = 1;
  //MUTATION_PROBABILITY = 0.01;
  //}
  setBestValue();
}
function tribulate() {
  //for(var i=0; i<POPULATION_SIZE; i++) {
  for (var i = population.length >> 1; i < POPULATION_SIZE; i++) {
    population[i] = randomIndivial(points.length);
  }
}
function selection() {
  var parents = new Array();
  var initnum = 4;
  parents.push(population[currentBest.bestPosition]);
  parents.push(doMutate(best.clonePoint()));
  parents.push(pushMutate(best.clonePoint()));
  parents.push(best.clonePoint());

  setRoulette();
  for (var i = initnum; i < POPULATION_SIZE; i++) {
    parents.push(population[wheelOut(Math.random())]);
  }
  population = parents;
}
function crossover() {
  var queue = new Array();
  for (var i = 0; i < POPULATION_SIZE; i++) {
    if (Math.random() < CROSSOVER_PROBABILITY) {
      queue.push(i);
    }
  }
  queue.shufflePoints();
  for (var i = 0, j = queue.length - 1; i < j; i += 2) {
    doCrossover(queue[i], queue[i + 1]);
    //oxCrossover(queue[i], queue[i+1]);
  }
}
function doCrossover(x, y) {
  child1 = getChild('nextPoint', x, y);
  child2 = getChild('previousPoint', x, y);
  population[x] = child1;
  population[y] = child2;
}
function getChild(fun, x, y) {
  solution = new Array();
  var px = population[x].clonePoint();
  var py = population[y].clonePoint();
  var dx, dy;
  var c = px[randomNumber(px.length)];
  solution.push(c);
  while (px.length > 1) {
    dx = px[fun](px.indexOfPoint(c));
    dy = py[fun](py.indexOfPoint(c));
    px.deleteByPointValue(c);
    py.deleteByPointValue(c);
    c = dis[c][dx] < dis[c][dy] ? dx : dy;
    solution.push(c);
  }
  return solution;
}
function mutation() {
  for (var i = 0; i < POPULATION_SIZE; i++) {
    if (Math.random() < MUTATION_PROBABILITY) {
      if (Math.random() > 0.5) {
        population[i] = pushMutate(population[i]);
      } else {
        population[i] = doMutate(population[i]);
      }
      i--;
    }
    if (population[i]) 
      population[i] = population[i].slice(population[i].indexOf(0), population[i].length)
        .concat(population[i].slice(0, population[i].indexOf(0)));
  }
}
function preciseMutate(orseq) {
  var seq = orseq.clonePoint();
  if (Math.random() > 0.5) {
    seq.reverse();
  }
  var bestv = evaluate(seq);
  for (var i = 0; i < seq.length >> 1; i++) {
    for (var j = i + 2; j < seq.length - 1; j++) {
      var new_seq = swap_seq(seq, i, i + 1, j, j + 1);
      var v = evaluate(new_seq);
      if (v < bestv) {
        (bestv = v), (seq = new_seq);
      }
    }
  }
  //alert(bestv);
  return seq;
}
function preciseMutate1(orseq) {
  var seq = orseq.clonePoint();
  var bestv = evaluate(seq);

  for (var i = 0; i < seq.length - 1; i++) {
    var new_seq = seq.clonePoint();
    new_seq.swapPoints(i, i + 1);
    var v = evaluate(new_seq);
    if (v < bestv) {
      (bestv = v), (seq = new_seq);
    }
  }
  //alert(bestv);
  return seq;
}
function swap_seq(seq, p0, p1, q0, q1) {
  var seq1 = seq.slice(0, p0);
  var seq2 = seq.slice(p1 + 1, q1);
  seq2.push(seq[p0]);
  seq2.push(seq[p1]);
  var seq3 = seq.slice(q1, seq.length);
  return seq1.concat(seq2).concat(seq3);
}
function doMutate(seq) {
  mutationTimes++;
  // m and n refers to the actual index in the array
  // m range from 0 to length-2, n range from 2...length-m
  do {
    m = randomNumber(seq.length - 2);
    n = randomNumber(seq.length);
  } while (m >= n);

  for (var i = 0, j = (n - m + 1) >> 1; i < j; i++) {
    seq.swapPoints(m + i, n - i);
  }
  return seq;
}
function pushMutate(seq) {
  mutationTimes++;
  var m, n;
  do {
    m = randomNumber(seq.length >> 1);
    n = randomNumber(seq.length);
  } while (m >= n);

  var s1 = seq.slice(0, m);
  var s2 = seq.slice(m, n);
  var s3 = seq.slice(n, seq.length);
  return s2
    .concat(s1)
    .concat(s3)
    .clonePoint();
}
function setBestValue() {
  for (var i = 0; i < population.length; i++) {
    values[i] = evaluate(population[i]);
  }
  currentBest = getCurrentBest();
  if (bestValue === undefined || bestValue > currentBest.bestValue) {
    best = population[currentBest.bestPosition].clonePoint();
    bestValue = currentBest.bestValue;
    UNCHANGED_GENS = 0;
  } else {
    UNCHANGED_GENS += 1;
  }
}
function getCurrentBest() {
  var bestP = 0,
    currentBestValue = values[0];

  for (var i = 1; i < population.length; i++) {
    if (values[i] < currentBestValue) {
      currentBestValue = values[i];
      bestP = i;
    }
  }
  return {
    bestPosition: bestP,
    bestValue: currentBestValue
  };
}
function setRoulette() {
  //calculate all the fitness
  for (var i = 0; i < values.length; i++) {
    fitnessValues[i] = 1.0 / (values[i]*(population[i][0] === 0 ? 1 : 10));
  }
  //set the roulette
  var sum = 0;
  for (var i = 0; i < fitnessValues.length; i++) {
    sum += fitnessValues[i];
  }
  for (var i = 0; i < roulette.length; i++) {
    roulette[i] = fitnessValues[i] / sum;
  }
  for (var i = 1; i < roulette.length; i++) {
    roulette[i] += roulette[i - 1];
  }
}
function wheelOut(rand) {
  var i;
  for (i = 0; i < roulette.length; i++) {
    if (rand <= roulette[i]) {
      return i;
    }
  }
}
function randomIndivial(n) {
  var a = [];
  for (var i = 0; i < n; i++) {
    a.push(i);
  }
  return a.shufflePoints();
}
function evaluate(indivial) {
  var sum = dis[indivial[0]][indivial[indivial.length - 1]];
  for (var i = 1; i < indivial.length; i++) {
    sum += dis[indivial[i]][indivial[i - 1]];
  }
  return sum;
}
function countDistances() {
  var length = points.length;
  dis = new Array(length);
  for (var i = 0; i < length; i++) {
    dis[i] = new Array(length);
    for (var j = 0; j < length; j++) {
      dis[i][j] = distance(points[i], points[j]);
    }
  }
}
