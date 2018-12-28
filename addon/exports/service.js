import $ from 'jquery';
import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Configuration from 'ember-upf-utils/configuration';

export default Service.extend({
  store: service(),
  session: service(),
  ajax: service(),

  _exportURL: computed(function() {
    return `${Configuration.exportUrl}/api/v1`;
  }),

  exportToEntities(exportingFrom, exportingTo, influencerIds, filters) {
    let payload = { to: exportingTo };

    if (isEmpty(influencerIds)) {
      payload.source = { from: exportingFrom, filters: filters };
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

  getFileExportURL(from, fileFormat, fileType, influencerIds, filters) {
    let baseUrl = `${this.get('_exportURL')}/export/file`;
    let params = [
      'from=' + from,
      'influencer_ids=' + influencerIds.join(','),
      'format=' + fileFormat,
      'type=' + fileType,
      $.param({ filters: filters }),
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
  },

  fetchEntities(type, callback) {
    let url = `${this.get('_exportURL')}/entities/${type}`;
    let accessToken = this.get('session.data.authenticated.access_token');

    return this.get('ajax').request(
      `${url}?access_token=${encodeURIComponent(accessToken)}`
    ).then(callback);
  },

  createEntity(data, callback) {
    let url = `${this.get('_exportURL')}/entities`;

    return this.get('ajax').request(url, {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${this.get('session.data.authenticated.access_token')}`
      },
      data: JSON.stringify(data)
    }).then(callback);
  }
});
