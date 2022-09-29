import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

type ButtonArgs = {
  label: string;
  icon: string;
  square: boolean;
  function: any;
};

interface UtilsProductRowArgs {
  contributionProduct: any;
  selected?: boolean;
  plain?: boolean | undefined;
  selectedOption?: any;
  onView?(product: any): any;
  onEdit?(product: any): any;
  onSelect?(product: any): any;
  onRemove?(product: any): any;
}

export const DEFAULT_IMAGE_URL: string = '/assets/@upfluence/ember-upf-utils/images/upfluence-white-logo.svg';

export default class extends Component<UtilsProductRowArgs> {
  @service declare intl: any;
  @tracked loadingImageError: boolean = false;

  constructor(owner: any, args: UtilsProductRowArgs) {
    super(owner, args);
    assert('[Utils::ProducRow] The @contributionProduct need to be provided', args.contributionProduct);
  }

  get productImageUrl(): string {
    return this.args.contributionProduct.providerProductImageUrl || DEFAULT_IMAGE_URL;
  }

  get defaultImgClass(): boolean {
    return this.productImageUrl === DEFAULT_IMAGE_URL || this.loadingImageError;
  }

  get productOptionMessage(): string {
    if (this.args.selectedOption) {
      return this.intl.t('upf_utils.product_row.option_selected', {
        nameoption: this.args.selectedOption.name
      });
    }
    return this.args.contributionProduct.productOptions.length > 1
      ? this.intl.t('upf_utils.product_row.product_options', {
          nbProductOptions: this.args.contributionProduct.productOptions.length
        })
      : '';
  }

  get displayButton(): ButtonArgs[] {
    let displayedButton: ButtonArgs[] = [];
    const viewButton: ButtonArgs = {
      label: '',
      icon: 'far fa-eye',
      square: true,
      function: this.args.onView
    };
    const editButton: ButtonArgs = {
      label: '',
      icon: 'far fa-pencil',
      square: true,
      function: this.args.onEdit
    };
    const removeButton: ButtonArgs = {
      label: '',
      icon: 'far fa-trash',
      square: true,
      function: this.args.onRemove
    };
    const selectedButton: ButtonArgs = {
      label: this.intl.t('upf_utils.product_row.button.select_label'),
      icon: '',
      square: false,
      function: this.args.onSelect
    };
    if (typeof this.args.onView === 'function') displayedButton.push(viewButton);
    if (typeof this.args.onEdit === 'function') displayedButton.push(editButton);
    if (typeof this.args.onRemove === 'function') displayedButton.push(removeButton);
    if (typeof this.args.onSelect === 'function') displayedButton.push(selectedButton);

    return displayedButton;
  }

  @action
  imageLoadError(event: Event): void {
    (<HTMLImageElement>event.target).src = DEFAULT_IMAGE_URL;
    this.loadingImageError = true;
  }
}
