export const FOCUSABLE_INPUTS = [
  'first-name',
  'last-name',
  'line1',
  'line2',
  'country',
  'city',
  'state',
  'zipcode',
  'phone'
] as const;

export type FocusableInput = (typeof FOCUSABLE_INPUTS)[number];

export type ProvinceData = { code: string; name: string };
export type AddressKey = 'address' | 'line';

export const ADDRESS_FORM_FIELD_ORDER = [
  'firstName',
  'lastName',
  'phone',
  'address1',
  'address2',
  'countryCode',
  'state',
  'city',
  'zipcode'
] as const;

export type AddressFormField = (typeof ADDRESS_FORM_FIELD_ORDER)[number];

export const ADDRESS_FORM_FIELD_CONTROL_NAMES = Object.fromEntries(
  ADDRESS_FORM_FIELD_ORDER.map((field) => [
    field,
    `address-form-${field === 'countryCode' ? 'country' : field.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
  ])
) as Record<AddressFormField, string>;

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
