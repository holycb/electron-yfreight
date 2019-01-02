//https://github.com/parano/GeneticAlgorithm-TSP/blob/master/src/utils.js

Array.prototype.equals = function(array) {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', { enumerable: false });
Array.prototype.clonePoint = function() {
  return this.slice(0);
};
Array.prototype.shufflePoints = function() {
  for (
    var j, x, i = this.length - 1;
    i;
    j = randomNumber(i), x = this[--i], this[i] = this[j], this[j] = x
  );
  return this;
};
//make a different name
Array.prototype.indexOfPoint = function(value) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === value) {
      return i;
    }
  }
};
Array.prototype.deleteByPointValue = function(value) {
  var pos = this.indexOfPoint(value);
  this.splice(pos, 1);
};
Array.prototype.nextPoint = function(index) {
  if (index === this.length - 1) {
    return this[0];
  } else {
    return this[index + 1];
  }
};
Array.prototype.previousPoint = function(index) {
  if (index === 0) {
    return this[this.length - 1];
  } else {
    return this[index - 1];
  }
};
Array.prototype.swapPoints = function(x, y) {
  if (x > this.length || y > this.length || x === y) {
    return;
  }
  var tem = this[x];
  this[x] = this[y];
  this[y] = tem;
};
function randomNumber(boundary) {
  return parseInt(Math.random() * boundary);
  //return Math.floor(Math.random() * boundary);
}
function distance(p1, p2) {
  if (p1.equals(p2)) return null;
  return distances.find(data => {
    return (
      (data.start.equals(p1) && data.end.equals(p2)) ||
      (data.start.equals(p2) && data.end.equals(p1))
    );
  }).distance;
}
