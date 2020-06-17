'use strict';

module.exports = (obj, props) => {
  const newObj = {};
  if (!props) {
    return newObj;
  }

  const arrProps = props.split(',');
  for (const elem of arrProps) {
    newObj[elem] = obj[elem];
  }
  return newObj;
};