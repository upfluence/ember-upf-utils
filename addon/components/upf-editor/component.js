import Ember from 'ember';
import layout from './template';

const { Component } = Ember;

export default Ember.Component.extend({
  layout,

  summernoteContext: null,
  customButtons: [],

  hideVideoUploadModal: true,

  init() {
    let self = this;

    let VideoUploadButton = (context) => {
      let ui = $.summernote.ui;

      var button = ui.button({
        contents: '<i class="fa fa-video-camera"/></i>',
        tooltip: 'Insert a video',
        click: function () {
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
