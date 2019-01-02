import Cookie from 'ember-simple-auth/session-stores/cookie';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default Cookie.extend({
  cookieName: 'upfluence-auth',
  cookieDomain: Configuration.storeDomain,
  // Can't set unlimited validity, so we set an arbitrary two months
  cookieExpirationTime: ( 2 * 31 * 24 * 60 * 60 )
});
