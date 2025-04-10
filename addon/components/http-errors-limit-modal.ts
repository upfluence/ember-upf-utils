import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import type { IntlService } from 'ember-intl';
import { Router } from '@ember/routing';

interface HTTPErrorsLimitModalArgs {
  limit: number;
  used: number;
}

export default class extends Component<HTTPErrorsLimitModalArgs> {
  @service declare intl: IntlService;
  @service declare router: Router;

  csChat?: any;

  constructor(owner: unknown, args: HTTPErrorsLimitModalArgs) {
    super(owner, args);

    // We have been dealing w/ a bad design here which is that CSChat is defined in ember-identity and not in
    // ember-upf-utils. It actually works because we are 100% sure that it will be present in the context of one of our
    // running apps.
    this.csChat = getOwner(this).lookup('service:cs-chat');
  }

  @action
  openSupportChannel(): void {
    if (this.csChat) {
      this.csChat.openTicket(this.intl.t('errors.402.limit_exceeded.email_data.body'));
      this.goBack();
    }
  }

  @action
  goBack(): void {
    this.router.transitionTo('facade.lists');
  }
}
