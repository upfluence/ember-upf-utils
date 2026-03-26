import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

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
}

export default class extends Component<UtilsAccountBannerArgs> {
  @tracked displaySelectableItems: boolean = false;

  get disabledClass(): string {
    return this.args.disabled ? 'account-banner--disabled' : '';
  }

  get selectedClass(): string {
    return this.args.selected ? 'account-banner--selected' : '';
  }

  get borderColorClass(): string {
    if (this.args.skin) return `account-banner--${this.args.skin}`;
    return '';
  }

  get modifierClasses(): string {
    return [this.disabledClass, this.selectedClass, this.borderColorClass].filter((mc) => !isBlank(mc)).join(' ');
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
