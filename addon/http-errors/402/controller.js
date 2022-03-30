import { getOwner } from '@ember/application';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HttpErrors402Controller extends Controller {
  @service intl;

  @action
  openSupportChannel() {
    const csChat = getOwner(this).lookup('service:cs-chat');

    if (csChat) {
      csChat.openTicket(this.intl.t('errors.402.limit_exceeded.email_data.body'));
      this.goBack();
    }
  }

  @action
  goBack() {
    this.transitionToRoute('lists');
  }
}
