import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

const OWNERSHIP_ENTITY_TYPES = {
  stream: 'a Social Listening Stream',
  mailing: 'a Mailing Campaign',
  campaign: 'a Workflow Campaign',
  list: 'an Influencer List'
};

export default Component.extend({
  layout,

  ownershipEntityType: computed('modelType', function() {
    return OWNERSHIP_ENTITY_TYPES[this.modelType];
  }),

  didReceiveAttrs() {
    if (this.entity) {
      this.set('ownership', { id: this.entity.id, name: this.entity.name });
    }
  },

  actions: {
    updateOwnership(_, defer) {
      this.saveOwnership(this.ownership.id).finally(defer.resolve);
    }
  }
});
