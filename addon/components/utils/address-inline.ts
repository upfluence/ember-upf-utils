import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isTesting } from '@embroider/macros';
import { getOwner } from '@ember/application';

import { Loader } from '@googlemaps/js-api-loader';

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

type GAddressComponent = google.maps.GeocoderAddressComponent;
type GAutoComplete = google.maps.places.Autocomplete;
type GPlaceResult = google.maps.places.PlaceResult;

export default class extends Component<UtilsAddressInlineArgs> {
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
      const input = document.querySelector('[data-control-name="address-inline"] input') as HTMLInputElement;
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
  onChange(value: string): void {
    this.args.onChange({ address: value, resolved_address: null });
  }

  private appendContainerLocally(): void {
    const observer = new MutationObserver((mutationList: any) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          const pacContainer = mutation.addedNodes[0];
          if (!pacContainer?.classList.contains('pac-container')) return;

          document.querySelector('[data-control-name="address-inline"]')?.append(pacContainer);
          observer.disconnect();
        }
      }
    });
    observer.observe(document.body, { childList: true });
  }

  private initInputListeners(autocomplete: GAutoComplete, input: HTMLInputElement): void {
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.updateAddress(place, input);
    });
  }

  private updateAddress(place: GPlaceResult, input: HTMLInputElement): void {
    let address1: string = '';
    let zipcode: string = '';
    let city: string = '';
    let state: string = '';
    let country: string = '';

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
        state = comp.long_name ?? '';
      },
      country: (comp) => {
        country = comp.short_name;
      }
    };

    place.address_components!.reverse().map((component) => {
      const componentType: string = component.types[0];

      mapper[componentType]?.(component);
    });

    this.args.onChange({
      address: input.value,
      resolved_address: {
        line_1: address1,
        zipcode,
        city,
        state,
        country_code: country
      }
    });
  }
}
