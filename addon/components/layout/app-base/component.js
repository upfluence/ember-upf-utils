import { inject as service } from '@ember/service';
import Component from '@ember/component';
import User from '@upfluence/ember-upf-utils/types/user';
import layout from './template';

export default Component.extend({
  layout,

  currentUser: service(),
  user: null,
  applicationLogo: null,
  indexRoute: 'index',

  didInsertElement() {
    this._super();
    this.currentUser.fetch().then(
      ({ user, companies, account_subscriptions }) => {
        this.set('user', User.create(user));
        this.set('companies', companies);
        this.set('accountSubscriptions', account_subscriptions);

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
