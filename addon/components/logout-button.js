import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['navbar-form', 'navbar-right'],
  session: service(),

  actions: {
    logout() {
      this.session.invalidate();
    }
  }
});
