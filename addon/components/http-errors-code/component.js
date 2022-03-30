import { getOwner } from '@ember/application';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  actions: {
    openSupportChannel() {
      const csChat = getOwner(this).lookup('service:cs-chat');

      if (csChat) {
        csChat.openTicket();
      }
    }
  }
});
