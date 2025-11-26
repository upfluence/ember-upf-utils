import { action } from '@ember/object';
import { assert } from '@ember/debug';
import { scheduleOnce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

interface UtilsSocialMediaHandleArgs {
  socialNetwork: string;
  handle: string;
  errorMessage?: string;
  selectorOnly?: boolean;
  onChange(socialNetwork: string, handle: string, formattedUrl: string): void;
}

type SocialNetworkData = {
  name: string;
  formattedUrl: string;
};

export const SOCIAL_MEDIA_NETWORKS: SocialNetworkData[] = [
  { name: 'instagram', formattedUrl: 'https://www.instagram.com/{handle}' },
  { name: 'twitter', formattedUrl: 'https://x.com/{handle}' },
  { name: 'tiktok', formattedUrl: 'https://www.tiktok.com/@{handle}' },
  { name: 'twitch', formattedUrl: 'https://www.twitch.tv/{handle}' },
  { name: 'youtube', formattedUrl: 'https://www.youtube.com/user/{handle}' }
];
const SOCIAL_MEDIA_ICONS: Record<string, string> = {
  instagram: 'fa-instagram',
  twitter: 'fa-x-twitter',
  tiktok: 'fa-tiktok',
  twitch: 'fa-twitch',
  youtube: 'fa-youtube'
};

export default class UtilsSocialMediaHandle extends Component<UtilsSocialMediaHandleArgs> {
  @tracked selectorShown: boolean = false;
  @tracked selectedNetwork: SocialNetworkData = SOCIAL_MEDIA_NETWORKS[0];
  @tracked handle: string = '';

  socialMediaNetworks: SocialNetworkData[] = SOCIAL_MEDIA_NETWORKS;
  socialMediaIcons: Record<string, string> = SOCIAL_MEDIA_ICONS;

  constructor(owner: unknown, args: UtilsSocialMediaHandleArgs) {
    super(owner, args);

    assert('[Utils::SocialMediaHandle] The @onChange parameter is mandatory', typeof args.onChange === 'function');

    scheduleOnce('afterRender', this, this._initArguments);
  }

  @action
  toggleSelector(e: PointerEvent): void {
    e?.stopPropagation();
    this.selectorShown = !this.selectorShown;
  }

  @action
  hideSelector(): void {
    this.selectorShown = false;
  }

  @action
  onSelect(value: SocialNetworkData): void {
    this.selectedNetwork = value;
    this.handle = this._cleanHandleFormatting(this.handle);
    this.hideSelector();
    this._reformatInput();
    this._notifyChanges();
  }

  @action
  checkEnterKey(event: KeyboardEvent): void {
    if (event && event.key === 'Enter') {
      this._reformatInput();
      this._notifyChanges();
    }
  }

  @action
  onBlur(): void {
    this._reformatInput();
    this._notifyChanges();
  }

  private _notifyChanges(): void {
    this.args.onChange(this.selectedNetwork.name, this._cleanHandleFormatting(this.handle), this.handle);
  }

  private _initArguments(): void {
    this.selectedNetwork =
      SOCIAL_MEDIA_NETWORKS.find((network) => this.args.socialNetwork === network.name) || SOCIAL_MEDIA_NETWORKS[0];
    if (this.args.handle) {
      this.handle = this.args.handle;
      this._reformatInput();
      this._notifyChanges();
    }
  }

  private _cleanHandleFormatting(handle: string): string {
    handle = handle.endsWith('/') ? handle.slice(0, -1) : handle;
    let urlSplit = handle.split('/');
    return urlSplit.pop()?.replace('@', '') || '';
  }

  private _reformatInput(): any {
    if (!this.handle) return;
    if (!this._isUrlValid(this.handle)) {
      this.handle = this.handle.replace('@', '');
      this.handle = this.selectedNetwork.formattedUrl.replace('{handle}', this.handle);
    } else {
      this._cleanUrl();
    }
  }

  private _cleanUrl(): void {
    this.handle = this.handle.split('?')[0];
    this.handle = this.handle.endsWith('/') ? this.handle.slice(0, -1) : this.handle;
  }

  private _isUrlValid(url: string): boolean {
    const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
    return url.match(urlRegex) !== null;
  }
}
