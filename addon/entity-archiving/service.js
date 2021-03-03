import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';

export default Service.extend({
  ajax: service(),
  store: service(),

  _perform(method, endpoint, data) {
    return new Promise((resolve, reject) => {
      this.ajax
        .request(endpoint, {
          method: method,
          contentType: 'application/json',
          data: JSON.stringify(data)
        })
        .then((payload) => {
          this.store.pushPayload(payload);
          resolve();
        })
        .catch((e) => reject(e));
    });
  },

  bulkToggleArchive(entityName, entitiesIds, archivalAction) {
    let params = { archival_action: archivalAction };
    params[`${entityName}`] = entitiesIds;
    return this._perform('PUT', `/${entityName}/bulk-toggle-archive`, params);
  }
});
