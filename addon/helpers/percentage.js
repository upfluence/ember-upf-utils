import Helper from '@ember/component/helper';

export function percentage(input) {
  if (!parseInt(input[1])) {
    return 0;
  }

  return Math.round((input[0] / input[1]) * 100);
}

export default Helper.helper(percentage);
