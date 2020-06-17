'use strict';

const merge = require('./lib/union');
const createFrom = require('./lib/create-from');

const collapse = (array, groupedCols, sumCols) => {
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
    const sumObject = createFrom(elem, sumCols);

    let val = map.get(key);
    if (typeof val === 'undefined') {
      map.set(key, [ groupedObject, sumObject ]);
    } else {
      const sum = merge(val[1], sumObject);
      map.set(key, [ groupedObject, sum ]);
    }
  }

  var result = [];
  map.forEach((value) => {
    const [ grouped, sum ] = value;
    result.push({...grouped, ...sum});
  });
  return result;
};

module.exports = collapse;