import Ember from 'ember';
import layout from './template';

const { Component, inject } = Ember;

export default Component.extend({
  layout,

  currentUser: inject.service(),
  user: null,
  applicationLogo: null,
  indexRoute: 'index',

  didInsertElement() {
    this._super();
    this.get('currentUser').fetch().then(
      ({ user, companies }) => {
        this.set('user', Ember.Object.create(user));
        this.set('companies', companies);

        if (user.extra && user.extra.company_logo) {
          this.set('applicationLogo', user.extra.company_logo);
        }
      },
      () => {
        // Maybe logout ?
      }
    );
  }
});
