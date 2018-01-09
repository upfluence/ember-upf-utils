/*globals ga*/
import Ember from 'ember';
import layout from './template';

const { Component, computed, inject } = Ember;

const Limit = function(limit, spent) {
  return {
    spent: spent,
    limit: limit,
    left: computed(function() {
      return limit - spent;
    })
  };
};

export default Component.extend({
  layout,
  exports: inject.service(),
  currentUser: inject.service(),
  store: inject.service(),

  selectedFormat: 'csv',
  selectedType: 'short',

  formats: {
    csv: '.csv',
    xlsx: '.xlsx'
  },

  types: [
    { key: 'short', label: 'Basic' }
  ],

  enableFullFile: false,

  didReceiveAttrs() {
    this._super(...arguments);

    this.set('loaded', false);
    this.set('exportLimit', {
      short: new Limit(-1, 0)
    });

    if (this.get('enableFullFileExport')) {
      if (!this.get('types').findBy('key', 'full')) {
        this.get('types').pushObject({ key: 'full', label: 'All' });
      }

      this.get('exports').getLimit((r) => {
        this.set('exportLimit.full', new Limit(r.limit, r.spent));
        this.set('loaded', true);
      });
    } else {
      this.set('loaded', true);
    }
  },

  hasMultiType: computed.gt('types.length', 1),

  limitReached: computed(
    'selectedType',
    'exportLimit.@each.spent',
    'selectedCount',
    function() {
      let limitPath = `exportLimit.${this.get('selectedType')}.limit`;
      let spentPath = `exportLimit.${this.get('selectedType')}.spent`;

      if (this.get(limitPath) === -1) {
        return false;
      }

      return (this.get(spentPath) + this.get('selectedCount')) > this.get(limitPath);
    }
  ),

  btnLocked: computed('loaded', 'limitReached', function() {
    return !this.get('loaded') || this.get('limitReached');
  }),

  actions: {
    closeModal() {
      ga('send', 'event', 'Header', 'Submit', 'Cancel');
      this.sendAction('closeModal');
    },

    formatChanged(format) {
      this.set('selectedFormat', format);
    },

    typeChanged(type) {
      this.set('selectedType', type);
    },

    submit() {
      this.triggerAction({
        action: 'performFileExport',
        actionContext: [this.get('selectedFormat'), this.get('selectedType')]
      });
    }
  }
});
