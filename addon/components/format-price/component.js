import Ember from 'ember';
import layout from './template';
import { formatPrice } from 'ember-upf-utils/helpers/format-price';

const { Component, inject, computed } = Ember;

export default Component.extend({
  layout,
  tagName: '',

  currency: inject.service(),

  price: null,
  currencyData: {},
  useFormatter: false,

  didInsertElement() {
    this._super();

    this.get('currency').fetch().then((data) => {
      this.set('currencyData', data);
    });
  },

  formattedPrice: computed('price', 'currencyData@each', function() {
    return formatPrice(
      [this.get('price')],
      {
        rate: this.get('currencyData.rate'),
        currency: this.get('currencyData.currency'),
        useFormatter: this.get('useFormatter'),
      }
    );
  })
});
