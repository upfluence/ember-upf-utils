import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import Configuration from '@upfluence/ember-upf-utils/configuration';
import StoreService from '@ember-data/store';

export default class ExportsService extends Service {
  @service declare store: StoreService;
  @service declare session: any;
  @service declare communityThresholdManager: any;

  get _exportURL(): string {
    return `${Configuration.exportUrl}/api/v1`;
  }

  get _baseHeaders(): Headers {
    return new Headers({
      Authorization: `Bearer ${this.accessToken}`
    });
  }

  get accessToken(): string {
    return this.session.data.authenticated.access_token;
  }

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
  perform(source: unknown, destination: unknown): Promise<any> {
    return fetch(`${this._exportURL}/export`, {
      method: 'POST',
      headers: this._baseHeaders,
      body: JSON.stringify({ source, destination })
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((payload) => {
          this.communityThresholdManager.processException(payload);
          return Promise.reject(payload);
        });
      }
      return response.json();
    });
  }

  exportToEntities(
    exportingFrom: any,
    exportingTo: any,
    influencerIds: any[],
    filters: any[],
    maxSize: number,
    tags: string[]
  ): Promise<any> {
    let payload: any = { destination: { to: exportingTo } };

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

    const headers = new Headers(this._baseHeaders);
    headers.append('Content-Type', 'application/json');
    return fetch(`${this._exportURL}/export`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    }).then((response) => {
      if (!response.ok) {
        return Promise.reject();
      }
      return response.json();
    });
  }

  getFileExportURL(
    from: string,
    fileFormat: string,
    fileType: string,
    influencerIds: string[],
    filters: any[]
  ): string {
    const filterParams = new URLSearchParams();
    filters.forEach((filter) => {
      filterParams.append('filters[]', filter);
    });

    const baseUrl = `${this._exportURL}/export/file`;
    const params = [
      'from=' + from,
      'influencer_ids=' + influencerIds.join(','),
      'format=' + fileFormat,
      'type=' + fileType,
      filterParams.toString(),
      'access_token=' + encodeURIComponent(this.accessToken)
    ];

    return baseUrl + '?' + params.join('&');
  }

  /*
   ** Get the export limit of a user as a JSON :
   ** {
   **    limit: // Total available
   **    spent: // Total left
   ** }
   */
  getLimit(callback: (response: any) => void): Promise<void> {
    return fetch(`${this._exportURL}/export/file/limit`, { headers: this._baseHeaders, method: 'GET' }).then(
      (response) => {
        if (!response.ok) {
          return Promise.reject();
        }
        return response.json().then((data: { limit: number; spent: number }) => {
          return callback(data);
        });
      }
    );
  }

  getAvailableExports(): Promise<any> {
    return fetch(`${this._exportURL}/discovery`, { headers: this._baseHeaders, method: 'GET' }).then((response) => {
      if (!response.ok) {
        return Promise.reject();
      }
      return response.json();
    });
  }

  fetchEntities(type: string, callback: (response: any) => void): Promise<any> {
    return fetch(`${this._exportURL}/entities/${type}`, { method: 'GET', headers: this._baseHeaders }).then(
      (response) => {
        if (!response.ok) {
          return Promise.reject();
        }
        return response.json().then((data) => {
          return callback(data);
        });
      }
    );
  }

  searchEntities(keyword: string, entityTypes: string[] = []): Promise<any> {
    const params: { s: string; entity_types?: string } = {
      s: keyword
    };

    if (entityTypes.length > 0) {
      params['entity_types'] = entityTypes.join(',');
    }

    return fetch(`${this._exportURL}/entities?${new URLSearchParams(Object.entries(params)).toString()}`, {
      method: 'GET',
      headers: this._baseHeaders
    }).then((response) => {
      if (!response.ok) {
        return Promise.reject();
      }
      return response.json();
    });
  }

  createEntity(data: Object, callback: (response: any) => void): Promise<any> {
    let url = `${this._exportURL}/entities`;
    const headers = new Headers(this._baseHeaders);
    headers.append('Content-Type', 'application/json');
    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    }).then((response) => {
      if (!response.ok) {
        return Promise.reject();
      }

      return response.json().then((entity) => {
        return callback(entity);
      });
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    exports: ExportsService;
  }
}
