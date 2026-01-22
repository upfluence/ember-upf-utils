import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { AutocompletionResult } from '@upfluence/ember-upf-utils/modifiers/setup-autocomplete';

export default class ApplicationController extends Controller {
  @tracked selectedItems = ['toto'];
  @tracked selectedIcon = 'rabbit';
  @tracked selectedColor = 'stone';
  @tracked blobLoading = false;

  @tracked address = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+33769696969',
    address1: '240 East 38th Street',
    address2: 'Bat 5',
    city: 'New York',
    state: 'New York',
    countryCode: 'US',
    zipcode: '10016'
  };
  @tracked shippingAddress = { address: '69 Avenue Victor Hugo, Paris, France', resolved_address: null };
  @tracked inputValue: string = '';
  @tracked ossInputValue: string = '';

  constructor() {
    super(...arguments);
    console.log('Put some stuff here if needed!');
  }

  @action
  onSocialMediaHandlerChanged() {}

  @action
  onBlobSwitch() {
    this.blobLoading = !this.blobLoading;
  }

  @action
  onChange() {}

  @action
  onLogoChange(icon: string, color: string) {
    this.selectedColor = color;
    this.selectedIcon = icon;
  }

  @action
  onChangeAddress(value: any) {
    this.shippingAddress = value;
  }

  @action
  onAutoComplete(value: AutocompletionResult) {
    this.inputValue = value.address1;
    console.log('onAutoComplete', value);
  }

  @action
  onOssAutoComplete(value: AutocompletionResult) {
    this.ossInputValue = value.address1;
    console.log('onAutoComplete', value);
  }
}
