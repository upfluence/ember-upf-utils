import Ember from 'ember';

const { Helper } = Ember;

let perCent = function(value) {
  if (value) { return `${(value * 100).toFixed(2)}%`; } else { return value; }
};

export { perCent };

export default Helper.helper(perCent);
