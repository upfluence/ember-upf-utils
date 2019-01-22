import Uploader from 'ember-uploader/uploaders/uploader';
import { Promise } from 'rsvp';
import fileparser from '@upfluence/ember-upf-utils/utils/filesize-parser';
import { isEmpty } from '@ember/utils';

const getExtension = function(filename) {
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
};

const fileExtensionValidatorFactory = function(extensions) {
  return function(file) {
    if (isEmpty(extensions)) {
      return true;
    }

    let exts = exts.split(',');
    let ext = getExtension(file.name);

    if (ext && exts.includes(ext)) {
      return true;
    }

    throw `Only "${exts.join(', ')}" files are allowed.`;
  };
};

const fileSizeValidatorFactory = function(maxSize) {
  return function(file) {
    if (!maxSize) {
      return true;
    }

    let max = fileparser(maxSize);

    if (file.size <= max) {
      return true;
    }

    throw `File size should not be more than ${maxSize}.`;
  };
};

export default Uploader.extend({
  maxSize: null,
  allowedExtensions: '',

  upload(file, extra = {}) {
    let defaultExtra = {
      maxSize: this.maxSize,
      allowedExtensions: this.allowedExtensions
    };

    extra = { ...defaultExtra, ...extra };

    let validators = this._buildValidators(extra);

    try {
      validators.forEach((v) => v(file));
    } catch(err) {
      return Promise.reject(this.didValidationError(err));
    }

    this.beforeUpload(file);

    this._super(file, extra);
  },

  beforeUpload(file) {
    this.trigger('beforeUpload', file);
  },

  didValidationError(error) {
    this.trigger('didValidationError', error);

    return error;
  },

  _buildValidators(extra = {}) {
    return [
      fileExtensionValidatorFactory(extra.allowedExtensions),
      fileSizeValidatorFactory(extra.maxSize)
    ];
  }
})
