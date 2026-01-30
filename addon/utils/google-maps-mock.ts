export type MockGoogleAddressComponent = {
  types: string[];
  long_name: string;
  short_name: string;
};

export type MockPlaceResult = {
  address_components?: MockGoogleAddressComponent[];
  formatted_address?: string;
};

export class MockAutocomplete {
  private listeners: Map<string, Function[]> = new Map();
  private mockPlace: MockPlaceResult = {};

  constructor(public input: HTMLInputElement, public options?: Record<string, any>) {}

  addListener(eventName: string, handler: Function): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(handler);
  }

  getPlace(): MockPlaceResult {
    return this.mockPlace;
  }

  setPlace(place: MockPlaceResult): void {
    this.mockPlace = place;
  }

  triggerEvent(eventName: string): void {
    const handlers = this.listeners.get(eventName) || [];
    handlers.forEach((handler) => handler());
  }

  simulatePlaceSelection(place: MockPlaceResult): void {
    this.setPlace(place);
    this.triggerEvent('place_changed');
  }
}

export class MockLoader {
  private mockAutocompleteInstance: MockAutocomplete | null = null;

  constructor(public config?: Record<string, any>) {}

  async importLibrary(libraryName: string): Promise<any> {
    if (libraryName === 'places') {
      const self = this;
      return {
        Autocomplete: class {
          constructor(input: HTMLInputElement, options?: Record<string, any>) {
            self.mockAutocompleteInstance = new MockAutocomplete(input, options);
            return self.mockAutocompleteInstance;
          }
        }
      };
    }
    return {};
  }

  getMockAutocompleteInstance(): MockAutocomplete | null {
    return this.mockAutocompleteInstance;
  }
}

export function createSampleAddressComponents(
  overrides: Partial<{
    streetNumber: string;
    route: string;
    subpremise: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    countryCode: string;
  }>
): MockGoogleAddressComponent[] {
  const defaults = {
    streetNumber: '1600',
    route: 'Amphitheatre Parkway',
    subpremise: '',
    city: 'Mountain View',
    state: 'California',
    zipcode: '94043',
    country: 'United States',
    countryCode: 'US'
  };

  const values = { ...defaults, ...overrides };
  const components: MockGoogleAddressComponent[] = [];

  if (values.streetNumber) {
    components.push({
      types: ['street_number'],
      long_name: values.streetNumber,
      short_name: values.streetNumber
    });
  }

  if (values.route) {
    components.push({
      types: ['route'],
      long_name: values.route,
      short_name: values.route
    });
  }

  if (values.subpremise) {
    components.push({
      types: ['subpremise'],
      long_name: values.subpremise,
      short_name: values.subpremise
    });
  }

  if (values.city) {
    components.push({
      types: ['locality'],
      long_name: values.city,
      short_name: values.city
    });
  }

  if (values.state) {
    components.push({
      types: ['administrative_area_level_1'],
      long_name: values.state,
      short_name: values.state
    });
  }

  if (values.zipcode) {
    components.push({
      types: ['postal_code'],
      long_name: values.zipcode,
      short_name: values.zipcode
    });
  }

  components.push({
    types: ['country'],
    long_name: values.country,
    short_name: values.countryCode
  });

  return components;
}

export function createMockPlaceResult(
  addressComponents: MockGoogleAddressComponent[],
  formattedAddress?: string
): MockPlaceResult {
  return {
    address_components: addressComponents,
    formatted_address: formattedAddress
  };
}
