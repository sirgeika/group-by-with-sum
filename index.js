'use strict';

const merge = require('./lib/union');
const createFrom = require('./lib/create-from');

const empty = [ {}, {} ];

const groupBy = (array, groupedCols, sumCols) => {
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an Array');
  }

  if (!groupedCols) {
    throw new Error('Second argument must be present');
  }

  if (typeof groupedCols !== 'string') {
    throw new TypeError('Second argument must be a string');
  }

  const map = new Map();

  for (const elem of array) {
    const groupedObject = createFrom(elem, groupedCols);
    const key = JSON.stringify(groupedObject);
    let sumObject = createFrom(elem, sumCols);

    const val = map.get(key) || empty;
    sumObject = merge(val[1], sumObject);
    map.set(key, [ groupedObject, sumObject ]);
  }

  var result = [];
  map.forEach((value) => {
    const [ grouped, sum ] = value;
    result.push({...grouped, ...sum});
  });
  return result;
};

module.exports = groupBy;