import { countries, CountryData } from '@upfluence/oss-components/utils/country-codes';

type GoogleAddressComponent = google.maps.GeocoderAddressComponent;
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

  return result;
}
