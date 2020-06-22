import { makeArray } from '@ember/array';
import RSVP from 'rsvp';
import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import Oauth from '@upfluence/ember-upf-utils/authenticators/auth';

export default Oauth.extend({
  authenticate(grant_type, grant_params, scope) {
    return new RSVP.Promise((resolve, reject) => {
      let data = {
        grant_type,
        ...grant_params
      };

      let serverTokenEndpoint = this.serverTokenEndpoint;
      let scopesString = makeArray(scope).join(' ');
      if (!isEmpty(scopesString)) {
        data.scope = scopesString;
      }
      this.makeRequest(serverTokenEndpoint, data).then((response) => {
        run(() => {
          let expiresAt = this._absolutizeExpirationTime(response.expires_in);
          this._scheduleAccessTokenRefresh(response.expires_in, expiresAt, response.refresh_token);
          if (!isEmpty(expiresAt)) {
            response = Object.assign(response, { 'expires_at': expiresAt });
          }
          resolve(response);
        });
      }, (xhr) => {
        run(null, reject, xhr.responseJSON || xhr.responseText);
      });
    });
  }
});
