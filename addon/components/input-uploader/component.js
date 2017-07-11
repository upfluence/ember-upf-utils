import Ember from 'ember';
import EmberUploader from 'ember-uploader';
import layout from './template';

export default EmberUploader.FileField.extend({
  layout,
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  model: {},
  method: 'PUT',
  attribute: 'file',

  // Actions
  beforeUpload: '',
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
    let uploader = EmberUploader.Uploader.create({
      url: this.get('url'),
      method: this.get('method'),
      paramName: this.get('attribute').underscore(),
      paramNamespace: this.get('model.constructor.modelName').underscore(),
      ajaxSettings: {
        headers: {
          'Authorization':
            `Bearer ${this.get('session.data.authenticated.access_token')}`
        }
      }
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

    if (!Ember.isEmpty(files)) {
      this.sendAction('beforeUpload', files[0]);
      uploader.upload(files[0]);
    }
  }
});
