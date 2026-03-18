import { countries } from '@upfluence/oss-components/utils/country-codes';

import { type AutocompletionAddress } from '@upfluence/ember-upf-utils/modifiers/setup-autocomplete';

const ADDRESS_COMPONENT_TYPES = [
  'street_number',
  'route',
  'subpremise',
  'postal_code',
  'postal_code_suffix',
  'locality',
  'postal_town',
  'administrative_area_level_1',
  'country'
] as const;

type GoogleAddressComponent = google.maps.GeocoderAddressComponent;
type AddressComponentType = (typeof ADDRESS_COMPONENT_TYPES)[number];

export function parseAddressComponents(
  components: GoogleAddressComponent[],
  formattedAddress: string = ''
): AutocompletionAddress {
  const defaultCountry = countries.find((country) => country.alpha2 === 'US')!;
  const result: AutocompletionAddress = {
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    country: defaultCountry,
    formattedAddress
  };

  const mapper: Record<AddressComponentType, (comp: GoogleAddressComponent) => void> = {
    street_number: (comp: GoogleAddressComponent): void => {
      result.address1 = `${comp.long_name} ${result.address1}`.trim();
    },
    route: (comp: GoogleAddressComponent): void => {
      result.address1 += comp.long_name;
    },
    subpremise: (comp: GoogleAddressComponent): void => {
      result.address2 = comp.long_name;
    },
    postal_code: (comp: GoogleAddressComponent): void => {
      result.zipcode = `${comp.long_name}${result.zipcode}`;
    },
    postal_code_suffix: (comp: GoogleAddressComponent) => {
      result.zipcode = `${result.zipcode}-${comp.long_name}`;
    },
    locality: (comp: GoogleAddressComponent): void => {
      result.city = comp.long_name;
    },
    postal_town: (comp: GoogleAddressComponent): void => {
      result.city = comp.long_name;
    },
    administrative_area_level_1: (comp: GoogleAddressComponent) => {
      result.state = comp.long_name;
    },
    country: (comp: GoogleAddressComponent): void => {
      result.country = countries.find((country) => country.alpha2 === comp.short_name) ?? defaultCountry;
    }
  };

  (components ?? []).reverse().forEach((component) => {
    const componentType: AddressComponentType = component.types[0] as AddressComponentType;
    mapper[componentType]?.(component);
  });

  if (result.address2 === '') delete result['address2'];

  return result;
}
