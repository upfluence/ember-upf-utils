import Service, { inject as service } from '@ember/service';
import { pluralize } from 'ember-inflector';

export default Service.extend({
  store: service(),

  update(model, modelId, ownedBy) {
    let adapter = this.store.adapterFor(model);

    let payload = {};
    payload[model] = { owned_by: ownedBy };

    return adapter.ajax(
      `${adapter.host}/${adapter.namespace}/${pluralize(model)}/${modelId}`,
      'PUT',
      {
        contentType: 'application/json',
        data: payload
      }
    );
  }
});
