import Component from '@ember/component';

export default Component.extend({
  updatingOwnership: false,
  shareDependents: true,

  actions: {
    updateOwnership() {
      this.set('updatingOwnership', true);
      this.saveOwnership(this.entity.ownedBy, this.displayDependentsSharing ? this.shareDependents : false).finally(
        () => {
          if (!this.isDestroying || !this.isDestroyed) {
            this.set('updatingOwnership', false);
          }
        }
      );
    },

    updateShareDependents(value) {
      this.set('shareDependents', value);
    }
  }
});
