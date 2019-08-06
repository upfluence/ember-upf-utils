import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  actions: {
    updateOwnership(_, defer) {
      this.saveOwnership(this.entity.ownedBy).finally(() => {
        defer.resolve();
      })
    }
  }
});
