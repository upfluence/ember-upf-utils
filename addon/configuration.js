import { get } from '@ember/object';
import { typeOf } from '@ember/utils';

const DEFAULTS = {
  uploaderUrl: 'http://localhost:8080/upload',
  exportUrl: 'http://localhost:9001/export',
  activityUrl: 'https://localhost:9002/',
  meURL: 'http://localhost:9000/me',
  identityURL: 'http://localhost:9000',
  scope: ['facade_web'],
  notificationWait: 5
};

export default {
  uploaderUrl: DEFAULTS.uploaderUrl,
  exportUrl: DEFAULTS.exportUrl,
  activityUrl: DEFAULTS.activityUrl,
  identityURL: DEFAULTS.identityURL,
  meURL: DEFAULTS.meURL,
  scope: DEFAULTS.scope,
  notificationWait: DEFAULTS.notificationWait,

  __initialized__: false,

  load(config) {
    for (let property in this) {
      if (this[property] && typeOf(this[property]) !== 'function') {
        this[property] = get(config, property) === undefined ? DEFAULTS[property] : get(config, property);
      }
    }

    this.__initialized__ = true;
  }
};
