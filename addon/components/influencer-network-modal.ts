import Component from '@glimmer/component';
import UPFLocalStorage from '@upfluence/oss-components/utils/upf-local-storage';
import { tracked } from '@glimmer/tracking';
import { GLOBAL_SUPPORT_LINK } from '@upfluence/ember-upf-utils/resources/helpdesk-links';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

const INFLUENCER_NETWORK_MODAL_COOKIE = 'upf_disable_influencer_modal';
const INFLUENCER_NETWORK_MODAL_STORAGE_KEY = 'disable_influencer_modal';

interface ComponentSignature {
  hideInfluencerNetworkModal: boolean;
  onClose(): void;
}

export default class extends Component<ComponentSignature> {
  @service declare currentUser: any;
  @tracked user: any = null;
  @tracked disableModal: boolean = false;

  localStorage = new UPFLocalStorage();

  constructor(owner: unknown, args: ComponentSignature) {
    super(owner, args);

    this.currentUser.fetch().then((user: any) => {
      this.user = user;
    });
  }

  get displayInfluencerNetworkModal(): boolean {
    return (
      !this.hasDisabledInfluencerNetworkModal &&
      !this.args.hideInfluencerNetworkModal &&
      this.user?.companies?.[0]?.billing_format !== 'bracket'
    );
  }

  get hasDisabledInfluencerNetworkModal(): boolean {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(INFLUENCER_NETWORK_MODAL_COOKIE))
      ?.split('=')[1];

    return !!cookieValue || this.localStorage.getItem(INFLUENCER_NETWORK_MODAL_STORAGE_KEY) === 'true';
  }

  @action
  dontShowInfluencerNetworkModal(value: boolean): void {
    this.disableModal = value;
    this.localStorage.saveItem(INFLUENCER_NETWORK_MODAL_STORAGE_KEY, value ? 'true' : '');
  }

  @action
  openSupportLink(): void {
    window.open(GLOBAL_SUPPORT_LINK, '_blank');
  }
}
