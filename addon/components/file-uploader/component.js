import Ember from 'ember';
import EmberUploader from 'ember-uploader';
import layout from './template';

export default EmberUploader.FileField.extend({
  layout,
  store: Ember.inject.service(),

  model: {},
  method: 'PUT',
  attribute: 'file',

  // Actions
  didUpload: '',
  onProgress: '',
  didError: '',

  url: Ember.computed('model.id', function() {
    return this.get(
      'store'
    ).adapterFor(this.get('model.constructor.modelName')).buildURL(
      this.get('model.constructor.modelName'),
      this.get('model.id')
    );
  }),

  filesDidChange(files) {
    const uploader = EmberUploader.Uploader.create({
      url: this.get('url'),
      method: this.get('method'),
      paramName: this.get('attribute').underscore(),
      paramNamespace: this.get('model.constructor.modelName').underscore()
    });

    uploader
      .on('didUpload', (e) => {
        this.sendAction('didUpload', e);
      })
      .on('progress', (e) => {
        this.sendAction('onProgress', e);
      })
      .on('didError', (jqXHR, textStatus, errorThrown) => {
        this.sendAction('didError', jqXHR, textStatus, errorThrown);
      })
    ;

    if(!Ember.isEmpty(files)) {
      uploader.upload(files[0]).then((s) => {
        this.get('store').pushPayload(s);
      });
    }
  }
});
