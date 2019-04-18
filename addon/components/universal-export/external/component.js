/* globals ga */
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

  _model: '',
  _canCreate: true,

  disabledExport: computed('current', 'selectedCount', function() {
    return !this.get('current') || !this.get('selectedCount');
  }),

  currentObserver: observer('current', function() {
    this.set('errors', null);
  }),

  didInsertElement() {
    this.get('exports').fetchEntities(this.get('_model'), (response) => {
      this.set('items', response.entities.map((item) => {
        return ExportEntity.create(item);
      }));
    });
  },

  actions: {
    closeModal() {
      ga('send', 'event', 'Header', 'Submit', 'Cancel');
      this.sendAction('closeModal');
    },

    didCreateItem(item) {
      let _i = this.get('items');
      _i.pushObject(item);
      this.set('items', _i);
    },

    submit(params, defer) {
      let item = params[0];

      new RSVP.Promise((resolve) => {
        if (!item.get('id')) {
          let data = {
            type: this.get('_model'),
            name: item.get('name')
          };
          return this.get('exports').createEntity(data, (response) => {
            let element = this.get('items').find((e) => {
              return !e.get('id') && e.get('name') === response.entity.name;
            });

            if (element) {
              // Assign id to the model
              element.set('id', response.entity.id);
            }

            resolve(response.entity.id);
          });
        } else {
          resolve(item.get('id'));
        }
      }).then((id) => {
        this.triggerAction({
          action: 'performExport',
          actionContext: [`${this.get('_model')}:${id}`, defer]
        });
      });
    }
  }
});
