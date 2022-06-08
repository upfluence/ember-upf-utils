import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { GLOBAL_SUPPORT_LINK } from '@upfluence/ember-upf-utils/resources/helpdesk-links';
import layout from './template';

export default Component.extend({
  layout,
  globalSupportLink: GLOBAL_SUPPORT_LINK,

  actions: {
    openSupportChannel() {
      const csChat = getOwner(this).lookup('service:cs-chat');

      if (csChat) {
        csChat.openTicket();
      }
    }
  }
});
