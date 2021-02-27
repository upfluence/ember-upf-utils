import { inject as service } from '@ember/service';

import Component from '@ember/component';
import RSVP from 'rsvp';
import { observer, computed } from '@ember/object';
import ExportEntity from '@upfluence/ember-upf-utils/export-entity/model';
import layout from './template';

export default Component.extend({
  layout,
  exports: service(),
  store: service(),

  current: null,
  _canCreate: true,

  placeholder: 'Move to...',

  disabledExport: computed('current', 'selectedCount', function() {
    return !this.current || !this.selectedCount;
  }),

  currentObserver: observer('current', function() {
    this.set('errors', null);
  }),

  actions: {
    submit(params, defer) {
      let [ item ] = params;

      new RSVP.Promise((resolve) => {
        if (!item.get('id')) {
          let data = {
            type: item.type,
            name: item.name
          };

          return this.exports.createEntity(data, (response) => {
            item.set('id', response.entity.id);
            resolve(item);
          });
        } else {
          resolve(item);
        }
      }).then((item) => {
        this.performExport(`${item.type}:${item.id}`, defer);
      });
    }
  }
});
