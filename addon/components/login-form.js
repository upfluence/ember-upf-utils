import Ember from 'ember';
import layout from '../templates/components/login-form';
import { UnauthenticatedRouteMixin } from '../mixins/auth';


export default Ember.Component.extend(UnauthenticatedRouteMixin, {
  layout,
  session: Ember.inject.service('session'),

  actions: {
    authenticate() {
      let { identification, password } = this.get('controller').getProperties(
        'identification', 'password'
      );
      this.get('session').authenticate(
        'authenticator:oauth2',
        identification,
        password,
        Ember.getOwner(this).resolveRegistration('config:environment').scope
      ).catch((reason) => {
        let message = reason ? reason.error_description : 'Unknown error. Try again later or contact an administrator';
        this.get('controller').set('errorMessage', message);
      });
    }
  }
});
