import Modifier, { type ArgsFor, type PositionalArgs, type NamedArgs } from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';

import { isTesting } from '@embroider/macros';

import { Loader } from '@googlemaps/js-api-loader';
import { parseAddressComponents, type AutocompletionAddress } from '../utils/address-parser';

type GooglePlaceResult = google.maps.places.PlaceResult;
type GoogleAutocomplete = google.maps.places.Autocomplete;
type GoogleAutocompleteOptions = google.maps.places.AutocompleteOptions;

interface SetupAutocompleteSignature {
  Element: HTMLElement;
  Args: {
    Named: {
      callback(result: AutocompletionAddress): void;
    };
  };
}

const AUTOCOMPLETE_CONTAINER_CLASS = 'autocomplete-input-container';
const AUTOCOMPLETE_OPTIONS: GoogleAutocompleteOptions = {
  fields: ['address_components'],
  strictBounds: false,
  types: ['address']
};

function cleanup(instance: SetupAutocompleteModifier): void {
  instance.targetElement = null;
  instance.targetInput = null;
  instance.result = null;
  document.querySelector('.pac-container')?.remove();
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
    const input: HTMLInputElement | null = this.getInputElement(element);
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
  }

  private handlePlaceChanged(place: GooglePlaceResult): void {
    if (!place.address_components) return;

    const formattedAddress = this.targetInput?.value ?? '';
    this.result = parseAddressComponents(place.address_components, formattedAddress);
    this.callback?.(this.result);
  }
}
