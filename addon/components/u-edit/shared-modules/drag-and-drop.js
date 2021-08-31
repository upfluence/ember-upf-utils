import Uploader from '@upfluence/ember-upf-utils/uploader';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default class ModuleBuilder {
  constructor(session, toast) {
    this.session = session;
    this.toast = toast;
  }

  build(editor, element) {
    return new Module(editor, element, this.session.data.authenticated.access_token, this.toast);
  }
}

export class Module {
  constructor(editor, element, token, toast) {
    Object.assign(this, { editor, element, token, toast });

    this.editor.registerModule(this);

    this.uploaderHeaders = {
      Scope: Configuration.scope[0]
    };
  }

  uploaderBuilder() {
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
        this.toast.error(error.message);
      })
      .on('didUpload', (element) => {
        this.editor.insertImage(element.artifact.url);
      });

    return uploader;
  }

  uploadFile(file) {
    this.uploaderBuilder().upload(file, { privacy: 'public' });
  }

  onImageUpload(files) {
    Array.prototype.forEach.call(files, (file) => this.uploadFile(file));
  }
}
