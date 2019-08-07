import { typeOf } from '@ember/utils';
import $ from 'jquery';
import { getWithDefault } from '@ember/object';

const DEFAULTS = {
  storeDomain: 'localhost',
  loginUrl: 'http://localhost:4001/login',
  logoutRedirectUrl: 'http://localhost:4000/',
  oauthUrl: 'http://localhost:9000/token',
  uploaderUrl: 'http://localhost:8080/upload',
  exportUrl: 'http://localhost:9001/export',
  activityUrl: 'https://localhost:9002/',
  meURL: 'http://localhost:9000/me',
  identityURL: 'http://localhost:9000',
  oauthClientId: 'auth_client',
  scope: ['facade_web'],
  notificationWait: 5,
};

export default {
  formattedLoginUrl() {
    let params = $.param({
      scope: this.scope,
      redirect: window.location.href
    });

    return `${this.loginUrl}?${params}`;
  },

  storeDomain: DEFAULTS.storeDomain,
  loginUrl: DEFAULTS.loginUrl,
  oauthUrl: DEFAULTS.oauthUrl,
  uploaderUrl: DEFAULTS.uploaderUrl,
  exportUrl: DEFAULTS.exportUrl,
  activityUrl: DEFAULTS.activityUrl,
  logoutRedirectUrl: DEFAULTS.logoutRedirectUrl,
  oauthClientId: DEFAULTS.oauthClientId,
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
