import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  didReceiveAttrs() {
    this._super();
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
