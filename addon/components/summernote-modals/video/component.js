import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';

import layout from './template';

const {
  Component,
  computed,
  run
} = Ember;

export default Component.extend({
  layout,

  videoUrl: null,

  allowedExtentions: ['mp4,mov,avi,3gp'],
  uploaderHeaders: { Scope: Configuration.scope[0] },

  noVideoUploaded: computed.empty('videoUrl'),

  _buildVideoNode(url, contentType) {
    let videoNode = document.createElement('video');
    let videoSourceNode = document.createElement('source');

    videoNode.setAttribute('width', '100%');
    videoNode.setAttribute('controls', true);
    videoSourceNode.setAttribute('src', url);
    videoSourceNode.setAttribute('type', contentType);

    videoNode.appendChild(videoSourceNode);
    return videoNode;
  },

  actions: {
    insertVideo() {
      this.get('editor-context').invoke(
        'editor.insertNode', this._buildVideoNode(
          this.get('videoUrl'), this.get('videoType')
        )
      );
      this.sendAction('closeModal');
      this.send('resetVideoUpload');
    },

    resetVideoUpload() {
      this.set('videoUrl', null);
      this.set('videoType', null);
      this.set('videoName', null);
    },

    videoUploaded({ artifact }) {
      this.set('videoUrl', artifact.url);
      this.set('videoType', artifact.content_type);
      this.set('videoName', artifact.filename);
    }
  }
});