import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,

  currentUser: service(),

  userId: null,

  items: computed('searchTerm', function() {
    let members;

    return this.currentUser.fetchColleagues().then(({ users }) => {
      members = users.filter((user) => { 
        return user.active && (user.id !== this.userId);
      });

      return members.filter((user) => {
        const { first_name, last_name, email } = user;
        return email.includes(this.searchTerm) ||
        (first_name || '').includes(this.searchTerm) ||
        (last_name || '').includes(this.searchTerm);
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
        this.saveOwnership(composite.ownership).finally(() => {
          defer.resolve();
        })
      }).finally(() => {
        defer.resolve();
      });
    }
  }
});
