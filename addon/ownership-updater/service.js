import Ember from 'ember';

const { Service, inject } = Ember;

export default Service.extend({
  ajax: inject.service(),

  update(model, modelId, ownedBy) {
    return this.get('ajax').request(`/${model}/${modelId}`, {
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        campaign: {
          owned_by: ownedBy
        }
      })
    });
  }
});
