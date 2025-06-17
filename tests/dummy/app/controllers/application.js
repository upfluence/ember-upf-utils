import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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

  constructor() {
    super(...arguments);
    console.log('Put some stuff here if needed!');
  }

  @action
  onSocialMediaHandlerChanged(socialNetwork, handle, formattedUrl) {
    console.log(socialNetwork, handle, formattedUrl);
  }

  @action
  onBlobSwitch() {
    this.blobLoading = !this.blobLoading;
  }

  @action
  onChange(address, isValid) {
    console.log(address, isValid);
  }

  @action
  onLogoChange(icon, color) {
    this.selectedColor = color;
    this.selectedIcon = icon;
  }

  @action
  onChangeAddress(value) {
    this.shippingAddress = value;
  }
}
