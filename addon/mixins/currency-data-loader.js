import Ember from 'ember';
import { formatPrice } from 'ember-upf-utils/helpers/format-price';

const { Mixin, inject, computed, get } = Ember;

export function price(dependentKey, options = {}) {
  let args = [dependentKey, 'currencyData.{currency,rate}'];

  args.push(function() {
    if (this.get('currencyData') === null) {
      throw "'price' computed must be used with the CurrencyDataLoaderMixin";
    }

    return formatPrice(
      [get(this, dependentKey)],
      {
        ...options,
        rate: get(this, 'currencyData.rate'),
        currency: get(this, 'currencyData.currency')
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
