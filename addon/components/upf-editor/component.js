/* global $ */
import Component from '@ember/component';

import { isEmpty } from '@ember/utils';
import layout from './template';

export default Component.extend({
  layout,

  summernoteContext: null,
  customButtons: 'videoUpload,pdfUpload',
  _customButtonsFuncs: [],

  hideVideoUploadModal: true,
  hidePDFUploadModal: true,

  init() {
    this._super();

    let self = this;

    let uploadBtns = {
      videoUpload: function(context) {
        context.memo('button.videoUpload', () => {
          return $.summernote.ui.button({
            contents: '<i class="fa fa-video-camera"/></i>',
            tooltip: 'Insert Video',
            click: () => {
              self.set('summernoteContext', context);
              self.send('toggleVideoUpload');
            }
          }).render();
        });
      },

      pdfUpload: function(context) {
        context.memo('button.pdfUpload', function() {
          return $.summernote.ui.button({
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

    if (isEmpty(this._customButtonsFuncs)) {
      Object.keys(uploadBtns).filter((x) => {
        return this.customButtons.split(',').includes(x);
      }).map((x) => uploadBtns[x]).forEach((customButton) => {
        this._customButtonsFuncs.push(customButton);
      });
    }
  },

  didReceiveAttrs() {
    if (this.content && this.$('#summernote')) {
      this.$('#summernote').summernote('code', this.content);
    }
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
