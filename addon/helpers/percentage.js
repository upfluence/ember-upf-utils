import Ember from 'ember';

const {
  Helper
} = Ember;

export function percentage(input) {
  let percentage = Math.round((input[0] / input[1]) * 100);
  return (!isNaN(parseFloat(percentage)) && isFinite(percentage)) ? percentage : '— ';
}

export default Helper.helper(percentage);
