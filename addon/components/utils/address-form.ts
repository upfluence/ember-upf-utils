import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get, set } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { isTesting } from '@embroider/macros';
import { getOwner } from '@ember/application';

import { Loader } from '@googlemaps/js-api-loader';
import { CountryData, countries } from '@upfluence/oss-components/utils/country-codes';
import { next } from '@ember/runloop';

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
type GAddressComponent = google.maps.GeocoderAddressComponent;
type GPlaceResult = google.maps.places.PlaceResult;
type GAutoComplete = google.maps.places.Autocomplete;
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
  initAutoCompletion(): void {
    if (isTesting()) return;
    this.appendContainerLocally();
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

  private initInputListeners(autocomplete: GAutoComplete, input: HTMLElement): void {
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.fillInAddress(place);
    });
    input.addEventListener('focusout', (event) => {
      if ((<HTMLInputElement>event.target).value !== get(this.args.address, `${this.addressKey}1`)) {
        (<HTMLInputElement>event.target).value = get(this.args.address, `${this.addressKey}1`) ?? '';
      }
    });
  }

  private fillInAddress(place: GPlaceResult): void {
    let address1: string = '';
    let zipcode: string = '';
    let city: string = '';

    const mapper: { [key: string]: (comp: GAddressComponent) => void } = {
      street_number: (comp) => {
        address1 = `${comp.long_name} ${address1}`;
      },
      route: (comp) => {
        address1 += comp.long_name;
      },
      postal_code: (comp) => {
        zipcode = `${comp.long_name}${zipcode}`;
      },
      postal_code_suffix: (comp) => {
        zipcode = `${zipcode}-${comp.long_name}`;
      },
      locality: (comp) => {
        city = comp.long_name;
      },
      postal_town: (comp) => {
        city = comp.long_name;
      },
      administrative_area_level_1: (comp) => {
        set(this.args.address, 'state', comp.long_name || '');
      },
      country: (comp) => {
        const selectedCountry = this.countries.find((country) => country.alpha2 === comp.short_name);

        if (!selectedCountry) return;
        this.applyCountry(selectedCountry);
      }
    };

    place.address_components!.reverse().forEach((component) => {
      const componentType: string = component.types[0];

      mapper[componentType]?.(component);
    });

    set(this.args.address, `${this.addressKey}1`, address1);
    set(this.args.address, `${this.addressKey}2`, '');
    set(this.args.address, 'zipcode', zipcode);
    set(this.args.address, 'city', city);
    this.onFieldUpdate();
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

  private appendContainerLocally(): void {
    const observer = new MutationObserver((mutationList: any) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          const pacContainer = mutation.addedNodes[0];
          if (!pacContainer?.classList.contains('pac-container')) return;

          document.querySelector('[data-control-name="address-form-address1"]')?.append(pacContainer);
          observer.disconnect();
        }
      }
    });
    observer.observe(document.body, { childList: true });
  }

  private openCountrySelect(): void {
    next(() => {
      (document.querySelector('[data-control-name="address-form-country"] .upf-input') as HTMLInputElement)?.click();
    });
  }
}
