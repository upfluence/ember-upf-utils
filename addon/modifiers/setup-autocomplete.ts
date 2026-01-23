import Modifier, { type ArgsFor, type PositionalArgs, type NamedArgs } from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';

import { isTesting } from '@embroider/macros';

import { Loader } from '@googlemaps/js-api-loader';
import { countries, CountryData } from '@upfluence/oss-components/utils/country-codes';

type GoogleAddressComponent = google.maps.GeocoderAddressComponent;
type GooglePlaceResult = google.maps.places.PlaceResult;
type GoogleAutocomplete = google.maps.places.Autocomplete;
type GoogleAutocompleteOptions = google.maps.places.AutocompleteOptions;
type AddressComponentType =
  | 'street_number'
  | 'route'
  | 'subpremise'
  | 'postal_code'
  | 'postal_code_suffix'
  | 'locality'
  | 'postal_town'
  | 'administrative_area_level_1'
  | 'country';

export type AutocompletionAddress = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  country: CountryData;
  formattedAddress: string;
};

interface SetupAutocompleteSignature {
  Element: HTMLElement;
  Args: {
    Named: {
      callback(result: AutocompletionAddress): void;
    };
  };
}

const AUTOCOMPLETE_CONTAINER_CLASS = 'autocomplete-input-container';
const PAC_CONTAINER_CLASS = 'pac-container';
const AUTOCOMPLETE_OPTIONS: GoogleAutocompleteOptions = {
  fields: ['address_components'],
  strictBounds: false,
  types: ['address']
};

function cleanup(instance: SetupAutocompleteModifier): void {
  instance.targetElement = null;
  instance.targetInput = null;
  instance.result = null;
}

export default class SetupAutocompleteModifier extends Modifier<SetupAutocompleteSignature> {
  targetElement: HTMLElement | null = null;
  targetInput: HTMLInputElement | null = null;
  result: AutocompletionAddress | null = null;

  private callback: ((result: AutocompletionAddress) => void) | null = null;

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
    this.setupTargetElement(element, input);
    this.setupAutoComplete();
  }

  private setupTargetElement(element: HTMLElement, input: HTMLInputElement): void {
    if (element === input) {
      this.targetElement = this.createWrapperForInput(input);
    } else {
      this.targetElement = element;
      this.targetElement.classList.add(AUTOCOMPLETE_CONTAINER_CLASS);
    }
  }

  private createWrapperForInput(input: HTMLInputElement): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add(AUTOCOMPLETE_CONTAINER_CLASS);

    const parentNode = input.parentNode;
    assert('[modifier][setup-autocomplete] Input element must have a parent node', parentNode !== null);

    parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    return wrapper;
  }

  private getInputElement(element: HTMLElement): HTMLInputElement | null {
    if (this.isTextInput(element)) return element as HTMLInputElement;

    const inputElement = element.querySelector('input[type="text"]');
    assert(
      '[modifier][setup-autocomplete] No input[type="text"] element found in the provided element or its children',
      inputElement !== null
    );
    return inputElement as HTMLInputElement;
  }

  private isTextInput(element: HTMLElement): element is HTMLInputElement {
    return element.tagName === 'INPUT' && (element as HTMLInputElement).type === 'text';
  }

  private async setupAutoComplete(): Promise<void> {
    if (isTesting()) return;
    this.appendPacContainerLocally();

    const loader = new Loader({
      apiKey: getOwner(this).resolveRegistration('config:environment').google_map_api_key,
      version: 'weekly'
    });

    loader.importLibrary('places').then(({ Autocomplete }) => {
      this.initializeAutocomplete(Autocomplete);
    });
  }

  private initializeAutocomplete(
    AutocompleteConstructor: new (
      input: HTMLInputElement,
      options?: google.maps.places.AutocompleteOptions
    ) => GoogleAutocomplete
  ): void {
    assert('[modifier][setup-autocomplete] Target input is not initialized', this.targetInput !== null);

    const autocomplete = new AutocompleteConstructor(this.targetInput, AUTOCOMPLETE_OPTIONS);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.handlePlaceChanged(place);
    });

    this.targetInput.addEventListener('focusout', (event) => {
      if ((<HTMLInputElement>event.target).value === this.result?.address1) return;
      (<HTMLInputElement>event.target).value = this.result?.address1 ?? '';
    });
  }

  private handlePlaceChanged(place: GooglePlaceResult): void {
    if (!place.address_components) return;

    this.result = this.parseAddressComponents(place.address_components);
    this.callback?.(this.result);
  }

  private parseAddressComponents(components: GoogleAddressComponent[]): AutocompletionAddress {
    const defaultCountry = countries.find((country) => country.alpha2 === 'US')!;
    const result: AutocompletionAddress = {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipcode: '',
      country: defaultCountry,
      formattedAddress: ''
    };

    const mapper: Record<AddressComponentType, (comp: GoogleAddressComponent) => void> = {
      street_number: (comp: GoogleAddressComponent) => {
        result.address1 = `${comp.long_name} ${result.address1}`.trim();
      },
      route: (comp: GoogleAddressComponent) => {
        result.address1 += comp.long_name;
      },
      subpremise: (comp: GoogleAddressComponent) => {
        result.address2 = comp.long_name;
      },
      postal_code: (comp: GoogleAddressComponent) => {
        result.zipcode = `${comp.long_name}${result.zipcode}`;
      },
      postal_code_suffix: (comp: GoogleAddressComponent) => {
        result.zipcode = `${result.zipcode}-${comp.long_name}`;
      },
      locality: (comp: GoogleAddressComponent) => {
        result.city = comp.long_name;
      },
      postal_town: (comp: GoogleAddressComponent) => {
        result.city = comp.long_name;
      },
      administrative_area_level_1: (comp: GoogleAddressComponent) => {
        result.state = comp.long_name;
      },
      country: (comp: GoogleAddressComponent) => {
        result.country = countries.find((country) => country.alpha2 === comp.short_name) ?? defaultCountry;
      }
    };

    (components ?? []).reverse().forEach((component) => {
      const componentType: AddressComponentType = component.types[0] as AddressComponentType;
      mapper[componentType]?.(component);
    });

    if (result.address2 === '') delete result['address2'];

    result.formattedAddress = [
      result.address1,
      result.address2,
      result.city,
      result.state,
      result.zipcode,
      result.country.name
    ]
      .filter(Boolean)
      .join(', ');

    return result;
  }

  private appendPacContainerLocally(): void {
    assert('[modifier][setup-autocomplete] Target input is not initialized', this.targetInput !== null);
    this.targetInput.addEventListener('input', this.setupPacContainerObserver, { once: true });
  }

  private setupPacContainerObserver(): void {
    const observer = new MutationObserver((mutationList: MutationRecord[]) => {
      for (const mutation of mutationList) {
        if (mutation.type !== 'childList') {
          continue;
        }

        for (const node of mutation.addedNodes) {
          if (this.isPacContainer(node)) {
            this.relocatePacContainer(node as HTMLElement);
            observer.disconnect();
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true });
  }

  private isPacContainer(node: Node): node is HTMLElement {
    return node instanceof HTMLElement && node.classList.contains(PAC_CONTAINER_CLASS);
  }

  private relocatePacContainer(container: HTMLElement): void {
    assert('[modifier][setup-autocomplete] Target element is not initialized', this.targetElement !== null);
    this.targetElement.appendChild(container);
  }
}
