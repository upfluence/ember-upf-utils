import Ember from 'ember';
import layout from './template';
import CurrencyDataLoaderMixin from 'ember-upf-utils/mixins/currency-data-loader';
import { formatPrice } from 'ember-upf-utils/helpers/format-price';

const { Component, computed } = Ember;

export default Component.extend(CurrencyDataLoaderMixin, {
  layout,
  tagName: '',

  useFormatter: false,
  roundPrecision: 2,

  formattedPrice: computed('price', 'currencyData.{currency,rate}', 'useFormatter', 'roundPrecision', function() {
    return formatPrice([this.get('price')], {
      rate: this.get('currencyData.rate'),
      currency: this.get('currencyData.currency'),
      useFormatter: this.get('useFormatter'),
      roundPrecision: this.get('roundPrecision')
    });
  })
});
