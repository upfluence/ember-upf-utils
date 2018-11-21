/* global $ */
import Ember from 'ember';
import layout from './template';

const { Component, isEmpty } = Ember;

export default Component.extend({
  layout,

  summernoteContext: null,
  customButtons: 'videoUpload,pdfUpload',
  _customButtonsFuncs: [],

  hideVideoUploadModal: true,
  hidePDFUploadModal: true,

  init() {
    let self = this;
    let { ui } = $.summernote;

    let uploadBtns = {
      videoUpload: (context) => {
        context.memo('button.videoUpload', function() {
          return ui.button({
            contents: '<i class="fa fa-video-camera"/></i>',
            tooltip: 'Insert Video',
            click: () => {
              self.set('summernoteContext', context);
              self.send('toggleVideoUpload');
            }
          }).render();
        });
      },

      pdfUpload: (context) => {
        context.memo('button.pdfUpload', function() {
          return ui.button({
            contents: '<i class="fa fa-file-pdf-o"></i>',
            tooltip: 'Insert a PDF file',
            click() {
              self.set('summernoteContext', context);
              self.send('togglePDFUpload');
            }
          }).render();
        });
      }
    };

    if (isEmpty(this.get('_customButtons'))) {
      Object.keys(uploadBtns).filter((x) => {
        return this.get('customButtons').split(',').contains(x);
      }).map((x) => uploadBtns[x]).forEach((customButton) => {
        this.get('_customButtonsFuncs').push(customButton);
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
