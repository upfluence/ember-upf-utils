import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class UEditSharedTriggersPdfComponent extends Component {
  @tracked displayModal = false;

  @action
  openModal(event) {
    event.stopPropagation();
    this.args.editor.saveRange();
    this.displayModal = true;
  }

  _buildNode(url) {
    let container = document.createElement('div');
    let spacing = document.createElement('br');

    let embed = document.createElement('embed');
    embed.setAttribute('src', url);
    embed.setAttribute('width', '100%');
    embed.setAttribute('height', '800px');
    embed.setAttribute('type', 'application/pdf');

    let embedNotSupported = document.createElement('a');
    embedNotSupported.setAttribute('href', url);
    embedNotSupported.textContent = 'Click to open PDF';

    container.append(spacing);
    container.appendChild(embed);
    container.append(spacing);
    container.appendChild(embedNotSupported);
    container.append(spacing);

    return container;
  }

  @action
  insertPDF(url) {
    this.args.editor.insertNode(this._buildNode(url));
    this.displayModal = false;
  }
}
