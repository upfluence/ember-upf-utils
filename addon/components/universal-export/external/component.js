/* globals ga */
import Ember from 'ember';
import ExportEntity from 'ember-upf-utils/export-entity/model';
import layout from './template';

const {
  Component,
  computed,
  inject,
  observer
} = Ember;

export default Component.extend({
  layout,
  exports: inject.service(),
  store: inject.service(),
  current: null,

  _model: '',

  disabledExport: computed('current', 'selectedCount', function() {
    return !this.get('current') || !this.get('selectedCount');
  }),

  currentObserver: observer('current', function() {
    this.set('errors', null);
  }),

  didInsertElement() {
    this.get('exports').fetchEntities(this.get('_model'), (_items) => {
      this.set('items', _items.map((item) => {
        return new ExportEntity(item);
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
      _i.pushObject(item)
      this.set('items', _i);
    },

    submit(params, defer) {
      let item = params[0];
      // Object si pas object

      new Ember.RSVP.Promise((resolve, reject) => {
        if (item.get('isNew')) {
          return item.save().then((f) => {
            resolve(item.get('id'));
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
