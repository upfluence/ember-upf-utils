import { getOwner } from '@ember/application';
import Service from '@ember/service';
import { isEmpty, typeOf } from '@ember/utils';

import CookieService from 'ember-cookies/services/cookies';

// Rewritten here because ember-cookies does not expose its utils,
// unfortunately.
const serializeCookie = (name, value, options = {}) => {
  let cookie = `${name}=${value}`;

  if (!isEmpty(options.domain)) {
    cookie = `${cookie}; domain=${options.domain}`;
  }
  if (typeOf(options.expires) === 'date') {
    cookie = `${cookie}; expires=${options.expires.toUTCString()}`;
  }
  if (!isEmpty(options.maxAge)) {
    cookie = `${cookie}; max-age=${options.maxAge}`;
  }
  if (options.secure) {
    cookie = `${cookie}; secure`;
  }
  if (options.httpOnly) {
    cookie = `${cookie}; httpOnly`;
  }
  if (!isEmpty(options.path)) {
    cookie = `${cookie}; path=${options.path}`;
  }
  if (!isEmpty(options.sameSite)) {
    cookie = `${cookie}; SameSite=${options.sameSite}`;
  }

  return cookie;
};

export default CookieService.extend({
  _serializeCookie(name, value, options = {}) {
    let cookiesConfig = getOwner(this).resolveRegistration(
      'config:environment'
    ).cookies;

    let { secure, sameSite } = cookiesConfig;

    if (cookiesConfig) {
      Object.assign(options, cookiesConfig);
    }

    console.log('=> options', options)
    console.log('====>', serializeCookie(name, value, options))
    return serializeCookie(name, value, options);
  },
});
