'use strict';

module.exports = (obj, props) => {
  const newObj = {};
  if (props) {
    let index = -1;
    const arrProps = props.split(',');
    while (++index < arrProps.length) {
      const key = arrProps[index];
      newObj[key] = obj[key];
    }
  }
  return newObj;
};