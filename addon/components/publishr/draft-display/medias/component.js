import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  classNames: ['draft-media-list', 'carousel'],
  attributeBindings: ['dataRide:data-ride'],

  dataRide: 'carousel',

  didInsertElement() {
    this.$('.carousel').carousel({ interval: false });
  }
});
