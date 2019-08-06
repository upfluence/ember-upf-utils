import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  actions: {
    updateOwnership() {
      this.saveOwnership(composite.ownership)
    }
  }
});
