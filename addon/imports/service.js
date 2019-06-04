import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default Service.extend({
  store: service(),
  session: service(),
  ajax: service(),

  _url: computed(function() {
    return `${Configuration.exportUrl}/api/v1`;
  }),

  fetchKeywordResults(keywords, callback) {
    let url = `${this.get('_url')}/entities?s=${keywords}`;
    let accessToken = this.get('session.data.authenticated.access_token');

    return this.get('ajax').request(
      `${url}&access_token=${encodeURIComponent(accessToken)}`
    ).then(callback);
  }
});