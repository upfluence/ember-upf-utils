import Ember from 'ember';

var formats = [
  {
    value: 1e3,
    sym: 'k'
  }, {
    value: 1e6,
    sym: 'M'
  }, {
    value: 1e9,
    sym: 'G'
  }
];

var formatNumber = function formatNumber(params) {
  var number = params[0];

  if (number === null || number === undefined) {
    return "N/A";
  }

  var format = formats.filter(format => {
    return format.value < number;
  }).pop();

  if (format) {
    return Math.round(number / format.value) + format.sym;
  }
  if (typeof number === "number") {
    return parseFloat(number.toFixed(2));
  } else {
    return number;
  }
};


export { formatNumber };

export default Ember.Helper.helper(formatNumber);
