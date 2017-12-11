import Ember from 'ember';

const {
  Helper
} = Ember;

export function percentage(input) {
  if (!parseInt(input[1])) {
    return 0;
  }

  return Math.round((input[0] / input[1]) * 100);
}

export default Helper.helper(percentage);
