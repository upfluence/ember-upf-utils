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

const BUTTON_ICON: { [index: string]: string } = {
  onView: 'far fa-eye',
  onEdit: 'far fa-pencil',
  onSelect: '',
  onRemove: 'far fa-trash'
};

const BUTTON_LABEL: { [index: string]: string } = {
  onView: '',
  onEdit: '',
  onSelect: '',
  onRemove: ''
};

const BUTTON_SQUARE: { [index: string]: boolean } = {
  onView: true,
  onEdit: true,
  onSelect: false,
  onRemove: true
};

const COMPONENT_EVENT = ['onView', 'onEdit', 'onRemove', 'onSelect'];

interface UtilsProductRowArgs {
  product: any;
  selected?: boolean;
  plain?: boolean;
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
    assert('[Utils::ProducRow] The @product need to be provided', args.product);
    BUTTON_LABEL.onSelect = this.intl.t('upf_utils.product_row.button.select_label');
  }

  get productImageUrl(): string {
    return this.args.product.imageUrl || DEFAULT_IMAGE_URL;
  }

  get isDefaultImg(): boolean {
    return this.productImageUrl === DEFAULT_IMAGE_URL || this.loadingImageError;
  }

  get productOptionLabel(): string {
    if (this.args.selectedOption) {
      return this.intl.t('upf_utils.product_row.option_selected', {
        optionName: this.args.selectedOption.name
      });
    }

    return this.args.product.productOptions.filter((po: any) => po.available).length > 1
      ? this.intl.t('upf_utils.product_row.product_options', {
          nbProductOptions: this.args.product.productOptions.filter((po: any) => po.available).length
        })
      : '';
  }

  get buttonParams(): ButtonArgs[] {
    let displayedButtons: ButtonArgs[] = [];
    COMPONENT_EVENT.forEach((methodArg: string) => {
      if (typeof this.args[methodArg as keyof UtilsProductRowArgs] === 'function') {
        displayedButtons.push(
          this.createButtonArg(BUTTON_LABEL[methodArg], BUTTON_ICON[methodArg], BUTTON_SQUARE[methodArg], methodArg)
        );
      }
    });

    return displayedButtons;
  }

  createButtonArg(label: string, icon: string, square: boolean, callback: string): ButtonArgs {
    return { label: label, icon: icon, square, function: this.args[callback as keyof UtilsProductRowArgs] };
  }

  @action
  imageLoadError(event: Event): void {
    if ((<HTMLImageElement>event.target).src.includes(DEFAULT_IMAGE_URL)) return;
    (<HTMLImageElement>event.target).src = DEFAULT_IMAGE_URL;
    this.loadingImageError = true;
  }
}
