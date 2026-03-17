// @ts-nocheck
import { get } from '@ember/object';
import { typeOf } from '@ember/utils';

const DEFAULTS = {
  uploaderUrl: 'http://localhost:8080/upload',
  exportUrl: 'http://localhost:9001/export',
  meURL: 'http://localhost:9000/me',
  settingsURL: 'http://localhost:9000/settings',
  scope: ['facade_web']
};

export default {
  uploaderUrl: DEFAULTS.uploaderUrl,
  exportUrl: DEFAULTS.exportUrl,
  settingsURL: DEFAULTS.settingsURL,
  meURL: DEFAULTS.meURL,
  scope: DEFAULTS.scope,

  __initialized__: false,

  load(config) {
    for (let property in this) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(property) && typeOf(this[property]) !== 'function') {
        this[property] = get(config, property) === undefined ? DEFAULTS[property] : get(config, property);
      }
    }

    this.__initialized__ = true;
  }
};
