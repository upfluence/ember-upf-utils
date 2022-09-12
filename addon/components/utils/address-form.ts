import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get, set } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { CountryData, countries } from '@upfluence/oss-components/utils/country-codes';

interface UtilsAddressFormArgs {
  address: any;
  usePhoneNumberInput: boolean;
  onChange(address: any, isValid: boolean): void;
}

type ProvinceData = { code: string; name: string };

const VALIDATED_ADDRESS_FIELDS: string[] = [
  'firstName',
  'lastName',
  'address1',
  'city',
  'countryCode',
  'zipcode',
  'phone'
];

export default class extends Component<UtilsAddressFormArgs> {
  @tracked provincesForCountry: ProvinceData[] | null = null;
  @tracked phoneNumberPrefix: string = '';
  @tracked phoneNumber: string = '';

  validPhoneNumber: boolean = true;
  countries = countries;

  @action
  selectCountryCode(code: { id: string }): void {
    set(this.args.address, 'countryCode', code.id);
  }

  @action
  applyCountry(country: CountryData): void {
    set(this.args.address, 'countryCode', country.alpha2);
    this.provincesForCountry = country.provinces ?? null;

    if (
      isEmpty(get(this.args.address, 'state')) &&
      (get(this.args.address, 'countryCode') !== country.alpha2 || !this.provincesForCountry)
    ) {
      set(this.args.address, 'state', '');
    }

    this.args.onChange(this.args.address, this._checkAddressValidity());
  }

  @action
  applyProvince(province?: ProvinceData): void {
    set(this.args.address, 'state', province?.name || '');
    this.args.onChange(this.args.address, this._checkAddressValidity());
  }

  @action
  onFieldUpdate(): void {
    this.args.onChange(this.args.address, this._checkAddressValidity());
  }

  @action
  onPhoneNumberUpdate(prefix: string, number: number): void {
    set(this.args.address, 'phone', prefix + number);
    this.args.onChange(this.args.address, this._checkAddressValidity());
  }

  @action
  onPhoneNumberValidation(passes: boolean): void {
    this.validPhoneNumber = passes;
    this.args.onChange(this.args.address, this._checkAddressValidity());
  }

  private _checkAddressValidity(): boolean {
    if (this.args.usePhoneNumberInput && !this.validPhoneNumber) return false;
    if (!isEmpty(this.provincesForCountry) && isEmpty(get(this.args.address, 'state'))) return false;

    return !VALIDATED_ADDRESS_FIELDS.some((addressAttr: string) => {
      const shortAddress = addressAttr === 'address1' ? (get(this.args.address, addressAttr) || '').length < 3 : false;
      const invalidCountryCode =
        addressAttr === 'countryCode' ? (get(this.args.address, addressAttr) || '').length > 2 : false;
      const invalidZipcode =
        addressAttr === 'zipcode' ? (get(this.args.address, addressAttr) || '').length > 255 : false;

      return isEmpty(get(this.args.address, addressAttr)) || shortAddress || invalidCountryCode || invalidZipcode;
    });
  }
}
