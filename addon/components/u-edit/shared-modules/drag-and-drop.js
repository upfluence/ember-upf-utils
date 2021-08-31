import Uploader from '@upfluence/ember-upf-utils/uploader';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default class ModuleBuilder {
  constructor(session, toast) {
    Object.assign(this, { session, toast });
  }

  build(editor, element) {
    return new Module(editor, element, this.session.data.authenticated.access_token, this.toast);
  }
}

export class Module {
  constructor(editor, element, token, toast) {
    Object.assign(this, { editor, element, token, toast });

    this.editor.registerModule(this);
    this.editor.enableDragAndDrop();

    this.uploaderHeaders = {
      Scope: Configuration.scope[0]
    };
  }

  _uploaderBuilder() {
    let uploader = Uploader.create({
      ajaxSettings: {
        dataType: 'json',
        headers: {
          ...this.uploaderHeaders,
          Authorization: `Bearer ${this.token}`
        }
      },
      url: Configuration.uploaderUrl,
      allowedExtensions: 'jpg,jpeg,png,gif',
      maxSize: null
    });

    uploader
      .on('didValidationError', (error) => {
        this.toast.error(error.message || 'Your file is invalid. Please check the requirements.');
        this._removeLoading();
      })
      .on('didUpload', (element) => {
        this.editor.insertImage(element.artifact.url);
        this._removeLoading();
      });

    return uploader;
  }

  _uploadFile(file) {
    this._uploaderBuilder().upload(file, { privacy: 'public' });
  }

  _addLoading() {
    const uedit = document.querySelector('.uedit');

    let loading = document.createElement('div');
    loading.className = 'uedit__loading-image-upload fx-row fx-xalign-center';
    loading.textContent = 'Uploading your image';

    let spinner = document.createElement('div');
    spinner.className = 'spinner';
    let bounce1 = document.createElement('div');
    bounce1.className = 'bounce1';
    let bounce2 = document.createElement('div');
    bounce2.className = 'bounce2';
    let bounce3 = document.createElement('div');
    bounce3.className = 'bounce3';

    spinner.appendChild(bounce1);
    spinner.appendChild(bounce2);
    spinner.appendChild(bounce3);
    loading.appendChild(spinner);
    uedit.appendChild(loading);
  }

  _removeLoading() {
    document.querySelector('.uedit__loading-image-upload').remove();
  }

  onImageUpload(files) {
    this._addLoading();
    Array.prototype.forEach.call(files, (file) => this._uploadFile(file));
  }
}
