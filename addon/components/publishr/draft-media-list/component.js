import Ember from 'ember';
import layout from './template';

const { Component, computed } = Ember;

export default Component.extend({
  layout,

  classNames: ['draft-media-list', 'carousel'],
  attributeBindings: ['dataRide:data-ride'],

  dataRide: 'carousel',

  selectedMedia: null,

  didInsertElement() {
    this.$('.carousel').carousel({ interval: false });
  },

  actions: {
    viewMedia(media) {
      this.set('selectedMedia', media);
    },

    unselectMedia() {
      this.set('selectedMedia', null);
    }
  }
});
