import Ember from 'ember';
import layout from './template';
import { formatNumber } from 'ember-upf-utils/helpers/format-number';

const { Component, inject, computed } = Ember;

export default Component.extend({
  layout,
  tagName: '',

  currency: inject.service(),

  price: null,
  currencyDetails: {},
  useFormatter: false,

  init() {
    this._super();

    this.get('currency').fetch().then((currency) => {
      this.set('currencyDetails', currency);
    })
  },

  formattedPrice: computed('price', 'currencyDetails.@each', function() {
    let price = this.getWithDefault('price', 0) * this.getWithDefault('currencyDetails.exchange_rate', 1);

    if (this.get('useFormatter')) {
      price = formatNumber([price]);
    }

    return `${this.get('currencyDetails.symbol')}${price}`;
  })
});
