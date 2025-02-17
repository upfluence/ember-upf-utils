import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { IntlService } from 'ember-intl';

import { FeedbackMessage } from '@upfluence/oss-components/components/o-s-s/input-container';

export type UtmFields = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

interface UtilsUtmLinkBuilderArgs {
  url: string;
  title?: string;
  subtitle?: string;
  displayPreview?: boolean;
  onChange(url: string, utmsEnabled: boolean, formValid: boolean, utmFields: UtmFields): void;
}

export default class UtilsUtmLinkBuilder extends Component<UtilsUtmLinkBuilderArgs> {
  @service declare intl: IntlService;

  @tracked utmsEnabled: boolean = false;
  @tracked utmSource: string = '';
  @tracked utmMedium: string = '';
  @tracked utmCampaign: string = '';
  @tracked validationErrors: Record<string, FeedbackMessage> = {};

  get utmsValid(): boolean {
    return ![this.utmSource, this.utmMedium, this.utmCampaign].some((field) => isBlank(field));
  }

  get title(): string {
    return this.args.title ?? this.intl.t('utms.title');
  }

  get subtitle(): string {
    return this.args.subtitle ?? this.intl.t('utms.description');
  }

  get displayPreview(): boolean {
    return this.args.displayPreview ?? true;
  }

  @action
  toggleSwitchUpdate(newValue: boolean): void {
    this.utmsEnabled = newValue;
    if (!newValue) {
      this.utmCampaign = '';
      this.utmMedium = '';
      this.utmSource = '';
      this.validationErrors = {};
    }
    this.notifyChanges();
  }

  @action
  notifyChanges(target?: string): void {
    // @ts-ignore
    if (target) this[target] = this[target].replaceAll(' ', '+');
    this.args.onChange(this.previewUrl, this.utmsEnabled, this.utmsValid, this.utmFields);
  }

  @action
  validateField(field: string): void {
    if (isBlank(this[field as keyof this])) {
      this.validationErrors = {
        ...this.validationErrors,
        ...{
          [field]: { type: 'error', value: this.intl.t('utms.errors.blank_field') }
        }
      };
      return;
    }

    delete this.validationErrors[field];
    this.validationErrors = { ...this.validationErrors };
  }

  get utmFields(): UtmFields {
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
