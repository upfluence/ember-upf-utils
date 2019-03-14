import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  hidden: true,
  to: null,

  actions: {
    goToBilling() {
      window.location = `https://user.upfluence.co/accounts/billing`;
    },

    openIntercom() {
      if (window.Intercom) {
        window.Intercom('show');
      }
    }
  }
});
