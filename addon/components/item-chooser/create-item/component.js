import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,

  classNames: ['ember-basic-dropdown-content__create-item'],
  createButtonTextTemplate: '',

  formattedCreateButtonText: computed('searchTerm', function() {
    return this.createButtonTextTemplate.replace('#item#', this.searchTerm);
  }),

  actions: {
    createItem(_, defer) {
      defer.promise.then(() => this.select.actions.close());

      this.createItem(_, defer);
    }
  }
});
