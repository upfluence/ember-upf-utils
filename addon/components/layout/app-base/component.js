import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  currentUser: Ember.inject.service(),
  user: null,
  applicationLogo: null,
  indexRoute: 'index',

  didInsertElement() {
    this._super();
    this.get('currentUser').fetch().then(
      ({ user }) => {
        this.set('user', user);

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
