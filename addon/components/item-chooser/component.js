import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['item-chooser'],

  // Options
  placeholder: 'Pick an item',
  recordType: null,
  createOptionPlaceholder: '<strong>#item#</strong>',
  multiple: false,
  canCreate: false,
  saveNewItem: false,
  optionValuePath: 'content',
  optionLabelPath: 'content.name',
  sortField: 'name',
  onBlur: null,

  store: Ember.inject.service(),

  didReceiveAttrs() {
    if (this.get('recordType') === null) {
      throw new Error('[component][item-chooser] Please provide a recordType');
    }
  },

  createFunctionName: Ember.computed('canCreate', 'recordType', function() {
    return this.get('canCreate') && this.get('recordType') ? 'create' : null;
  }),

  actions: {
    create(itemName) {
      if (Ember.isBlank(itemName)) {
        return;
      }

      let item = this.get('store').createRecord(this.get('recordType'), {
        name: itemName
      });

      if (this.get('multiple')) {
        this.get('selection').pushObject(item);
      } else {
        this.set('selection', item);
        this.$('input').blur();
      }

      if (this.get('saveNewItem')) {
        item.save();
      }
    },

    optionCreate(value, escape) {
      let compiled = this.get('createOptionPlaceholder')
        .replace('#item#', escape(value.input));
      return `<div class="create">${compiled}</div>`;
    }
  }
});
