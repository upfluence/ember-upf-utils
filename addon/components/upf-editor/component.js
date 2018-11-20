/* global $ */
import Ember from 'ember';
import layout from './template';

const { Component, isEmpty } = Ember;

export default Component.extend({
  layout,

  summernoteContext: null,
  customButtons: [],

  hideVideoUploadModal: true,
  hidePDFUploadModal: true,

  init() {
    let self = this;

    let VideoUploadButton = (context) => {
      let { ui } = $.summernote;

      return ui.button({
        contents: '<i class="fa fa-video-camera"/></i>',
        tooltip: 'Insert a video',
        click() {
          self.set('summernoteContext', context);
          self.send('toggleVideoUpload');
        }
      }).render();
    };

    let PDFUploadButton = (context) => {
      let { ui } = $.summernote;

      return ui.button({
        contents: '<i class="fa fa-file-pdf-o"></i>',
        tooltip: 'Insert a PDF file',
        click() {
          self.set('summernoteContext', context);
          self.send('togglePDFUpload');
        }
      }).render();
    }

    if (isEmpty(this.get('customButtons'))) {
      [VideoUploadButton, PDFUploadButton].forEach((customButton) => {
        console.log(customButton)
        this.customButtons.push(customButton);
      });
    }

    this._super();
  },

  actions: {
    onContentChange(text) {
      this.sendAction('onContentChange', text);
    },

    toggleVideoUpload() {
      this.toggleProperty('hideVideoUploadModal');
    },

    togglePDFUpload() {
      this.toggleProperty('hidePDFUploadModal');
    }
  }
});
