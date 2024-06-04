import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import type { IntlService } from 'ember-intl';

interface HTTPErrorsCodeArgs {
  httpError: '404' | '500' | 'default';
}

export default class extends Component<HTTPErrorsCodeArgs> {
  @service declare intl: IntlService;

  csChat?: any;

  self = location.href;

  constructor(owner: unknown, args: HTTPErrorsCodeArgs) {
    super(owner, args);

    // We have been dealing w/ a bad design here which is that CSChat is defined in ember-identity and not in
    // ember-upf-utils. It actually works because we are 100% sure that it will be present in the context of one of our
    // running apps.
    this.csChat = getOwner(this).lookup('service:cs-chat');
  }

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
  openSupportChannel(event: PointerEvent): void {
    event.stopPropagation();
    this.csChat?.openTicket(this.intl.t(`errors.${this.args.httpError}.support_message`));
  }
}
