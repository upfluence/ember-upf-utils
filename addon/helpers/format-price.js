import Ember from 'ember';
import { formatNumber } from 'ember-upf-utils/helpers/format-number';
import { formatMoneyHelper } from 'oss-components/helpers/format-money';
import symbolMap from 'ember-upf-utils/utils/currency';

const { Helper } = Ember;
const defaultOptions = {
  rate: 1,
  currency: 'USD',
  useFormatter: false,
  roundPrecision: 0,
};

export function formatPrice(params, namedArgs) {
  let price = params[0];
  let options = { ...defaultOptions, namedArgs};

  price = price * rate;

  if (options.useFormatter) {
    return `${(symbolMap[currency] || '$')}${formatNumber([price])}`;
  } else if (options.roundPrecision >= 0) {
    let precision = 1;

    if (options.roundPrecision === 0) {
      precision = options.roundPrecision * 10;
    }

    price = Math.round(price * precision) / precision;
  }

  return formatMoneyHelper([price, currency]);
}

export default Helper.helper(formatPrice);
