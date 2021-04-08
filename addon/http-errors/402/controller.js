import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HttpErrors402Controller extends Controller {
  @service intl;

  @action
  openIntercom() {
    if (window.Intercom) {
      const messageContent = this.intl.t('search.errors.limit_exceeded.email_data.body');

      window.Intercom('showNewMessage', messageContent);
      this.send('goBack');
    }
  }

  @action
  goBack() {
    this.transitionToRoute('lists');
  }
}
