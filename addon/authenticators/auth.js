import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default OAuth2PasswordGrant.extend({
  serverTokenEndpoint: Configuration.oauthUrl,
  clientId: Configuration.oauthClientId
});
