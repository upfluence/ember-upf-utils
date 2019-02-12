import Component from '@ember/component';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import layout from './template';

export default Component.extend({
  layout,

  classNames: ['item-chooser'],

  // Options
  placeholder: 'Pick an item',
  recordType: null,
  createOptionPlaceholder: '#item#',
  multiple: false,
  canCreate: false,
  didCreate: 'defaultCreate',
  optionValuePath: null,
  optionLabelPath: 'name',
  sortField: 'name', // TODO: Rename this to searchField
  onBlur: null,
  recordTypeIsModel: false,
  disabled: false,
  searchTerm: null,

  didReceiveAttrs() {
    if (this.get('canCreate') && this.get('recordTypeIsModel') && this.get('recordType') === null) {
      throw new Error('[component][item-chooser] Please provide a recordType');
    }
  },

  createItemComponent: computed('canCreate', 'searchTerm', function() {
    if (this.get('canCreate') && !isBlank(this.get('searchTerm'))) {
      return 'item-chooser/create-item';
    }

    return null;
  }),

  actions: {
    updateSearchTerm(term) {
      this.set('searchTerm', term);
    },

    defaultCreate() {
      //default action
    }
  }
});
