import Service, { inject as service } from '@ember/service';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';

export default Service.extend({
  store: service(),

  update(model, modelId, ownedBy) {
    let adapter = this.store.adapterFor(model);
    let url = `${adapter.host}/${adapter.namespace}/${pluralize(model)}/${modelId}`;

    let payload = {};
    payload[underscore(model)] = { owned_by: ownedBy };

    if (adapter.ownershipUpdateUrl) {
      url = adapter.ownershipUpdateUrl(modelId);
    }

    return adapter.ajax(
      url,
      'PUT',
      {
        contentType: 'application/json',
        data: payload
      }
    );
  }
});
