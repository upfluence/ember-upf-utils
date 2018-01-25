import Ember from 'ember';

const {
  Mixin
} = Ember;

export default Mixin.create({
  hiddenOwnershipUpdateModal: true,
  ownershipModalItem: null,

  actions: {
    toggleOwnershipModal(item) {
      this.toggleProperty('hiddenOwnershipUpdateModal');
      this.set('ownershipModalItem', item);
    }
  }
});
