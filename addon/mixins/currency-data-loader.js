import Ember from 'ember';
import { formatPrice } from 'ember-upf-utils/helpers/format-price';

const { Mixin, inject, computed, get } = Ember;

export function price(dependentKey, options = {}) {
  return computed(dependentKey, 'currencyData.{currency,rate}', function() {
    if (this.get('currencyData') === null) {
      throw "'price' computed must be used with the CurrencyDataLoaderMixin";
    }

    let base = {
      rate: get(this, 'currencyData.rate'),
      currency: get(this, 'currencyData.currency')
    };

    return formatPrice(
      [get(this, dependentKey)],
      {
        ...base,
        ...options // Allow to override rate / currency
      }
    );
  });
}

export default Mixin.create({
  _currency: inject.service('currency'),

  currencyData: {
    rate: 1,
    currency: 'USD'
  },

  didInsertElement() {
    this._super();

    this.get('_currency').fetch().then((c) => this.set('currencyData', c));
  }
});
