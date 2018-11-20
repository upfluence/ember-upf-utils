/* global $ */
import Ember from 'ember';
import layout from './template';

const { Component, isEmpty } = Ember;

export default Component.extend({
  layout,

  summernoteContext: null,
  activatedCustomButtons: 'VideoUploadButton,PDFUploadButton',
  customButtons: [],

  hideVideoUploadModal: true,
  hidePDFUploadModal: true,

  init() {
    let self = this;

    this.VideoUploadButton = (context) => {
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

    this.PDFUploadButton = (context) => {
      let { ui } = $.summernote;

      return ui.button({
        contents: '<i class="fa fa-file-pdf-o"></i>',
        tooltip: 'Insert a PDF file',
        click() {
          self.set('summernoteContext', context);
          self.send('togglePDFUpload');
        }
      }).render();
    };

    if (isEmpty(this.get('customButtons'))) {
      this.get('activatedCustomButtons').split(',').map((x) => this[x]).forEach((customButton) => {
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
