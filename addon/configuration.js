import { typeOf } from '@ember/utils';
import $ from 'jquery';
import { getWithDefault } from '@ember/object';

const DEFAULTS = {
  uploaderUrl: 'http://localhost:8080/upload',
  exportUrl: 'http://localhost:9001/export',
  activityUrl: 'https://localhost:9002/',
  meURL: 'http://localhost:9000/me',
  identityURL: 'http://localhost:9000',
  scope: ['facade_web'],
  notificationWait: 5,
};

export default {
  uploaderUrl: DEFAULTS.uploaderUrl,
  exportUrl: DEFAULTS.exportUrl,
  activityUrl: DEFAULTS.activityUrl,
  identityURL: DEFAULTS.identityURL,
  meURL: DEFAULTS.meURL,
  scope: DEFAULTS.scope,
  notificationWait: DEFAULTS.notificationWait,

  load(config) {
    for (let property in this) {
      if (this.hasOwnProperty(property) && typeOf(this[property]) !== 'function') {
        this[property] = getWithDefault(config, property, DEFAULTS[property]);
      }
    }
  }
};
