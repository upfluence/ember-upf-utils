import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { IntlService } from 'ember-intl';

import { Feedback, FormInstance } from '@upfluence/oss-components/services/form-manager';

type SkinType = 'success' | 'error' | 'warning';

export type Alert = {
  icon?: string;
  skin?: SkinType;
  title?: string;
  subtitle?: string;
  plain?: boolean;
  link?: { label: string; href: string };
};

interface UtilsAccountBannerArgs {
  icon?: string;
  image?: string;
  title?: string;
  subtitle?: string;
  selected?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  skin?: SkinType;
  alert?: Alert;

  canSelectItem?: boolean;
  selectableItems?: any[];
  selectedAccount?: any;

  onFormSetup?(form: FormInstance): void;
}

export default class extends Component<UtilsAccountBannerArgs> {
  @service declare intl: IntlService;

  declare formInstance: FormInstance;

  @tracked displaySelectableItems: boolean = false;
  @tracked isErrored: boolean = false;

  get disabledClass(): string {
    return this.args.disabled ? 'account-banner--disabled' : '';
  }

  get selectedClass(): string {
    return this.args.selected ? 'account-banner--selected' : '';
  }

  get borderColorClass(): string {
    if (this.args.skin || this.isErrored) return `account-banner--${this.args.skin}`;
    return '';
  }

  get modifierClasses(): string {
    return [this.disabledClass, this.selectedClass, this.borderColorClass].filter((mc) => !isBlank(mc)).join(' ');
  }

  get canSelectItem(): boolean {
    return ((this.args.selectableItems || []).length > 1 && this.args.canSelectItem) ?? false;
  }

  noop(): void {}

  @action
  onFormSetup(form: FormInstance): void {
    this.formInstance = form;
    this.args.onFormSetup?.(form);
  }

  @action
  toggleSelectionDropdown(e: MouseEvent): void {
    if (!this.canSelectItem || this.args.readonly) return;
    if ((e.target as Element).closest('.upf-floating-menu')) return;
    e.stopPropagation();
    this.displaySelectableItems = !this.displaySelectableItems;
  }

  @action
  closeSelectionDropdown(): void {
    this.displaySelectableItems = false;
  }

  @action
  validateAccountSelection(): Feedback | undefined {
    if (!this.args.selectedAccount) {
      this.isErrored = true;
      return {
        kind: 'blank',
        message: { type: 'error', value: this.intl.t('oss-components.forms.errors.required') }
      };
    }

    this.isErrored = false;
    return undefined;
  }
}
