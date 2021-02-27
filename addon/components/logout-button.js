import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/logout-button';

export default Component.extend({
  layout,
  classNames: ['navbar-form', 'navbar-right'],

  session: service(),

  actions: {
    logout() {
      this.session.invalidate();
    }
  }
});
