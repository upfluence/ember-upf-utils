import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['item-chooser'],

  // Options
  placeholder: 'Pick a list',
  recordType: 'list',
  createOptionPlaceholder: 'Create <strong>#item#</strong> list',
  multiple: false,
  canCreate: false,
  optionValuePath: "content",
  optionLabelPath: "content.name",

  onBlur: null,

  store: Ember.inject.service(),

  createFunctionName: Ember.computed('canCreate', 'recordType', function() {
    return this.get('canCreate') && this.get('recordType') ? 'create' : null;
  }),

  optionCreateFunction(value, escape) {
    const compiled = this.get('createOptionPlaceholder')
      .replace('#item#', escape(value.input));
    return `<div class="create">${compiled}</div>`;
  },

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
    }
  }
});
