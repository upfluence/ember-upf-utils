import Uploader from '@upfluence/ember-upf-utils/uploader';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default class ModuleBuilder {
  constructor(session, toast) {
    Object.assign(this, { session, toast });
  }

  build(editor, element) {
    return new Module(editor, element, this.session, this.toast);
  }
}

class Module {
  constructor(editor, element, session, toast) {
    Object.assign(this, { editor, element, session, toast });

    this.editor.registerModule(this);

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
          Authorization: `Bearer ${this.session.data.authenticated.access_token}`
        }
      },
      url: Configuration.uploaderUrl,
      allowedExtensions: 'jpg,jpeg,png,gif',
      maxSize: null
    });

    uploader
      .on('didValidationError', (error) => {
        this.toast.error(error || 'Your file is invalid. Please check the requirements.');
        this._removeLoadingState();
      })
      .on('didUpload', (element) => {
        this.editor.insertImage(element.artifact.url);
        this._removeLoadingState();
      });

    return uploader;
  }

  _uploadFile(file) {
    this._uploaderBuilder().upload(file, { privacy: 'public' });
  }

  _createLoadingStates() {
    const uedit = document.querySelector('.uedit');

    let loading = document.createElement('div');
    loading.className = 'uedit__loading-image-upload uedit__loading-image-upload--visible fx-row fx-xalign-center';
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

  _addLoadingStates() {
    let loadingStates = document.querySelector('.uedit__loading-image-upload');

    if (loadingStates) {
      loadingStates.classList.remove('uedit__loading-image-upload--hidden');
    } else {
      this._createLoadingStates();
    }
  }

  _removeLoadingState() {
    document.querySelector('.uedit__loading-image-upload').classList.add('uedit__loading-image-upload--hidden');
  }

  onImageUpload(files) {
    this._addLoadingStates();
    Array.prototype.forEach.call(files, (file) => this._uploadFile(file));
  }

  getOptions() {
    return { disableDragAndDrop: false };
  }
}
