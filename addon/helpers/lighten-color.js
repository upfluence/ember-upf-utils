import Helper from '@ember/component/helper';
import tinycolor from 'tinycolor2';

export function lightenColor(params /*, hash*/) {
  let [color, amount] = params;

  return tinycolor(color).lighten(amount).toString();
}

export default Helper.helper(lightenColor);
