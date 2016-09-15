import Ember from 'ember';
import layout from '../templates/components/login-form';

export default Ember.Component.extend({
  layout,
  session: Ember.inject.service('session'),

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties(
        'identification', 'password'
      );
      this.get('session').authenticate(
        'authenticator:oauth2',
        identification,
        password,
        Ember.getOwner(this).resolveRegistration('config:environment').scope
      ).catch((reason) => {
        let message = reason ? reason.error_description : 'Unknown error. Try again later or contact an administrator';
        this.set('errorMessage', message);
      });
    }
  }
});
