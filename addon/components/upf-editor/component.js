/* global $ */
import Ember from 'ember';
import layout from './template';

const { Component } = Ember;

export default Component.extend({
  layout,

  summernoteContext: null,
  customButtons: [],

  hideVideoUploadModal: true,

  init() {
    let self = this;

    let VideoUploadButton = (context) => {
      let { ui } = $.summernote;

      let button = ui.button({
        contents: '<i class="fa fa-video-camera"/></i>',
        tooltip: 'Insert a video',
        click() {
          self.set('summernoteContext', context);
          self.send('toggleVideoUpload');
        }
      });

      return button.render();
    };

    this.customButtons.push(VideoUploadButton);

    this._super();
  },

  actions: {
    onContentChange(text) {
      this.sendAction('onContentChange', text);
    },

    toggleVideoUpload() {
      this.toggleProperty('hideVideoUploadModal');
    }
  }
});
