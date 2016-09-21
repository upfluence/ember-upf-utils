import Ember from 'ember';
import layout from '../templates/components/login-form-2';

export default Ember.Component.extend({
  layout,
  classNames: ['login-form-2'],

  authAction: 'authenticate',
  error: null,

  actions: {
    authenticate(login, password) {
      this.sendAction('authAction', login, password);
    }
  }
});
