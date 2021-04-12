import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
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
