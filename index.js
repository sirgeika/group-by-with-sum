'use strict';

const merge = require('./lib/union');
const pick = require('./lib/pick');

const validateIntersection = function(props1, props2) {
  if (props2) {
    const arr1 = props1.split(',');
    const arr2 = props2.split(',');

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

const validateParams = function(array, groupedProps, sumProps) {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an Array');
  }

  if (!groupedProps) {
    throw new Error('Argument "groupedProps" must be present');
  }

  if (typeof groupedProps !== 'string') {
    throw new TypeError('Argument "groupedProps" must be a string');
  }

  if (sumProps && typeof sumProps !== 'string') {
    throw new TypeError('Argument "sumProps" must be a string');
  }

  validateIntersection(groupedProps, sumProps);
};

/**
 * Collapses an array of objects at the specified object properties
 *
 * @param {array} array - initial array of objects
 * @param {string} groupedProps - grouping properties
 * @param {string} sumProps - summarization properties
 * @param {function} keyFn - additional function to transform keys
 * @returns {[]} - array of objects
 */
const groupBy = (array, groupedProps, sumProps, keyFn=JSON.stringify) => {

  if (typeof sumProps === 'function') {
    [ keyFn, sumProps ] = [ sumProps, '' ];
  }

  validateParams(array, groupedProps, sumProps);

  const map = new Map();

  for (const elem of array) {
    const grouped = pick(elem, groupedProps);
    const sum = pick(elem, sumProps);

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