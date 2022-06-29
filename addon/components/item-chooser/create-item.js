import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['ember-basic-dropdown-content__create-item'],
  classNameBindings: ['hidden'],
  createButtonTextTemplate: '',
  publicApi: null,

  hidden: computed('publicApi.resultsCount', function () {
    return !this.publicApi || this.publicApi.resultsCount > 0;
  }),

  formattedCreateButtonText: computed('createButtonTextTemplate', 'publicApi.searchText', 'searchTerm', function () {
    return this.createButtonTextTemplate.replace('#item#', (this.publicApi || {}).searchText);
  }),

  actions: {
    createItem() {
      this.select.actions.close();
      this.createItem({});
    }
  }
});
