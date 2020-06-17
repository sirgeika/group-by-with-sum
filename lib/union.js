'use strict';

module.exports = (target, source) => {
  const newTarget = Object.assign({}, target);

  for (let [ key, value ] of Object.entries(source)) {
    newTarget[key] = newTarget[key] || 0;
    newTarget[key] += (value || 0);
  }
  return newTarget;
};