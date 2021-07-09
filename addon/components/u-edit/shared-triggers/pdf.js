import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class UEditSharedTriggersPdfComponent extends Component {
  @tracked displayModal = false;

  @action
  openModal() {
    this.args.editor.saveRange();
    this.displayModal = true;
  }

  _buildNode(url) {

  }

  @action
  insertPDF(url) {
    this.args.editor.insertNode(this._buildNode(url));
    this.displayModal = false;
  }
}
