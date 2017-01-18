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
    sym: 'B'
  }
];

var formatNumber = function formatNumber(params) {
  var number = params[0];

  if (number === null || number === undefined) {
    return "—";
  }

  var format = formats.filter(format => {
    return format.value < number;
  }).pop();

  if (format) {
    if (Math.round(number / format.value) < 10) {
      return (number / format.value).toFixed(1) + format.sym;
    }

    return Math.round(number / format.value) + format.sym;
  }
  if (typeof number === "number") {
    if (number >= 100) {
      return number.toFixed();
    }

    return parseFloat(number.toFixed(2));
  } else {
    return number;
  }
};


export { formatNumber };

export default Ember.Helper.helper(formatNumber);
