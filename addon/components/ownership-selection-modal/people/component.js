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

  availableUsers: [],
  items: computed('searchTerm', function() {
    if (!this.searchTerm) return this.availableUsers;

    let searchTerm = this.searchTerm.toLowerCase();

    return this.availableUsers.filter((u) => {
      const { first_name, last_name, email } = u;

      return email.toLowerCase().includes(searchTerm)
        || (first_name || '').toLowerCase().includes(searchTerm)
        || (last_name || '').toLowerCase().includes(searchTerm);
    });
  }),

  init() {
    this._super(...arguments);

    this.currentUser.fetch().then(({ user }) => {
      const currentUserID = user.id;

      return this.currentUser.fetchColleagues().then(({ users }) => {
        this.set(
          'availableUsers',
          users.filter((user) => user.active && user.id !== currentUserID)

        )
      });
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
