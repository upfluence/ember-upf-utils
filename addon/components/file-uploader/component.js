import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { isBlank, isEmpty } from '@ember/utils';
import EmberUploader from 'ember-uploader';
import Configuration from 'ember-upf-utils/configuration';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['file-uploader'],
  store: service(),
  session: service(),

  method: 'PUT',
  attribute: 'file',

  text: 'Upload File',

  allowedExtensions: null,
  twoStep: false,
  extra: {},
  headers: {},

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

  _: observer('file', function() {
    if (this.get('_onUpload')) {
      return;
    }
    this.send('onFile', this.get('file'));
  }),

  url: computed('model.id', function() {
    return this.get(
      'store'
    ).adapterFor(this.get('model.constructor.modelName')).buildURL(
      this.get('model.constructor.modelName'),
      this.get('model.id')
    );
  }),

  hasFile: computed('_file', function() {
    return !isEmpty(this.get('_file.name'));
  }),

  isValid: computed('hasFile', function() {
    let errors = [];

    if (!this.get('hasFile')) {
      errors.push({
        type: 'no_file',
        message: 'No file to upload.'
      });
    }

    let exts = this.get('_allowedExtensions');

    if (!isBlank(exts) && !exts.includes(this._getExtension(this.get('_file.name')))) {
      errors.push({
        type: 'no_file',
        message: 'The extension of the file is invalid.'
      });
    }

    if (isBlank(errors)) {
      return true;
    }

    this.sendAction('didValidationError', errors);

    return false;
  }),

  willDestroy() {
    this._clear();
  },

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
    let uploader = this._getUploader();

    uploader
      .on('didUpload', (e) => {
        this.sendAction('didUpload', e);

        if(!this.isDestroyed) {
          this._clear();
        }
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

    if (!isEmpty(this.get('_file'))) {
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
      let match = extensionMatchers[i].exec(filename.toLowerCase());
      if (match) {
        return match[2];
      }
    }

    return null;
  },

  _allowedExtensions: computed('allowedExtensions', function() {
    if (isBlank(this.get('allowedExtensions'))) {
      return [];
    }

    return this.get('allowedExtensions').split(',');
  }),

  // Ensure the BC
  _getUploader() {
    let headers = this.get('headers');
    let token = this.get('session.data.authenticated.access_token');
    let options = {
      ajaxSettings: {
        dataType: 'json',
        headers: {
          ...headers,
          'Authorization': `Bearer ${token}`
        }
      }
    };

    // BC
    if (this.get('model')) {
      options.url = this.get('url');
      options.method = this.get('method');
      options.paramName = this.get('attribute').underscore();
      options.paramNamespace = this.get(
        'model.constructor.modelName'
      ).underscore();
    } else {
      options.url = Configuration.uploaderUrl;
    }

    return EmberUploader.Uploader.create(options);
  },

  _clear() {
    this.set('_onUpload', false);
    this.set('_file', null);
    this.set('_percent', 0);
  }
});
