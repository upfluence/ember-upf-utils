import Helper from '@ember/component/helper';

let perCent = function(value) {
  if (value) { return `${(value * 100).toFixed(2)}%`; } else { return value; }
};

export { perCent };

export default Helper.helper(perCent);
