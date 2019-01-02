import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { get, computed } from '@ember/object';
import { formatPrice } from '@upfluence/ember-upf-utils/helpers/format-price';

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
  _currency: service('currency'),

  currencyData: {
    rate: 1,
    currency: 'USD'
  },

  didInsertElement() {
    this._super();

    this.get('_currency').fetch().then((c) => this.set('currencyData', c));
  }
});
