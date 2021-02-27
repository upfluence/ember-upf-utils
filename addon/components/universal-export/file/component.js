/*globals ga*/
import { inject as service } from '@ember/service';

import { gt } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

const Limit = function(limit, spent) {
  return {
    spent,
    limit,
    left: computed(function() {
      return limit - spent;
    })
  };
};

export default Component.extend({
  layout,
  exports: service(),
  currentUser: service(),
  store: service(),

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

    if (this.enableOverlapFileExport) {
      if (!this.types.findBy('key', 'overlap')) {
        this.types.pushObject({ key: 'overlap', label: 'Overlap' });
      }
    }

    if (this.enableFullFileExport) {
      if (!this.types.findBy('key', 'full')) {
        this.types.pushObject({ key: 'full', label: 'All' });
      }

      this.exports.getLimit((r) => {
        this.set('exportLimit.full', new Limit(r.limit, r.spent));
        this.set('loaded', true);
      });
    } else {
      this.set('loaded', true);
    }
  },

  hasMultiType: gt('types.length', 1),

  limitReached: computed(
    'selectedType',
    'exportLimit.@each.spent',
    'selectedCount',
    function() {
      let limitPath = `exportLimit.${this.selectedType}.limit`;
      let spentPath = `exportLimit.${this.selectedType}.spent`;

      if (this.get(limitPath) === -1) {
        return false;
      }

      return (this.get(spentPath) + this.selectedCount) > this.get(limitPath);
    }
  ),

  btnLocked: computed('loaded', 'limitReached', function() {
    return !this.loaded || this.limitReached;
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
        actionContext: [this.selectedFormat, this.selectedType]
      });
    }
  }
});
