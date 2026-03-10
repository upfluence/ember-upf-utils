import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get, set } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { CountryData, countries } from '@upfluence/oss-components/utils/country-codes';
import { next } from '@ember/runloop';
import { type AutocompletionAddress } from '@upfluence/ember-upf-utils/modifiers/setup-autocomplete';

type FocusableInput =
  | 'first-name'
  | 'last-name'
  | 'line1'
  | 'line2'
  | 'country'
  | 'city'
  | 'state'
  | 'zipcode'
  | 'phone';

interface UtilsAddressFormArgs {
  address: any;
  usePhoneNumberInput?: boolean;
  hideNameAttrs?: boolean;
  hidePhoneNumber?: boolean;
  useGoogleAutocomplete?: boolean;
  addressKey?: AddressKey;
  focus?: FocusableInput;
  onChange(address: any, isValid: boolean): void;
}

type ProvinceData = { code: string; name: string };
type AddressKey = 'address' | 'line';

const BASE_VALIDATED_ADDRESS_FIELDS: string[] = ['city', 'countryCode', 'zipcode'];
const EXTRA_VALIDATED_ADDRESS_FIELDS: string[] = ['firstName', 'lastName'];

export default class extends Component<UtilsAddressFormArgs> {
  @tracked provincesForCountry: ProvinceData[] | null = null;
  @tracked phoneNumberPrefix: string = '';
  @tracked phoneNumber: string = '';

  validPhoneNumber: boolean = true;
  countries: CountryData[] = countries;
  addressKey: AddressKey = 'address';
  validatedAddressFields = [...BASE_VALIDATED_ADDRESS_FIELDS];

  constructor(owner: unknown, args: UtilsAddressFormArgs) {
    super(owner, args);
    if (args.addressKey) this.addressKey = args.addressKey;
    this.validatedAddressFieldsHandler();
    if (this.args.focus === 'country') {
      this.openCountrySelect();
    }
  }

  get useGoogleAutocomplete(): boolean {
    return this.args.useGoogleAutocomplete ?? true;
  }

  @action
  selectCountryCode(code: { id: string }): void {
    set(this.args.address, 'countryCode', code.id);
  }

  @action
  applyCountry(country: CountryData): void {
    if (get(this.args.address, 'countryCode') !== country.alpha2) {
      set(this.args.address, 'state', '');
    }

    set(this.args.address, 'countryCode', country.alpha2);
    this.provincesForCountry = country.provinces ?? null;
    this.args.onChange?.(this.args.address, this.checkAddressValidity());
  }

  @action
  applyProvince(province?: ProvinceData): void {
    set(this.args.address, 'state', province?.name || '');
    this.args.onChange?.(this.args.address, this.checkAddressValidity());
  }

  @action
  onFieldUpdate(): void {
    this.args.onChange?.(this.args.address, this.checkAddressValidity());
  }

  @action
  onPhoneNumberUpdate(prefix: string, number: number): void {
    set(this.args.address, 'phone', prefix + number);
    this.args.onChange?.(this.args.address, this.checkAddressValidity());
  }

  @action
  onPhoneNumberValidation(passes: boolean): void {
    this.validPhoneNumber = !isEmpty(this.phoneNumber) && passes;
    this.args.onChange?.(this.args.address, this.checkAddressValidity());
  }

  @action
  onAddressSelected(address: AutocompletionAddress): void {
    set(this.args.address, `${this.addressKey}1`, address.address1);
    if (address.address2) {
      set(this.args.address, `${this.addressKey}2`, address.address2);
    }
    this.applyCountry(address.country);
    set(this.args.address, 'city', address.city);
    set(this.args.address, 'state', address.state);
    set(this.args.address, 'zipcode', address.zipcode);

    this.onFieldUpdate();
  }

  private checkAddressValidity(): boolean {
    if (!isEmpty(this.provincesForCountry) && isEmpty(get(this.args.address, 'state'))) return false;

    return !this.validatedAddressFields.some((addressAttr: string) => {
      const invalidPhone =
        addressAttr === 'phone' ? Boolean(this.args.usePhoneNumberInput) && !this.validPhoneNumber : false;
      const shortAddress =
        addressAttr === `${this.addressKey}1` ? (get(this.args.address, addressAttr) || '').length < 3 : false;
      const invalidCountryCode =
        addressAttr === 'countryCode' ? (get(this.args.address, addressAttr) || '').length > 2 : false;
      const invalidZipcode =
        addressAttr === 'zipcode' ? (get(this.args.address, addressAttr) || '').length > 255 : false;

      return (
        isEmpty(get(this.args.address, addressAttr)) ||
        shortAddress ||
        invalidCountryCode ||
        invalidZipcode ||
        invalidPhone
      );
    });
  }

  private validatedAddressFieldsHandler(): void {
    this.validatedAddressFields.push(`${this.addressKey}1`);

    if (!this.args.hidePhoneNumber) {
      this.validatedAddressFields.push('phone');
    }

    if (!this.args.hideNameAttrs) {
      this.validatedAddressFields = this.validatedAddressFields.concat(EXTRA_VALIDATED_ADDRESS_FIELDS);
    }
  }

  private openCountrySelect(): void {
    next(() => {
      (document.querySelector('[data-control-name="address-form-country"] .upf-input') as HTMLInputElement)?.click();
    });
  }
}
