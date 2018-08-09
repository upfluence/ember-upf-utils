import Ember from 'ember';
import layout from './template';
import CurrencyDataLoaderMixin, { price } from 'ember-upf-utils/mixins/currency-data-loader';

const { Component } = Ember;

export default Component.extend(CurrencyDataLoaderMixin, {
  layout,
  tagName: '',

  useFormatter: false,

  formattedPrice: price('price', 'useFormatter')
});
