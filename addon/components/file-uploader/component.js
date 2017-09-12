import Ember from 'ember';
import EmberUploader from 'ember-uploader';
import Configuration from 'ember-upf-utils/configuration';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['file-uploader'],
  store: Ember.inject.service(),
  session: Ember.inject.service(),

  method: 'PUT',
  attribute: 'file',

  text: 'Add an file',

  allowedExtensions: null,
  twoStep: false,
  extra: {},

  // Since this doesn't work well, this is disable by defaut.
  useProgress: false,

  // Actions
  beforeUpload: '',
  didUpload: '',
  onProgress: '',
  didError: '',
  didValidationError: '',

  _onUpload: false,
  _percent: 0,
  _file: null,

  url: Ember.computed('model.id', function() {
    return this.get(
      'store'
    ).adapterFor(this.get('model.constructor.modelName')).buildURL(
      this.get('model.constructor.modelName'),
      this.get('model.id')
    );
  }),

  hasFile: Ember.computed('_file', function() {
    return !Ember.isEmpty(this.get('_file.name'));
  }),

  isValid: Ember.computed('hasFile', function() {
    let errors = [];

    if (!this.get('hasFile')) {
      errors.push({
        type: 'no_file',
        message: 'No file to upload.'
      });
    }

    let exts = this.get('_allowedExtensions');

    if (!Ember.isBlank(exts) && !exts.includes(this._getExtension(this.get('_file.name')))) {
      errors.push({
        type: 'no_file',
        message: 'The extension of the file is invalid.'
      });
    }

    if (Ember.isBlank(errors)) {
      return true;
    }

    this.sendAction('didValidationError', errors);

    return false;
  }),

  actions: {
    clear() {
      this._clear();
    },
    onFile(file) {
      this.set('_file', file);

      if (!this.get('twoStep') && this.get('isValid')) {
        this._upload();
      }
    },
    upload() {
      this._upload();
    }
  },

  _upload() {
    let uploader = EmberUploader.Uploader.create({
      url: Configuration.uploaderUrl,
      ajaxSettings: {
        dataType: 'json',
        headers: {
          'Authorization':
            `Bearer ${this.get('session.data.authenticated.access_token')}`
        }
      }
    });

    uploader
      .on('didUpload', (e) => {
        this.sendAction('didUpload', e);
        this._clear();
      })
      .on('progress', (e) => {
        if (!this.get('useProgress')) {
          return;
        }

        this.set('_percent', e.percent);
        this.sendAction('onProgress', e);
      })
      .on('didError', (jqXHR, textStatus, errorThrown) => {
        let payload = null;

        if (jqXHR.responseText) {
          try {
            payload = JSON.parse(jqXHR.responseText);
          } catch(e) {
            // silent
          }
        }

        this.set('_file', null);
        this.set('_onUpload', false);
        // dispatch payload from backend
        this.sendAction('didError', payload, errorThrown);
      })
    ;


    if (!Ember.isEmpty(this.get('_file'))) {
      this.sendAction('beforeUpload', this.get('_file'));
      this.set('_onUpload', true);
      /* jshint ignore:start */
      let extra = this.get('extra');
      uploader.upload(this.get('_file'), {
        ...extra,
        allowed_extensions: this.get('allowedExtensions')
      });
      /* jshint ignore:end */
    }
  },

  _getExtension(filename) {
    let extensionMatchers = [
      new RegExp(/^(.+)\.(tar\.([glx]?z|bz2))$/),
      new RegExp(/^(.+)\.([^\.]+)$/)
    ];

    for (let i = 0; i < extensionMatchers.length; i++) {
      let match = extensionMatchers[i].exec(filename);
      if (match) {
        return match[2];
      }
    }

    return null;
  },

  _allowedExtensions: Ember.computed('allowedExtensions', function() {
    if (Ember.isBlank(this.get('allowedExtensions'))) {
      return [];
    }

    return this.get('allowedExtensions').split(',');
  }),

  _clear() {
    this.set('_onUpload', false);
    this.set('_file', null);
    this.set('_percent', 0);
  }
});
