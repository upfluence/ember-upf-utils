import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  actions: {
    openIntercom() {
      if (window.Intercom) {
        window.Intercom('showNewMessage');
      }
    }
  }
});
