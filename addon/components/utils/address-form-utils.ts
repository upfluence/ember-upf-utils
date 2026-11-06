export type FocusableInput =
  | 'first-name'
  | 'last-name'
  | 'line1'
  | 'line2'
  | 'country'
  | 'city'
  | 'state'
  | 'zipcode'
  | 'phone';

export type ProvinceData = { code: string; name: string };
export type AddressKey = 'address' | 'line';

export type AddressFormField =
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'address1'
  | 'address2'
  | 'countryCode'
  | 'state'
  | 'city'
  | 'zipcode';

export const ADDRESS_FORM_FIELD_CONTROL_NAMES: Record<AddressFormField, string> = {
  firstName: 'address-form-first-name',
  lastName: 'address-form-last-name',
  phone: 'address-form-phone',
  address1: 'address-form-address1',
  address2: 'address-form-address2',
  countryCode: 'address-form-country',
  state: 'address-form-state',
  city: 'address-form-city',
  zipcode: 'address-form-zipcode'
};

export const ADDRESS_FORM_FIELD_ORDER: AddressFormField[] = [
  'firstName',
  'lastName',
  'phone',
  'address1',
  'countryCode',
  'state',
  'city',
  'zipcode'
];

export const FOCUSABLE_CONTROL_NAMES: Partial<Record<FocusableInput, string>> = {
  'first-name': ADDRESS_FORM_FIELD_CONTROL_NAMES.firstName,
  'last-name': ADDRESS_FORM_FIELD_CONTROL_NAMES.lastName,
  line1: ADDRESS_FORM_FIELD_CONTROL_NAMES.address1,
  line2: ADDRESS_FORM_FIELD_CONTROL_NAMES.address2,
  city: ADDRESS_FORM_FIELD_CONTROL_NAMES.city,
  state: ADDRESS_FORM_FIELD_CONTROL_NAMES.state,
  zipcode: ADDRESS_FORM_FIELD_CONTROL_NAMES.zipcode,
  phone: ADDRESS_FORM_FIELD_CONTROL_NAMES.phone
};

export const BASE_VALIDATED_ADDRESS_FIELDS: string[] = ['city', 'countryCode', 'zipcode'];
export const EXTRA_VALIDATED_ADDRESS_FIELDS: string[] = ['firstName', 'lastName'];
