import Configuration from '@upfluence/ember-upf-utils/configuration';

export default class ModuleBuilder {
  constructor(uploader, toast) {
    Object.assign(this, { uploader, toast });
  }

  build(editor, element) {
    return new Module(editor, element, this.uploader, this.toast);
  }
}

class Module {
  constructor(editor, element, uploader, toast) {
    Object.assign(this, { editor, element, uploader, toast });

    this.editor.registerModule(this);

    this.uploaderHeaders = {
      Scope: Configuration.scope[0]
    };
  }

  _uploadFile(file) {
    this.uploader.upload(
      {
        file: file,
        privacy: 'public',
        scope: 'anonymous',
        onSuccess: this._onSuccess.bind(this),
        onFailure: this._removeLoadingState
      },
      [{ type: 'filetype', value: ['image', 'gif'] }]
    );
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

  _onSuccess(artifact) {
    this.editor.insertImage(artifact.url);
    this._removeLoadingState();
  }

  onImageUpload(files) {
    this._addLoadingStates();
    Array.from(files || []).forEach((file) => this._uploadFile(file));
  }

  getOptions() {
    return { disableDragAndDrop: false };
  }
}
