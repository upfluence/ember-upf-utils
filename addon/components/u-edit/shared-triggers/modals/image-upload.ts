import { FileValidator } from '@upfluence/oss-components/addon/types/uploader';

import UEDitFileUploader from '@upfluence/ember-upf-utils/components/u-edit/shared-triggers/modals/file-uploader';

export default class UEditImageUploadComponent extends UEDitFileUploader {
  titleKey = 'image';
  fileUploadRules: FileValidator[] = [
    {
      type: 'filetype',
      value: ['image', 'gif']
    }
  ];
}
