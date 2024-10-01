import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import UploaderInterface from '@upfluence/oss-components/types/uploader';
import { FileArtifact } from '@upfluence/oss-components/types/uploader';

interface UEditFileUploaderSignature {
  insertFile(fileURL: string): void;
}

export default class UEditFileUploader extends Component<UEditFileUploaderSignature> {
  @service declare uploader: UploaderInterface;

  privacy: string = 'public';
  scope: string = 'anonymous';

  @tracked directURL: string | null = null;
  @tracked fileURL: string | null = null;

  @action
  onSuccessfulFileUpload(artifact: FileArtifact): void {
    this.fileURL = artifact.url;
  }

  @action
  onFileDeletion(): void {
    this.fileURL = null;
  }

  @action
  addFile(): void {
    if (this.directURL) {
      this.args.insertFile(this.directURL);
    } else if (this.fileURL) {
      this.args.insertFile(this.fileURL);
    }
    this.directURL = this.fileURL = null;
  }
}
