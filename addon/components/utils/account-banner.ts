import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { type FeedbackMessage } from '@upfluence/oss-components/components/o-s-s/input-container';

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
  plain?: boolean;
  alert?: Alert;

  canSelectItem?: boolean;
  selectableItems?: any[];
  feedbackMessage?: FeedbackMessage;
  required?: boolean;
}

export default class extends Component<UtilsAccountBannerArgs> {
  @tracked displaySelectableItems: boolean = false;

  get feedbackMessage(): FeedbackMessage | undefined {
    return this.args.feedbackMessage;
  }

  get isErrored(): boolean {
    return this.feedbackMessage?.type === 'error';
  }

  get disabledClass(): string {
    return this.args.disabled ? 'account-banner--disabled' : '';
  }

  get selectedClass(): string {
    return this.args.selected ? 'account-banner--selected' : '';
  }

  get plainClass(): string {
    return this.args.plain ? 'account-banner--plain' : '';
  }

  get borderColorClass(): string {
    if (this.isErrored) return 'account-banner--error';
    if (this.args.skin) return `account-banner--${this.args.skin}`;
    return '';
  }

  get modifierClasses(): string {
    return [this.disabledClass, this.selectedClass, this.borderColorClass, this.plainClass]
      .filter((mc) => !isBlank(mc))
      .join(' ');
  }

  get canSelectItem(): boolean {
    return ((this.args.selectableItems || []).length > 1 && this.args.canSelectItem) ?? false;
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
}
