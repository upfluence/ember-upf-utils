import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import { GLOBAL_SUPPORT_LINK } from '@upfluence/ember-upf-utils/resources/helpdesk-links';

interface HTTPErrorsCodeArgs {
  httpError: '404' | '500';
}

export default class extends Component<HTTPErrorsCodeArgs> {
  @service declare intl: any;

  globalSupportLink = GLOBAL_SUPPORT_LINK;

  get errorHints(): { icon: string; label: string }[] {
    if (this.args.httpError === '404') {
      return [
        { icon: 'fa-unlink', label: this.intl.t('errors.404.hints.url_accuracy_check') },
        { icon: 'fa-key', label: this.intl.t('errors.404.hints.authorization_check') }
      ];
    }

    return [
      { icon: 'fa-bug', label: this.intl.t('errors.500.hints.technical_issue') },
      { icon: 'fa-life-ring', label: this.intl.t('errors.500.hints.contact_support') }
    ];
  }

  @action
  refreshPage(event: PointerEvent): void {
    event.stopPropagation();
    window.location.reload();
  }

  @action
  openSupportChannel() {
    const csChat = getOwner(this).lookup('service:cs-chat');

    if (csChat) {
      csChat.openTicket();
    }
  }
}
