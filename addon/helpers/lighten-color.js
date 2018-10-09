import Ember from 'ember';
import less from 'less/dist/less';

const { Helper } = Ember;
const lighten = less.functions.functionRegistry.get('lighten');

export function lightenColor(params/*, hash*/) {
  let [color, amount] = params;

  if (color[0] === "#") {
    color = color.slice(1);
  }

  return lighten(less.color(color), { value: amount }).toRGB();
}

export default Helper.helper(lightenColor);
