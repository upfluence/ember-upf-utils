import Component from '@ember/component';
import { empty } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import layout from './template';

export default Component.extend({
  layout,

  currentUser: service(),

  classNames: ['padding-xx-sm'],

  createableEntities: [],
  selectedEntityType: null,

  noCreateableEntities: empty('createableEntities'),

  init() {
    this._super();
    this.currentUser.fetch().then(({ user }) => {
      let _ce = [];
      if (user.granted_scopes.includes('facade_web')) {
        _ce.push('list');
      }

      if (user.granted_scopes.includes('inbox_client')) {
        _ce.push('mailing');
      }

      if (user.granted_scopes.includes('analytics_web')) {
        _ce.push('stream');
      }

      this.set('createableEntities', _ce);
      this.set('selectedEntityType', _ce[0]);
    });
  },

  didRender() {
    this.$('.dropdown-toggle').dropdown();
  },

  actions: {
    selectEntityType(type) {
      this.set('selectedEntityType', type);
    },

    createItem(_, defer) {
      defer.promise.then(() => this.select.actions.close());

      this.createItem(
        _,
        { type: this.selectedEntityType },
        defer
      );
    }
  }
});
