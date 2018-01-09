/* globals ga */
import Ember from 'ember';

const {
  Component,
  computed,
  inject,
  observer
} = Ember;

export default Component.extend({
  exports: inject.service(),
  store: inject.service(),
  current: null,

  _model: '',

  items: computed('_model', function() {
    return this.get('store').findAll(this.get('_model')).then((items) => {
      return items.rejectBy('archived');
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
      let itemModelName = item._internalModel.modelName;

      this.triggerAction({
        action: 'performExport',
        actionContext: [`${itemModelName}:${item.get('id')}`, defer]
      });
    }
  }
});
