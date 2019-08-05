import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed, observer, defineProperty } from '@ember/object';

export default Component.extend({
  classNames: ['ownership-selection'],
  
  ownershipUpdater: service(),
  toast: service(),
  currentUser: service(),

  selectedUsers: null,
  ownership: null,

  _toastConfig: {
    timeOut: 0,
    extendedTimeOut: 0,
    closeButton: true,
    tapToDismiss: true
  },

  header: 'Share with',
  cta: 'Share',

  tabs: {
    people: true,
    groups: true
  },

  displayWarningMessage: false,

  init() {
    this._super();

    this.set('currentWindow', this.tabs.people ? 'people' : 'groups');

    ['people', 'groups'].forEach((e) => {
      defineProperty(
        this,
        `${e}Selected`,
        computed('currentWindow', function() {
          return this.get('currentWindow') === e;
        })
      );
    });
  },

  actions: {
    setCurrent(tab) {
      if ((this.selectedUsers && this.selectedUsers.length > 0) || this.ownership) {
        this.set('displayWarningMessage', true);
      } else {
        this.set('currentWindow', tab);
        if (this.displayWarningMessage) {
          this.set('displayWarningMessage', false);
        }
      }
    },

    performCloseModal() {
      this.sendAction('closeModal');
      this.get('toast').success(
        this.get('successfulSharing'),
        'Sharing Success',
        this._toastConfig
      );
    },

    updateOwnership() {
      if (this.selectedUsers && this.selectedUsers.length > 0) {
        this.currentUser.createCompositeGroup(this.selectedUsers).then(({ composite }) => {
            this.get('ownershipUpdater').update(
            this.get('modelType'),
            this.get('model.id'),
            composite.ownership
          ).then(() => {
            this.send('performCloseModal');
          });
        });
      } else {
        this.get('ownershipUpdater').update(
          this.get('modelType'),
          this.get('model.id'),
          this.get('model.ownedBy')
        ).then(() => {
          this.send('performCloseModal');
        });
      }
    }
  }
});
