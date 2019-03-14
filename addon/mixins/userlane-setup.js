/* global Userlane */
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  currentUser: service(),

  beforeModel() {
    this._super(...arguments);
    this.currentUser.fetch().then(({ user, account_subscriptions }) => {
      let userlaneParams = {
        name: `${user.first_name} ${user.last_name}`,
        granted_scopes: user.granted_scopes
      };

      if ((account_subscriptions || []).length > 0) {
        Object.assign(userlaneParams, {
          plan: account_subscriptions[0].plan
        });
      }

      window.Userlane('init', 32757);
      Userlane('user', user.id);
      Userlane('identify', user.id, userlaneParams);
    });
  }
});
