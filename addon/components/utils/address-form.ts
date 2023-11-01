import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get, set } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { isTesting } from '@embroider/macros';
import { getOwner } from '@ember/application';

import { Loader } from '@googlemaps/js-api-loader';
import { CountryData, countries } from '@upfluence/oss-components/utils/country-codes';

interface UtilsAddressFormArgs {
  address: any;
  usePhoneNumberInput: boolean;
  hideNameAttrs?: boolean;
  useGoogleAutocomplete?: boolean;
  onChange(address: any, isValid: boolean): void;
}

type ProvinceData = { code: string; name: string };

const BASE_VALIDATED_ADDRESS_FIELDS: string[] = ['address1', 'city', 'countryCode', 'zipcode', 'phone'];
const EXTRA_VALIDATED_ADDRESS_FIELDS: string[] = ['firstName', 'lastName'];

export default class extends Component<UtilsAddressFormArgs> {
  @tracked provincesForCountry: ProvinceData[] | null = null;
  @tracked phoneNumberPrefix: string = '';
  @tracked phoneNumber: string = '';

  validPhoneNumber: boolean = true;
  countries = countries;

  get useGoogleAutocomplete(): boolean {
    return this.args.useGoogleAutocomplete ?? true;
  }

  @action
  initAutoCompletion(): void {
    if (isTesting()) return;
    const loader = new Loader({
      apiKey: getOwner(this).resolveRegistration('config:environment').google_map_api_key,
      version: 'weekly'
    });

    loader.importLibrary('places').then(({ Autocomplete }) => {
      const input = document.querySelector('[data-control-name="address-form-address1"] input') as HTMLInputElement;
      const options = {
        fields: ['address_components'],
        strictBounds: false,
        types: ['address']
      };
      const autocomplete = new Autocomplete(input, options);
      this.initInputListeners(autocomplete, input);
    });
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
    this.args.onChange(this.args.address, this.checkAddressValidity());
  }

  @action
  applyProvince(province?: ProvinceData): void {
    set(this.args.address, 'state', province?.name || '');
    this.args.onChange(this.args.address, this.checkAddressValidity());
  }

  @action
  onFieldUpdate(): void {
    this.args.onChange(this.args.address, this.checkAddressValidity());
  }

  @action
  onPhoneNumberUpdate(prefix: string, number: number): void {
    set(this.args.address, 'phone', prefix + number);
    this.args.onChange(this.args.address, this.checkAddressValidity());
  }

  @action
  onPhoneNumberValidation(passes: boolean): void {
    this.validPhoneNumber = !isEmpty(this.phoneNumber) && passes;
    this.args.onChange(this.args.address, this.checkAddressValidity());
  }

  private checkAddressValidity(): boolean {
    const validatedAddressFields = this.args.hideNameAttrs
      ? BASE_VALIDATED_ADDRESS_FIELDS
      : [...BASE_VALIDATED_ADDRESS_FIELDS, ...EXTRA_VALIDATED_ADDRESS_FIELDS];

    if (this.args.usePhoneNumberInput && !this.validPhoneNumber) return false;
    if (!isEmpty(this.provincesForCountry) && isEmpty(get(this.args.address, 'state'))) return false;

    return !validatedAddressFields.some((addressAttr: string) => {
      const shortAddress = addressAttr === 'address1' ? (get(this.args.address, addressAttr) || '').length < 3 : false;
      const invalidCountryCode =
        addressAttr === 'countryCode' ? (get(this.args.address, addressAttr) || '').length > 2 : false;
      const invalidZipcode =
        addressAttr === 'zipcode' ? (get(this.args.address, addressAttr) || '').length > 255 : false;

      return isEmpty(get(this.args.address, addressAttr)) || shortAddress || invalidCountryCode || invalidZipcode;
    });
  }

  private initInputListeners(autocomplete: google.maps.places.Autocomplete, input: HTMLElement): void {
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.fillInAddress(place);
    });
    input.addEventListener('focusout', (event) => {
      if ((<HTMLInputElement>event.target).value !== this.args.address.address1) {
        (<HTMLInputElement>event.target).value = this.args.address.address1;
      }
    });
  }

  private fillInAddress(place: google.maps.places.PlaceResult): void {
    let address1: string = '';
    let zipcode: string = '';
    let city: string = '';

    place.address_components!.reverse().map((component) => {
      const componentType: string = component.types[0];
      const mapper: { [key: string]: () => void } = {
        street_number: () => {
          address1 = `${component.long_name} ${address1}`;
        },
        route: () => {
          address1 += component.long_name;
        },
        postal_code: () => {
          zipcode = `${component.long_name}${zipcode}`;
        },
        postal_code_suffix: () => {
          zipcode = `${zipcode}-${component.long_name}`;
        },
        locality: () => {
          city = component.long_name;
        },
        postal_town: () => {
          city = component.long_name;
        },
        administrative_area_level_1: () => {
          set(this.args.address, 'state', component.long_name || '');
        },
        country: () => {
          const selectedCountry = this.countries.find((c) => c.alpha2 === component.short_name);

          if (!selectedCountry) return;
          this.applyCountry(selectedCountry);
        }
      };
      mapper[componentType]?.();
    });

    set(this.args.address, 'address1', address1);
    set(this.args.address, 'address2', '');
    set(this.args.address, 'zipcode', zipcode);
    set(this.args.address, 'city', city);
    this.onFieldUpdate();
  }
}
