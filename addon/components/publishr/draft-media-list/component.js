import Ember from 'ember';
import layout from './template';

const { Component, computed } = Ember;

export default Component.extend({
  layout,

  classNames: ['draft-media-list'],

  selectedMedia: null,

  actions: {
    viewMedia(media) {
      this.set('selectedMedia', media);
    },

    unselectMedia() {
      this.set('selectedMedia', null);
    }
  }
});
