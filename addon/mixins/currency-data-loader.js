import Ember from 'ember';
import { formatPrice } from 'ember-upf-utils/helpers/format-price';

const { Mixin, inject, computed, get } = Ember;

export function price(dependentKey, useFormatter) {
  let args = [dependentKey, 'currencyData.{currency,rate}'];
  let _useFormatter = false;
  let isString = typeof useFormatter === 'string';

  if (isString) {
    args.push(useFormatter);
  } else if (typeof useFormatter === 'boolean') {
    _useFormatter = useFormatter;
  }

  args.push(function() {
    return formatPrice(
      [get(this, dependentKey)],
      {
        rate: get(this, 'currencyData.rate'),
        currency: get(this, 'currencyData.currency'),
        useFormatter: isString ? get(this, useFormatter) : _useFormatter
      }
    );
  });

  return computed(...args);
}

export default Mixin.create({
  _currency: inject.service('currency'),

  currencyData: {},

  didInsertElement() {
    this._super();

    this.get('_currency').fetch().then((c) => this.set('currencyData', c));
  }
});
