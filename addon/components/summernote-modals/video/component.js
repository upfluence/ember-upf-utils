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

  _buildVideoNode(url) {
    let videoNode = document.createElement('video');
    let videoSourceNode = document.createElement('source');

    videoNode.setAttribute('width', '100%');
    videoNode.setAttribute('controls', true);
    videoSourceNode.setAttribute('src', url);

    videoNode.appendChild(videoSourceNode);
    return videoNode;
  },

  actions: {
    insertVideo(_, defer) {
      run.later(() => {
        defer.resolve();
      }, 200);

      this.get('editor-context').invoke(
        'editor.insertNode', this._buildVideoNode(this.get('videoUrl'))
      );
      this.sendAction('closeModal');
    },

    resetVideoUrl() {
      this.set('videoUrl', null);
    },

    videoUploaded({ artifact }) {
      this.set('videoUrl', artifact.url);
    }
  }
});
