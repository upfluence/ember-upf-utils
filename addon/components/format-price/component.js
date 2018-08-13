import Ember from 'ember';
import layout from './template';
import CurrencyDataLoaderMixin, { price } from 'ember-upf-utils/mixins/currency-data-loader';

const { Component, defineProperty } = Ember;

export default Component.extend(CurrencyDataLoaderMixin, {
  layout,
  tagName: '',

  useFormatter: false,
  roundPrecision: 2,

  didInsertElement() {
    defineProperty(
      this,
      'formattedPrice',
      price(
        'price',
        {
          useFormatter: this.get('useFormatter'),
          roundPrecision: this.get('roundPrecision')
        }
      )
    );
  }
});
