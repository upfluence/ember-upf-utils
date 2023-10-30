import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked selectedItems = ['toto'];
  @tracked address = {};

  constructor() {
    super(...arguments);
    console.log('Put some stuff here if needed!');
  }

  @action
  onSocialMediaHandlerChanged(socialNetwork, handle, formattedUrl) {
    console.log(socialNetwork, handle, formattedUrl);
  }

  @action
  onChange(address, isValid) {
    console.log(address, isValid);
  }
}
