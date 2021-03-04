import Helper from '@ember/component/helper';
import { formatNumber } from '@upfluence/ember-upf-utils/helpers/format-number';
import { formatMoneyHelper } from 'oss-components/helpers/format-money';
import symbolMap from '@upfluence/ember-upf-utils/utils/currency';

const defaultOptions = {
  rate: 1,
  currency: 'USD',
  useFormatter: false,
  roundPrecision: 2
};

export function formatPrice(params, namedArgs = {}) {
  let price = params[0];
  let options = { ...defaultOptions, ...namedArgs };

  price = price * options.rate;

  if (options.roundPrecision > 0) {
    price = price.toFixed(options.roundPrecision);
  } else if (options.roundPrecision === 0) {
    price = Math.ceil(price);
  }

  if (options.useFormatter) {
    return `${symbolMap[options.currency] || '$'}${formatNumber([price])}`;
  }

  return formatMoneyHelper([price, options.currency]);
}

export default Helper.helper(formatPrice);
