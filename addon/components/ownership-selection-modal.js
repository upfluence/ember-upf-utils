import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed, defineProperty } from '@ember/object';

export default Component.extend({
  classNames: ['ownership-selection'],
  
  ownershipUpdater: service(),
  toast: service(),
  currentUser: service(),

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

  init() {
    this._super();

    this.set('currentWindow', 'groups');

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
      this.set('currentWindow', tab);
    },

    performCloseModal() {
      this.sendAction('closeModal');
      this.get('toast').success(
        this.get('successfulSharing'),
        'Sharing Success',
        this._toastConfig
      );
    },

    saveOwnership(newOwnership) {
      this.get('ownershipUpdater').update(
        this.get('modelType'),
        this.get('model.id'),
        newOwnership
      ).then(() => {
        this.send('performCloseModal');
      });
    }
  }
});
