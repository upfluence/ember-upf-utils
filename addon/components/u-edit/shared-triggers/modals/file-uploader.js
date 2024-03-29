import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class UEditFileUploader extends Component {
  uploaderHeaders = Object.freeze({ Scope: 'anonymous' });
  uploaderExtra = Object.freeze({ privacy: 'public' });

  @tracked file = {};
  @tracked droppedFile = {};
  @tracked processing = false;
  @tracked directURL;
  @tracked fileURL;

  @action
  onDropFiles(files) {
    this.droppedFile = files[0];
  }

  @action
  beforeUpload(file) {
    this.file = file;
    this.processing = true;
  }

  @action
  didUploadError() {}

  @action
  didUpload({ artifact }) {
    this.processing = false;
    this.fileURL = artifact.url;
  }

  @action
  addFile() {
    this.args.insertFile(this.directURL || this.fileURL);
    this.directURL = this.fileURL = null;
  }
}
