/*globals ga*/
import Ember from 'ember';
import layout from './template';

const { Component, computed, inject, isBlank } = Ember;

export default Component.extend({
  layout,
  exports: inject.service(),

  disabledExport: computed('currentList', function() {
    return isBlank(this.get('currentList'));
  }),

  items: computed(function() {
    return this.get('exports').fetchEntities('list', (items) => {
      return items;
    });
  }),

  actions: {
    closeModal() {
      ga('send', 'event', 'Header', 'Submit', 'Cancel');
      this.sendAction('closeModal');
    },

    submit(params, defer) {
      let list = params[0];

      this.triggerAction({
        action: 'performExport',
        actionContext: [`list:${list.id}`, defer]
      });
    }
  }
});
