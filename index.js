'use strict';

const merge = require('./lib/union');
const pick = require('./lib/pick');

const validateIntersection = function(cols1, cols2) {
  if (cols2) {
    const arr1 = cols1.split(',');
    const arr2 = cols2.split(',');

    let intersected;
    const hasIntersection = arr2.some((s) => {
      intersected = s;
      return arr1.indexOf(s) >= 0;
    });

    if (hasIntersection) {
      throw new Error(`Column list should not intersect: ${intersected}`);
    }
  }
};

const validateParams = function(array, groupedCols, sumCols) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an Array');
  }

  if (!groupedCols) {
    throw new Error('Argument "groupedCols" must be present');
  }

  if (typeof groupedCols !== 'string') {
    throw new TypeError('Argument "groupedCols" must be a string');
  }

  if (sumCols && typeof sumCols !== 'string') {
    throw new TypeError('Argument "sumCols" must be a string');
  }

  validateIntersection(groupedCols, sumCols);
};

/**
 * Collapses an array of objects at the specified object properties
 *
 * @param {array} array - initial array of objects
 * @param {string} groupedCols - grouping columns
 * @param {string} sumCols - summarization columns
 * @param {function} keyFn - additional function to transform keys
 * @returns {[]} - array of objects
 */
const groupBy = (array, groupedCols, sumCols, keyFn=JSON.stringify) => {

  if (typeof sumCols === 'function') {
    [ keyFn, sumCols ] = [ sumCols, '' ];
  }

  validateParams(array, groupedCols, sumCols);

  const map = new Map();

  for (const elem of array) {
    const grouped = pick(elem, groupedCols);
    const sum = pick(elem, sumCols);

    const key = keyFn(grouped);

    const [, currentSum] = map.get(key) || [];
    const nextSum = merge(currentSum, sum);
    map.set(key, [ grouped, nextSum ]);
  }

  const result = [];
  map.forEach((value) => {
    const [ grouped, sum ] = value;
    result.push({...grouped, ...sum});
  });
  return result;
};

module.exports = groupBy;