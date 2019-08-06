import Component from '@ember/component';
import layout from './template';
import { notEmpty } from '@ember/object/computed';

export default Component.extend({
  layout,

  ownership: null,

  hasSelectedGroup: notEmpty('ownership'),

  actions: {
    updateOwnership(_, defer) {
      this.saveOwnership(this.entity.ownedBy).finally(() => {
        defer.resolve();
      })
    }
  }
});
