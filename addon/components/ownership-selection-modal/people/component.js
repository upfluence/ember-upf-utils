import Component from '@ember/component';
import layout from './template';
import { observer } from '@ember/object';
import { empty } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  currentUser: service(),

  userId: null,
  selectedUsers: [],

  noSelectedUsers: empty('selectedUsers'),

  availableUsers: [],
  items: [],

  init() {
    this._super(...arguments);

    this.currentUser.fetch().then(({ user }) => {
      const currentUserID = user.id;

      return this.currentUser.fetchColleagues().then(({ users }) => {
        let coworkers = users.filter((user) => {
          return user.active && user.id !== currentUserID
        });

        this.set('availableUsers', coworkers);
        this.set('items', coworkers);

        this.get('currentUser').fetchOwnerships().then((ownerships) => {
          if (!this.entity.ownedBy.startsWith('composite:')) return;

          this._fetchSelectedUsers(ownerships);
        });
      });
    });
  },

  _: observer('searchTerm', function() {
    if (isEmpty(this.searchTerm)) {
      this.set('items', this.availableUsers);
    }

    let searchTerm = this.searchTerm.toLowerCase();

    this.set('items', this.availableUsers.filter((u) => {
      const { first_name, last_name, email } = u;

      return email.toLowerCase().includes(searchTerm)
        || (first_name || '').toLowerCase().includes(searchTerm)
        || (last_name || '').toLowerCase().includes(searchTerm);
    }))
  }),

  _reloadSelected: observer('entity.id', function() {
    this.get('currentUser').fetchOwnerships().then((ownerships) => {
      this._fetchSelectedUsers(ownerships);
    });
  }),

  _setSelectedUsers(ownerships) {
    let currentOwnership = ownerships.findBy('id', this.entity.ownedBy);
    let selectedUsers;

    if (currentOwnership.userIds) {
      selectedUsers = this.availableUsers.filter((x) => {
        return currentOwnership.userIds.includes(x.id);
      });
    } else {
      selectedUsers = [];
    }
    
    this.set('selectedUsers', selectedUsers);
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
