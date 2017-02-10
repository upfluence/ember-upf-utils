import Ember from 'ember';

let perMille = function(value) {
  if (value) { return `${(value * 1000).toFixed(2)}‰`; } else { return value; }
};

export { perMille };

export default Ember.Helper.helper(perMille);
