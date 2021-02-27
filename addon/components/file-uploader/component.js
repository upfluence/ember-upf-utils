import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { isBlank, isEmpty } from '@ember/utils';
import Configuration from '@upfluence/ember-upf-utils/configuration';
import { formatNumber } from '@upfluence/ember-upf-utils/helpers/format-number';
import Uploader from '@upfluence/ember-upf-utils/uploader';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['file-uploader'],
  store: service(),
  session: service(),
  toast: service(),

  method: 'PUT',
  attribute: 'file',

  text: 'Upload File',

  maxSize: null,
  allowedExtensions: null,
  twoStep: false,
  extra: {},
  headers: {},

  // Since this doesn't work well, this is disable by defaut.
  useProgress: false,

  // Actions
  beforeUpload: null,
  didUpload: null,
  onProgress: null,
  didError: null,
  didValidationError: null,
  file: null,

  _onUpload: false,
  _isValid: true,
  _percent: 0,

  _: observer('file', function() {
    this._upload();
  }),

  url: computed('model.constructor.modelName', 'model.id', function() {
    return this.store.adapterFor(
      this.get('model.constructor.modelName')
    ).buildURL(
      this.get('model.constructor.modelName'),
      this.get('model.id')
    );
  }),

  hasFile: notEmpty('file.name'),

  willDestroy() {
    this._super(...arguments);
    this._clear();
  },

  actions: {
    clear() {
      this._clear();
    },
    onFile(file) {
      this.set('file', file);
    },
    upload() {
      this._upload();
    }
  },

  _upload() {
    if (this._onUpload) {
      return;
    }

    let uploader = this._getUploader();

    uploader
      .on('beforeUpload', (file) => {
        this.set('_onUpload', true);
        if (this.beforeUpload) {
          this.beforeUpload(file);
        }
      })
      .on('didUpload', (e) => {
        if (this.didUpload) {
          this.didUpload(e);
        }

        if(!this.isDestroyed) {
          this._clear();
        }
      })
      .on('progress', (e) => {
        if (!this.useProgress) {
          return;
        }

        this.set('_percent', e.percent);
        if (this.onProgress) {
          this.onProgress(e);
        }
      })
      .on('didValidationError', (error) => {
        this.set('_onUpload', false);
        this.set('_isValid', false);
        this.toast.info(
          error || 'Your file is invalid. Please check the requirements.'
        );

        if (this.didValidationError) {
          this.didValidationError(error);
        }
      })
      .on('didError', (jqXHR, textStatus, errorThrown) => {
        let payload = null;

        if (jqXHR && jqXHR.responseText) {
          try {
            payload = JSON.parse(jqXHR.responseText);
          } catch(e) {
            // silent
          }
        }

        this.set('file', null);
        this.set('_onUpload', false);
        // dispatch payload from backend

        if (this.didError) {
          this.didError(payload, errorThrown);
        }
      })
    ;

    if (!isEmpty(this.file)) {
      /* jshint ignore:start */
      uploader.upload(this.file, {
        ...this.extra,
        allowedExtensions: this.allowedExtensions,
        maxSize: this.maxSize,
      });
      /* jshint ignore:end */
    }
  },

  // Ensure the BC
  _getUploader() {
    let token = this.get('session.data.authenticated.access_token');
    let options = {
      ajaxSettings: {
        dataType: 'json',
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${token}`
        }
      }
    };

    // BC
    if (this.model) {
      options.url = this.url;
      options.method = this.method;
      options.paramName = this.attribute.underscore();
      options.paramNamespace = this.get(
        'model.constructor.modelName'
      ).underscore();
    } else {
      options.url = Configuration.uploaderUrl;
    }

    return Uploader.create(options);
  },

  _clear() {
    this.set('file', null);
    this.set('_onUpload', false);
    this.set('_isValid', true);
    this.set('_percent', 0);
  }
});
