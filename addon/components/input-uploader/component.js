import { isEmpty } from '@ember/utils';
import FileField from 'ember-uploader/components/file-field';

export default FileField.extend({
  filesDidChange(files) {
    if (!isEmpty(files) && this.onFile) {
      this.onFile(files[0]);
    }
  }
});
