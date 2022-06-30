import Component from '@ember/component';

export default Component.extend({
  updatingOwnership: false,

  actions: {
    updateOwnership() {
      this.set('updatingOwnership', true);
      this.saveOwnership(this.entity.ownedBy).finally(() => {
        if (!this.isDestroying || !this.isDestroyed) {
          this.set('updatingOwnership', false);
        }
      });
    }
  }
});
