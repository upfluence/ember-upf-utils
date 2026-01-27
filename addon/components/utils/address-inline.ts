import Component from '@glimmer/component';
import { action } from '@ember/object';
import { type AutocompletionAddress } from '@upfluence/ember-upf-utils/modifiers/setup-autocomplete';

interface UtilsAddressInlineArgs {
  value: ShippingAddress;
  useGoogleAutocomplete?: boolean;
  onChange(address: any): void;
}

export type ShippingAddress = {
  address: string;
  resolved_address: {
    line_1: string;
    zipcode: string;
    city: string;
    state?: string;
    country_code: string;
  } | null;
};

export default class extends Component<UtilsAddressInlineArgs> {
  get useGoogleAutocomplete(): boolean {
    return this.args.useGoogleAutocomplete ?? true;
  }

  @action
  onAddressSelected(address: AutocompletionAddress): void {
    this.args.onChange({
      address: address.formattedAddress,
      resolved_address: {
        line_1: address.address1,
        zipcode: address.zipcode,
        city: address.city,
        state: address.state,
        country_code: address.country.alpha2
      }
    });
  }

  @action
  onChange(value: string): void {
    this.args.onChange({ address: value, resolved_address: null });
  }
}
