import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  ownershipUpdater: service(),
  toast: service(),

  selectedUser: null,

  _toastConfig: {
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: true,
    tapToDismiss: true
  },

  header: 'Share with',
  cta: 'Share',

  items: computed('searchTerm', function() {
    // const nonMembers = this.store.peekAll('user').filter((user) => {
    //   return !user.teams.any((t) => t.id === this.model.get('id'));
    // });

    // if (isEmpty(this.searchTerm)) {
    //   return nonMembers;
    // }

    // return nonMembers.filter((user) => {
    //   const { firstName, lastName, email } = user;
    //   return email.includes(this.searchTerm) ||
    //   (firstName || '').includes(this.searchTerm) ||
    //   (lastName || '').includes(this.searchTerm);
    // });

    return [
      { firstName: 'test', lastName: 'test', email: 'test@gmail.com' }
    ]
  }),

  actions: {
    searchEntities(text) {
      this.set('searchTerm', text);
    },

    updateOwnership() {
      this.get('ownershipUpdater').update(
        this.get('modelType'),
        this.get('model.id'),
        this.get('model.ownedBy')
      ).then(() => {
        this.sendAction('closeModal');
        this.get('toast').success(
          this.get('successfulSharing'),
          'Sharing Success',
          this._toastConfig
        );
      });
    }
  }
});
