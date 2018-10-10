import Ember from 'ember';
import tinycolor from 'tinycolor';
const { Helper } = Ember;

export function lightenColor(params/*, hash*/) {
  let [color, amount] = params;

  return tinycolor(color).lighten(amount).toString();
}

export default Helper.helper(lightenColor);
