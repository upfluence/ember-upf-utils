import Ember from 'ember';

const {
  Helper
} = Ember;

export function percentage(input) {
  return Math.round((input[0] / input[1]) * 100);
}

export default Helper.helper(percentage);
