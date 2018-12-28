import Mixin from '@ember/object/mixin';

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
