import $ from 'jquery';
import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default Service.extend({
  store: service(),
  session: service(),
  ajax: service(),

  _exportURL: computed(function () {
    return `${Configuration.exportUrl}/api/v1`;
  }),

  exportToEntities(exportingFrom, exportingTo, influencerIds, filters, maxSize, tags) {
    let payload = { destination: { to: exportingTo } };

    if (isEmpty(influencerIds)) {
      payload.source = { from: exportingFrom, filters: filters };
    } else {
      payload.source = { influencer_ids: influencerIds };
    }

    if (maxSize) {
      payload.source.max_size = maxSize;
    }

    if (tags) {
      payload.destination.tags = tags;
    }

    return this.ajax.request(`${this._exportURL}/export`, {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${this.get('session.data.authenticated.access_token')}`
      },
      data: JSON.stringify(payload)
    });
  },

  getFileExportURL(from, fileFormat, fileType, influencerIds, filters) {
    let baseUrl = `${this._exportURL}/export/file`;
    let params = [
      'from=' + from,
      'influencer_ids=' + influencerIds.join(','),
      'format=' + fileFormat,
      'type=' + fileType,
      $.param({ filters: filters }),
      'access_token=' + encodeURIComponent(this.get('session.data.authenticated.access_token'))
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
    let url = `${this._exportURL}/export/file/limit`;
    let accessToken = this.get('session.data.authenticated.access_token');

    return this.ajax.request(`${url}?access_token=${encodeURIComponent(accessToken)}`).then(callback);
  },

  getAvailableExports() {
    let accessToken = this.get('session.data.authenticated.access_token');
    return this.ajax.request(`${this._exportURL}/discovery?access_token=${encodeURIComponent(accessToken)}`);
  },

  fetchEntities(type, callback) {
    let url = `${this._exportURL}/entities/${type}`;
    let accessToken = this.get('session.data.authenticated.access_token');

    return this.ajax.request(`${url}?access_token=${encodeURIComponent(accessToken)}`).then(callback);
  },

  searchEntities(keyword) {
    let url = `${this._exportURL}/entities?s=${encodeURIComponent(keyword)}`;
    let accessToken = this.get('session.data.authenticated.access_token');
    return this.ajax.request(`${url}&access_token=${encodeURIComponent(accessToken)}`);
  },

  createEntity(data, callback) {
    let url = `${this._exportURL}/entities`;

    return this.ajax
      .request(url, {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          Authorization: `Bearer ${this.get('session.data.authenticated.access_token')}`
        },
        data: JSON.stringify(data)
      })
      .then(callback);
  }
});
