import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ImageTrigger extends Component {
  @tracked displayModal = false;

  @action
  openModal() {
    this.args.editor.saveRange();
    this.displayModal = true;
  }

  @action
  insertImage(url) {
    this.args.editor.insertImage(url);
    this.displayModal = false;
  }
}
