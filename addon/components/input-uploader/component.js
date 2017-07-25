import Ember from 'ember';
import EmberUploader from 'ember-uploader';
import layout from './template';

export default EmberUploader.FileField.extend({
  layout,

  filesDidChange(files) {
    if (!Ember.isEmpty(files)) {
      this.sendAction('onFile', files[0]);
    }
  }
});
