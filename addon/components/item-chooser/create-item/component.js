import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,

  classNames: ['ember-basic-dropdown-content__create-item'],
  classNameBindings: ['hidden'],
  createButtonTextTemplate: '',
  publicApi: null,

  hidden: computed('publicApi.resultsCount', function() {
    return !this.publicApi || this.publicApi.resultsCount > 0;
  }),

  formattedCreateButtonText: computed('createButtonTextTemplate', 'publicApi.searchText', 'searchTerm', function() {
    return this.createButtonTextTemplate.replace('#item#', (this.publicApi || {}).searchText);
  }),

  actions: {
    createItem(_, defer) {
      defer.promise.then(() => this.select.actions.close());

      this.createItem(_, {}, defer);
    }
  }
});
