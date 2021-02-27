import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';
import CurrencyDataLoaderMixin from '@upfluence/ember-upf-utils/mixins/currency-data-loader';
import { formatPrice } from '@upfluence/ember-upf-utils/helpers/format-price';

export default Component.extend(CurrencyDataLoaderMixin, {
  layout,
  tagName: '',

  useFormatter: false,
  roundPrecision: 2,

  formattedPrice: computed('price', 'currencyData.{currency,rate}', 'useFormatter', 'roundPrecision', function() {
    return formatPrice([this.price], {
      rate: this.get('currencyData.rate'),
      currency: this.get('currencyData.currency'),
      useFormatter: this.useFormatter,
      roundPrecision: this.roundPrecision
    });
  })
});
