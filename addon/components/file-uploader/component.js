import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['file-uploader'],
  session: Ember.inject.service(),

  method: 'PUT',
  attribute: 'file',

  // Actions
  didUpload: '',
  onProgress: '',
  didError: '',

  _onUpload: false,
  _percent: 0,
  _file: {},

  actions: {
    beforeUpload(file) {
      this.set('_file', file);
      this.set('_onUpload', true);
      this.set('_percent', 0);
    },
    didUpload(e) {
      this.sendAction('didUpload', e);
      this.set('_onUpload', false);
      this.set('_percent', 0);
    },
    onProgress(e) {
      this.set('_percent', e.percent);
      this.sendAction('onProgress', e);
    },
    didError(jqXHR, textStatus, errorThrown) {
      this.set('_onUpload', false);
      this.set('error', 'Something happened, please retry.');
      this.sendAction('didError', jqXHR, textStatus, errorThrown);
    }
  }
});
