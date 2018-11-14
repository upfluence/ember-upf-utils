import Ember from 'ember';
import layout from './template';

const { Component, computed } = Ember;

export default Component.extend({
  layout,

  classNames: ['draft-media-list', 'carousel'],
  attributeBindings: ['dataRide:data-ride'],

  dataRide: 'carousel',

  didInsertElement() {
    this.$('.carousel').carousel({ interval: false });
  }
});
