import Ember from 'ember';
import layout from './template';

const {
  Component,
  inject,
  computed,
  isBlank
} = Ember;

export default Component.extend({
  layout,

  store: inject.service(),
  classNames: ['item-chooser'],

  // Options
  placeholder: 'Pick an item',
  recordType: null,
  createOptionPlaceholder: '<strong>#item#</strong>',
  multiple: false,
  canCreate: false,
  didCreate: '',
  optionValuePath: 'content',
  optionLabelPath: 'content.name',
  sortField: 'name',
  onBlur: null,


  didReceiveAttrs() {
    if (this.get('canCreate') && this.get('recordType') === null) {
      throw new Error('[component][item-chooser] Please provide a recordType');
    }
  },

  createFunctionName: computed('canCreate', 'recordType', function() {
    return this.get('canCreate') && this.get('recordType') ? 'create' : null;
  }),

  actions: {
    create(itemName) {
      if (isBlank(itemName)) {
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

      if (this.get('didCreate')) {
        this.sendAction('didCreate', item);
      }
    },

    optionCreate(value, escape) {
      let compiled = this.get('createOptionPlaceholder')
        .replace('#item#', escape(value.input));
      return `<div class="create">${compiled}</div>`;
    }
  }
});
