import { action, get, set } from '@ember/object';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type { Feedback, FormInstance } from '@upfluence/oss-components/services/form-manager';
import { CountryData, countries } from '@upfluence/oss-components/utils/country-codes';
import type { IntlService } from 'ember-intl';

import { type AutocompletionAddress } from '@upfluence/ember-upf-utils/modifiers/setup-autocomplete';

import {
  ADDRESS_FORM_FIELD_CONTROL_NAMES,
  BASE_VALIDATED_ADDRESS_FIELDS,
  EXTRA_VALIDATED_ADDRESS_FIELDS,
  FOCUSABLE_CONTROL_NAMES
} from './address-form-utils';
import type { AddressKey, FocusableInput, ProvinceData } from './address-form-utils';

export { ADDRESS_FORM_FIELD_CONTROL_NAMES, ADDRESS_FORM_FIELD_ORDER } from './address-form-utils';
export type { AddressFormField } from './address-form-utils';

interface UtilsAddressFormArgs {
  address: any;
  usePhoneNumberInput?: boolean;
  hideNameAttrs?: boolean;
  hidePhoneNumber?: boolean;
  useGoogleAutocomplete?: boolean;
  addressKey?: AddressKey;
  focus?: FocusableInput;
  onFormSetup?(form: FormInstance): void;
  onFormSubmit?(isValid: boolean): void;
  onChange?(address: any, isValid: boolean): void;
}

export default class extends Component<UtilsAddressFormArgs> {
  @service declare intl: IntlService;

  @tracked formInstance?: FormInstance;
  @tracked provincesForCountry: ProvinceData[] | null = null;
  @tracked phoneNumberPrefix: string = '';
  @tracked phoneNumber: string = '';

  fieldControlNames = ADDRESS_FORM_FIELD_CONTROL_NAMES;

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
    } else {
      this.focusAddressField();
    }
  }

  get useGoogleAutocomplete(): boolean {
    return this.args.useGoogleAutocomplete ?? true;
  }

  @action
  onFormSetup(form: FormInstance): void {
    this.formInstance = form;
    this.args.onFormSetup?.(form);
  }

  @action
  onFormSubmit(isValid: boolean): void {
    this.args.onFormSubmit?.(isValid);
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
    ['countryCode.submit', 'countryCode.format.submit', 'state.submit', 'state.province'].forEach((key) => {
      this.formInstance?.clearErrors(key);
    });
    this.args.onChange?.(this.args.address, this.checkAddressValidity());
  }

  @action
  applyProvince(province?: ProvinceData): void {
    set(this.args.address, 'state', province?.name || '');
    ['state.submit', 'state.province'].forEach((key) => {
      this.formInstance?.clearErrors(key);
    });
    this.args.onChange?.(this.args.address, this.checkAddressValidity());
  }

  @action
  onFieldUpdate(): void {
    this.args.onChange?.(this.args.address, this.checkAddressValidity());
  }

  @action
  validateFieldPresence(field: string): Feedback | undefined {
    const isRequired =
      this.validatedAddressFields.includes(field) || (field === 'state' && !isEmpty(this.provincesForCountry));
    if (!isRequired || !this.isFieldValueEmpty(field)) return;

    return {
      kind: 'blank',
      message: { type: 'error', value: this.intl.t('oss-components.forms.errors.required') }
    };
  }

  @action
  validateAddressLineFormat(): Feedback | undefined {
    return this.validateField(`${this.addressKey}1`, (value) => value.length >= 3);
  }

  @action
  validateCountryFormat(): Feedback | undefined {
    return this.validateField('countryCode', (value) => value.length <= 2);
  }

  @action
  validateZipcodeFormat(): Feedback | undefined {
    return this.validateField('zipcode', (value) => value.length <= 255);
  }

  @action
  validatePhoneFormat(): Feedback | undefined {
    if (isEmpty(this.phoneNumber) || this.validPhoneNumber) return;

    return this.invalidFormatFeedback();
  }

  @action
  onPhoneNumberUpdate(prefix: string, number: string): void {
    this.phoneNumberPrefix = prefix;
    this.phoneNumber = number;
    set(this.args.address, 'phone', prefix + number);
    this.args.onChange?.(this.args.address, this.checkAddressValidity());
  }

  @action
  onPhoneNumberValidation(passes: boolean): void {
    this.validPhoneNumber = !isEmpty(this.phoneNumber) && passes;
    this.args.onChange?.(this.args.address, this.checkAddressValidity());
  }

  @action
  onAddressSelected(address: AutocompletionAddress): void {
    set(this.args.address, `${this.addressKey}1`, address.address1);
    if (address.address2) {
      set(this.args.address, `${this.addressKey}2`, address.address2);
    }
    this.applyCountry(address.country);
    set(this.args.address, 'city', address.city);
    set(this.args.address, 'state', address.state);
    set(this.args.address, 'zipcode', address.zipcode);

    this.onFieldUpdate();
  }

  private checkAddressValidity(): boolean {
    if (!isEmpty(this.provincesForCountry) && isEmpty(get(this.args.address, 'state'))) return false;

    return !this.validatedAddressFields.some((addressAttr: string) => {
      const fieldValue: string = get(this.args.address, addressAttr) || '';
      const invalidPhone =
        addressAttr === 'phone' &&
        Boolean(this.args.usePhoneNumberInput) &&
        !isEmpty(this.phoneNumber) &&
        !this.validPhoneNumber;
      const shortAddress = addressAttr === `${this.addressKey}1` && fieldValue.length < 3;
      const invalidCountryCode = addressAttr === 'countryCode' && fieldValue.length > 2;
      const invalidZipcode = addressAttr === 'zipcode' && fieldValue.length > 255;

      return (
        this.isFieldValueEmpty(addressAttr) || shortAddress || invalidCountryCode || invalidZipcode || invalidPhone
      );
    });
  }

  private isFieldValueEmpty(field: string): boolean {
    const value = get(this.args.address, field);

    return (
      isEmpty(value) ||
      (field === 'phone' && Boolean(this.args.usePhoneNumberInput) && value === this.phoneNumberPrefix)
    );
  }

  private invalidFormatFeedback(): Feedback {
    return {
      kind: 'invalid',
      message: { type: 'error', value: this.intl.t('oss-components.forms.errors.invalid_format') }
    };
  }

  private validateField(fieldPath: string, isValid: (value: string) => boolean): Feedback | undefined {
    const value: string = get(this.args.address, fieldPath) || '';
    if (isEmpty(value) || isValid(value)) return;

    return this.invalidFormatFeedback();
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

  private openCountrySelect(): void {
    next(() => {
      (document.querySelector('[data-control-name="address-form-country"] .upf-input') as HTMLInputElement)?.click();
    });
  }

  private focusAddressField(): void {
    const controlName = this.args.focus && FOCUSABLE_CONTROL_NAMES[this.args.focus];
    if (controlName)
      next(() =>
        document.querySelector<HTMLInputElement>(`[data-control-name="${controlName}"] input:not([disabled])`)?.focus()
      );
  }
}
