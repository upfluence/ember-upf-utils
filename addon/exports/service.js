import $ from 'jquery';
import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default Service.extend({
  store: service(),
  session: service(),
  ajax: service(),
  communityThresholdManager: service(),

  _exportURL: computed(function () {
    return `${Configuration.exportUrl}/api/v1`;
  }),

  _baseHeaders: computed('session.data.authenticated.access_token', function () {
    return {
      Authorization: `Bearer ${this.get('session.data.authenticated.access_token')}`
    };
  }),

  /*
   * @param {Object} source - Export source data
   *       @param {string}    source.from             - format: “type:id”,
   *       @param {string}    source.artifact_key
   *       @param {string}    source.media_url
   *       @param {number}    source.max_size
   *       @param {number[]}  source.influencer_ids
   *       @param {string}    source.search_query     - format: JSON.stringify({criteria?, audience_filter?, filter?, current_list?})
   *       @param {Object[]}  source.filters
   *             @param {string} filters.name
   *             @param {string} filters.value
   *
   * @param {Object} destination - Export destination data
   *       @param {string[]} tags
   *       @param {string} to                         - format: "type:id"
   */
  perform(source, destination) {
    return this.ajax
      .request(`${this._exportURL}/export`, {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          Authorization: `Bearer ${this.get('session.data.authenticated.access_token')}`
        },
        data: JSON.stringify({ source, destination })
      })
      .catch(({ payload }) => {
        this.communityThresholdManager.processException(payload);
      });
  },

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
      headers: this._baseHeaders,
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
    return this.ajax
      .request(`${this._exportURL}/export/file/limit`, {
        method: 'GET',
        headers: this._baseHeaders
      })
      .then(callback);
  },

  getAvailableExports() {
    return this.ajax.request(`${this._exportURL}/discovery`, {
      method: 'GET',
      headers: this._baseHeaders
    });
  },

  fetchEntities(type, callback) {
    return this.ajax
      .request(`${this._exportURL}/entities/${type}`, {
        method: 'GET',
        headers: this._baseHeaders
      })
      .then(callback);
  },

  searchEntities(keyword, entityTypes = []) {
    const params = {
      s: keyword
    };

    if (entityTypes.length > 0) {
      params['entity_types'] = entityTypes.join(',');
    }

    return this.ajax.request(`${this._exportURL}/entities?${new URLSearchParams(Object.entries(params)).toString()}`, {
      method: 'GET',
      headers: this._baseHeaders
    });
  },

  createEntity(data, callback) {
    let url = `${this._exportURL}/entities`;

    return this.ajax
      .request(url, {
        method: 'POST',
        contentType: 'application/json',
        headers: this._baseHeaders,
        data: JSON.stringify(data)
      })
      .then(callback);
  }
});
