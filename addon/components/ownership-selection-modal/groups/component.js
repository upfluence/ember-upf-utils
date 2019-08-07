import Component from '@ember/component';
import layout from './template';
import { empty, alias } from '@ember/object/computed';

export default Component.extend({
  layout,

  ownership: null,

  noSelectedGroup: empty('ownership'),

  actions: {
    updateOwnership(_, defer) {
      this.saveOwnership(this.entity.ownedBy).finally(defer.resolve);
    }
  }
});
