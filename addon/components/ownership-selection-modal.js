import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  ownershipUpdater: service(),
  toast: service(),
  currentUser: service(),

  selectedUsers: null,

  _toastConfig: {
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: true,
    tapToDismiss: true
  },

  header: 'Share with',
  cta: 'Share',

  items: computed('searchTerm', function() {
    let members;

    return this.currentUser.fetchColleagues().then((res) => {
      members = res.users.filter((user) => { 
        return user.active;
      });

      return members.filter((user) => {
        const { firstName, lastName, email } = user;
        return email.includes(this.searchTerm) ||
        (firstName || '').includes(this.searchTerm) ||
        (lastName || '').includes(this.searchTerm);
      });
    });
  }),

  actions: {
    searchEntities(text) {
      this.set('searchTerm', text);
    },

    updateOwnership() {
      this.currentUser.createCompositeGroup(this.selectedUsers).then(() => {
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
      });
    }
  }
});
