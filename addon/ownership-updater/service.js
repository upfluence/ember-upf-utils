import Ember from 'ember';

const { Service, String, inject } = Ember;

export default Service.extend({
  ajax: inject.service(),

  update(model, modelId, ownedBy) {
    let payload = {};
    payload[`${model}`] = { owned_by: ownedBy };

    return this.get('ajax').request(`/${String.pluralize(model)}/${modelId}`, {
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(payload)
    });
  }
});
