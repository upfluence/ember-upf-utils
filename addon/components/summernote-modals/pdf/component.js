import Component from '@ember/component';
import Configuration from '@upfluence/ember-upf-utils/configuration';
import layout from './template';

export default Component.extend({
  layout,

  allowedExtentions: ['pdf'],
  uploaderHeaders: { Scope: Configuration.scope[0] },

  _buildPDFNode(url) {
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
  },

  actions: {
    insertPDF() {
      this.get('editor-context').invoke('editor.insertNode', this._buildPDFNode(this.pdfURL));
      this.sendAction('closeModal');
      this.send('resetPDFUpload');
    },

    resetPDFUpload() {
      this.set('pdfURL', null);
    },

    pdfUploaded({ artifact }) {
      this.set('pdfURL', artifact.url);
      this.set('pdfName', artifact.filename);
    }
  }
});
