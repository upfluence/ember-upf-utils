import { getOwner } from '@ember/application';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Router } from '@ember/routing';
import { inject as service } from '@ember/service';
import { SafeString } from '@ember/template/-private/handlebars';
import { tracked } from '@glimmer/tracking';
import { IntlService } from 'ember-intl';

interface UpgradeModalArgs {
  hidden: boolean;
  to?: string;
  closeAction(): void;
}

export default class UpgradeModal extends Component<UpgradeModalArgs> {
  @service declare assetMap: any;
  @service declare intl: IntlService;
  @service declare currentUser: any;
  @service declare router: Router;

  @tracked hasSubscription: boolean = false;

  constructor(owner: unknown, args: UpgradeModalArgs) {
    super(owner, args);

    this.currentUser.fetch().then(({ account_subscriptions }: { account_subscriptions: any[] }) => {
      this.hasSubscription = (account_subscriptions || []).length > 0;
    });
  }

  get description(): ReturnType<IntlService['t']> {
    let intlKey = 'default';

    if (['monitor', 'bulk_emailing'].includes(this.args.to ?? '')) {
      intlKey = this.args.to!;
    }

    return this.intl.t(`upgrade_modal.details.${intlKey}`, { htmlSafe: true });
  }

  get canSelfUpgrade(): boolean {
    return this.hasSubscription && this.args.to !== 'crm';
  }

  get cta(): string {
    let intlKey = this.canSelfUpgrade ? 'upgrade' : 'contact';

    return this.intl.t(`upgrade_modal.cta.${intlKey}`);
  }

  @action
  clickedCTA(): void {
    const csChat = getOwner(this).lookup('service:cs-chat');

    if (this.canSelfUpgrade) {
      this.router.transitionTo('settings.accounts.billing');
    } else if (csChat) {
      csChat.openTicket();
    }
  }
}
