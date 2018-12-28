import { empty } from '@ember/object/computed';
import Component from '@ember/component';
import Configuration from 'ember-upf-utils/configuration';

import layout from './template';

export default Component.extend({
  layout,

  videoUrl: null,

  allowedExtentions: ['mp4,mov,avi,3gp'],
  uploaderHeaders: { Scope: Configuration.scope[0] },

  noVideoUploaded: empty('videoUrl'),

  _buildVideoNode(url, contentType) {
    let container = document.createElement('div');
    let videoNode = document.createElement('video');
    let videoSourceNode = document.createElement('source');

    container.setAttribute('style', 'width: 95%');
    videoNode.setAttribute('width', '100%');
    videoNode.setAttribute('controls', true);
    videoNode.setAttribute('src', url);
    videoSourceNode.setAttribute('src', url);
    videoSourceNode.setAttribute('type', contentType);

    videoNode.appendChild(videoSourceNode);
    container.appendChild(videoNode);
    container.appendChild(document.createElement('br'));
    return container;
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
