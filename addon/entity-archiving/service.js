import Ember from 'ember';

const {
  Service,
  inject
} = Ember;

export default Service.extend({
  ajax: inject.service(),
  store: inject.service(),

  _perform(method, endpoint, data) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('ajax').request(endpoint, {
        method: method,
        contentType: 'application/json',
        data: JSON.stringify(data)
      }).then((payload) => {
        this.get('store').pushPayload(payload);
        resolve();
      }).catch((e) => reject(e));
    });
  },

  bulkToggleArchive(entityName, entitiesIds, archivalAction) {
    let params = { archival_action: archivalAction };
    params[`${entityName}`] = entitiesIds;
    return this._perform('PUT', `/${entityName}/bulk-toggle-archive`, params);
  }
});
