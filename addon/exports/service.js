import Ember from 'ember';
import Configuration from 'ember-upf-utils/configuration';

const {
  Service,
  computed,
  inject,
  isEmpty
} = Ember;

export default Service.extend({
  store: inject.service(),
  session: inject.service(),
  ajax: inject.service(),

  _exportURL: computed(function() {
    return `${Configuration.exportUrl}/api/v1`;
  }),

  exportToEntities(exportingFrom, exportingTo, influencerIds) {
    let payload = { to: exportingTo };

    if (isEmpty(influencerIds)) {
      payload.source = { from: exportingFrom };
    } else {
      payload.source = { influencer_ids: influencerIds };
    }

    return this.get('ajax').request(`${this.get('_exportURL')}/export`, {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${this.get('session.data.authenticated.access_token')}`
      },
      data: JSON.stringify(payload)
    });
  },

  getFileExportURL(from, fileFormat, fileType, influencerIds) {
    let baseUrl = `${this.get('_exportURL')}/export/file`;
    let params = [
      'from=' + from,
      'influencer_ids=' + influencerIds.join(','),
      'format=' + fileFormat,
      'type=' + fileType,
      'access_token=' + encodeURIComponent(
        this.get('session.data.authenticated.access_token')
      )
    ];

    return baseUrl + '?' + params.join('&');
  },

  /*
  ** Get the export limit of a user as a JSON :
  ** {
  **    limit: // Total available
  **    spent: // Total left
  ** }
  */
  getLimit(callback) {
    let url = `${this.get('_exportURL')}/export/file/limit`;
    let accessToken = this.get('session.data.authenticated.access_token');

    return this.get('ajax').request(
      `${url}?access_token=${encodeURIComponent(accessToken)}`
    ).then(callback);
  },

  getAvailableExports() {
    let accessToken = this.get('session.data.authenticated.access_token');
    return this.get('ajax').request(
      `${this.get('_exportURL')}/discovery?access_token=${encodeURIComponent(accessToken)}`
    );
  }
});
