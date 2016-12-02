import Ember from 'ember';

export default Ember.Mixin.create({
  session: Ember.inject.service(),

  actions: {
    authenticate(email, password) {
      return this.get('session').authenticate(
        'authenticator:oauth2',
        email,
        password,
        this.get('scope')
      ).catch(e => this.set('controller.error', e.error_description));
    }
  }
});
