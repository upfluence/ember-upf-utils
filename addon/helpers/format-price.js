import Ember from 'ember';
import { formatNumber } from 'ember-upf-utils/helpers/format-number';
import { formatMoneyHelper } from 'oss-components/helpers/format-money';
import symbolMap from 'ember-upf-utils/utils/currency';

const { Helper } = Ember;

export function formatPrice(params, namedArgs) {
  let price = params[0];
  let rate = namedArgs.rate || 1;
  let currency = namedArgs.currency || 'USD';
  let useFormatter = namedArgs.useFormatter || false;

  price = price * rate;

  if (useFormatter) {
    return `${(symbolMap[currency] || '$')}${formatNumber([price])}`;
  }

  return formatMoneyHelper([price, currency]);
}

export default Helper.helper(formatPrice);
