import Ember from 'ember';
import layout from '../templates/components/logout-button';

export default Ember.Component.extend({
  layout,
  classNames: ['navbar-form', 'navbar-right'],

  session: Ember.inject.service(),

  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
