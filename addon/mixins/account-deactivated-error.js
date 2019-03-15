import { getOwner } from '@ember/application';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  identityURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).identityURL;
  }),

  setupController(_, error) {
    if (error.errors && error.errors[0] && error.errors[0].code === 'on_hold') {
      window.location = `${this.identityURL}accounts/billing?status=on_hold`;
    }
  }
});
