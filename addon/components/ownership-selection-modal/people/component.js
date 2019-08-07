import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import { empty } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  currentUser: service(),

  userId: null,
  selectedUsers: [],

  noSelectedUsers: empty('selectedUsers'),

  items: computed('searchTerm', function() {
    return this.currentUser.fetchColleagues().then(({ users }) => {
      return users.filter((user) => { 
        if (user.active && (user.id !== this.userId)) {
          const { first_name, last_name, email } = user;
          return email.includes(this.searchTerm) ||
          (first_name || '').includes(this.searchTerm) ||
          (last_name || '').includes(this.searchTerm);
        }
      });
    });
  }),

  init() {
    this._super(...arguments);
    this.currentUser.fetch().then(({ user }) => {
      this.set('userId', user.id);
    });
  },

  actions: {
    searchEntities(text) {
      this.set('searchTerm', text);
    },

    updateOwnership(_, defer) {
      this.currentUser.createCompositeGroup(this.selectedUsers).then(({ composite }) => {
        this.saveOwnership(composite.ownership);
      }).finally(defer.resolve);
    }
  }
});
