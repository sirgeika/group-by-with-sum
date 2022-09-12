'use strict';

const groupBy = require('group-by-with');

module.exports = groupBy({
  rowCalculator: function(target, value, key) {
    target[key] = target[key] || 0;
    target[key] += (value || 0);
  }
});