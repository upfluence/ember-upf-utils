import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface UtilsUtmLinkBuilderArgs {
  url: string;
  onChange(url: string, utmsEnabled: boolean, formValid: boolean, utmFields: UTM_FIELDS): void;
}

type UTM_FIELDS = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

export default class UtilsUtmLinkBuilder extends Component<UtilsUtmLinkBuilderArgs> {
  @tracked utmsEnabled: boolean = false;
  @tracked utmSource: string = '';
  @tracked utmMedium: string = '';
  @tracked utmCampaign: string = '';

  get utmsValid(): boolean {
    return !!this.utmSource && !!this.utmMedium && !!this.utmCampaign;
  }

  @action
  toggleSwitchUpdate(newValue: boolean): void {
    this.utmsEnabled = newValue;
    if (!newValue) {
      this.utmCampaign = '';
      this.utmMedium = '';
      this.utmSource = '';
    }
    this.notifyChanges();
  }

  @action
  notifyChanges(target?: string): void {
    // @ts-ignore
    if (target) this[target] = this[target].replaceAll(' ', '+');
    this.args.onChange(this.previewUrl, this.utmsEnabled, this.utmsValid, this.utmFields);
  }

  get utmFields(): UTM_FIELDS {
    return {
      utm_campaign: this.utmCampaign,
      utm_medium: this.utmMedium,
      utm_source: this.utmSource
    };
  }

  get previewUrl(): string {
    return `${this.fieldUrl}?utm_source=${this.fieldSource}&utm_medium=${this.fieldMedium}&utm_campaign=${this.fieldCampaign}`;
  }

  get fieldUrl(): string {
    return this.args.url || '{link_url}';
  }

  get fieldSource(): string {
    return this.utmSource || '{source_field}';
  }

  get fieldMedium(): string {
    return this.utmMedium || '{medium_field}';
  }

  get fieldCampaign(): string {
    return this.utmCampaign || '{campaign_field}';
  }
}
