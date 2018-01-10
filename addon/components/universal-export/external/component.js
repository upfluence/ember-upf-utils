/* globals ga */
import Ember from 'ember';
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

  items: computed('_model', function() {
    return this.get('exports').fetchEntities(this.get('_model'), (items) => {
      return items;
    });
  }),

  disabledExport: computed('current', 'selectedCount', function() {
    return !this.get('current') || !this.get('selectedCount');
  }),

  currentObserver: observer('current', function() {
    this.set('errors', null);
  }),

  actions: {
    closeModal() {
      ga('send', 'event', 'Header', 'Submit', 'Cancel');
      this.sendAction('closeModal');
    },

    submit(params, defer) {
      let item = params[0];

      this.triggerAction({
        action: 'performExport',
        actionContext: [`${this.get('_model')}:${item.id}`, defer]
      });
    }
  }
});
