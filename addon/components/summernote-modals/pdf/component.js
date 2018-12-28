import Component from '@ember/component';
import Configuration from 'ember-upf-utils/configuration';
import layout from './template';

export default Component.extend({
  layout,

  allowedExtentions: ['pdf'],
  uploaderHeaders: { Scope: Configuration.scope[0] },

  _buildPDFNode(url) {
    let container = document.createElement('div');

    let embed = document.createElement('iframe');
    embed.setAttribute(
      'src', `https://docs.google.com/viewer?url=${url}&embedded=true`
    );
    embed.setAttribute('frameborder', 0);
    embed.setAttribute('height', '800px;');
    embed.setAttribute('width', '100%');

    let embedNotSupported  = document.createElement('a');
    embedNotSupported.setAttribute('href', url);
    embedNotSupported.textContent = 'Click to open PDF';

    container.appendChild(embed);
    container.appendChild(embedNotSupported);
    return container;
  },

  actions: {
    insertPDF() {
      this.get('editor-context').invoke(
        'editor.insertNode', this._buildPDFNode(
          this.get('pdfURL')
        )
      );
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
