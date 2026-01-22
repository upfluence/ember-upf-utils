import Modifier, { type ArgsFor, type PositionalArgs, type NamedArgs } from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';

import { isTesting } from '@embroider/macros';

import { Loader } from '@googlemaps/js-api-loader';
import { CountryData, countries } from '@upfluence/oss-components/utils/country-codes';

type GAddressComponent = google.maps.GeocoderAddressComponent;
type GPlaceResult = google.maps.places.PlaceResult;

export type AutocompletionResult = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
};

interface SetupAutocompleteSignature {
  Element: HTMLElement;
  Args: {
    Named: {
      callback(): AutocompletionResult;
    };
  };
}

function cleanup(instance: RegisterFormField) {
  instance.targetElement = null;
  instance.targetInput = null;
  instance.callback = () => {};
}

export default class RegisterFormField extends Modifier<SetupAutocompleteSignature> {
  declare targetElement: HTMLElement | null;
  declare targetInput: HTMLInputElement | null;
  declare callback: (result: AutocompletionResult) => void;

  constructor(owner: unknown, args: ArgsFor<SetupAutocompleteSignature>) {
    super(owner, args);
    registerDestructor(this, cleanup);
  }

  modify(
    element: HTMLElement,
    _: PositionalArgs<SetupAutocompleteSignature>,
    { callback }: NamedArgs<SetupAutocompleteSignature>
  ): void {
    const input = this.getInputElement(element);
    if (!input) return;

    this.targetInput = input;
    this.callback = callback;

    if (element === input) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('autocomplete-input-container');
      input.parentNode?.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      this.targetElement = wrapper;
    } else {
      this.targetElement = element;
      this.targetElement.classList.add('autocomplete-input-container');
    }

    this.setupAutoComplete();
  }

  private getInputElement(element: HTMLElement): HTMLInputElement {
    if (element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'text') {
      return element as HTMLInputElement;
    } else {
      const inputElement = element.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        return inputElement;
      } else {
        assert(
          '[modifier][setup-autocomplete] No input[type="text"] element found in the provided element or its children'
        );
      }
    }
  }

  private setupAutoComplete(): void {
    if (isTesting()) return;
    this.appendPacContainerLocally();

    const loader = new Loader({
      apiKey: getOwner(this).resolveRegistration('config:environment').google_map_api_key,
      version: 'weekly'
    });

    loader.importLibrary('places').then(({ Autocomplete }) => {
      this.setupAutocompleteListeners(Autocomplete);
    });
  }

  private setupAutocompleteListeners(
    Autocomplete: new (input: HTMLInputElement, options?: any) => google.maps.places.Autocomplete
  ): void {
    const options = {
      fields: ['address_components'],
      strictBounds: false,
      types: ['address']
    };
    const autocomplete = new Autocomplete(this.targetInput!, options);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.fillInAddress(place);
    });
  }

  private fillInAddress(place: GPlaceResult): void {
    const result: AutocompletionResult = {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipcode: '',
      country: ''
    };

    const mapper: { [key: string]: (comp: GAddressComponent) => void } = {
      street_number: (comp) => {
        result.address1 = `${comp.long_name} ${result.address1}`;
      },
      route: (comp) => {
        result.address1 += comp.long_name;
      },
      subpremise: (comp) => {
        result.address2 = comp.long_name;
      },
      postal_code: (comp) => {
        result.zipcode = `${comp.long_name}${result.zipcode}`;
      },
      postal_code_suffix: (comp) => {
        result.zipcode = `${result.zipcode}-${comp.long_name}`;
      },
      locality: (comp) => {
        result.city = comp.long_name;
      },
      postal_town: (comp) => {
        result.city = comp.long_name;
      },
      administrative_area_level_1: (comp) => {
        result.state = comp.long_name;
      },
      country: (comp) => {
        const selectedCountry: CountryData | undefined = countries.find(
          (country) => country.alpha2 === comp.short_name
        );
        result.country = selectedCountry?.alpha2 ?? '';
      }
    };

    (place.address_components ?? []).reverse().forEach((component) => {
      const componentType: string = component.types[0];

      mapper[componentType]?.(component);
    });

    this.callback(result);
  }

  private appendPacContainerLocally(): void {
    const onInput = () => {
      this.setupPacContainerObserver();
      this.targetInput!.removeEventListener('input', onInput);
    };
    this.targetInput!.addEventListener('input', onInput);
  }

  private setupPacContainerObserver(): void {
    const observer = new MutationObserver((mutationList: any) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node?.classList?.contains('pac-container')) {
              this.targetElement!.append(node);
              observer?.disconnect();
              return;
            }
          }
        }
      }
    });
    observer.observe(document.body, { childList: true });
  }
}
