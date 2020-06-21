'use strict';

const merge = require('./lib/union');
const pick = require('./lib/pick');

const groupBy = (array, groupedCols, sumCols, keyFn=JSON.stringify) => {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an Array');
  }

  if (!groupedCols) {
    throw new Error('Second argument must be present');
  }

  if (typeof groupedCols !== 'string') {
    throw new TypeError('Second argument must be a string');
  }

  if (typeof sumCols === 'function') {
    keyFn = sumCols;
    sumCols = '';
  }

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