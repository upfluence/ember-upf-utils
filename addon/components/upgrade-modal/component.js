import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';


export default Component.extend({
  layout,

  hidden: true,
  to: null,

  identityURL: computed(function() {
    return getOwner(this).resolveRegistration(
      'config:environment'
    ).identityURL;
  }),

  actions: {
    goToBilling() {
      window.location = `${this.identityURL}accounts/billing`;
    },

    openIntercom() {
      if (window.Intercom) {
        window.Intercom('show');
      }
    }
  }
});
