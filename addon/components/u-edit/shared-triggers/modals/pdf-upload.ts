import UEDitFileUploader from '@upfluence/ember-upf-utils/components/u-edit/shared-triggers/modals/file-uploader';
import { FileValidator } from '@upfluence/oss-components/types/uploader';

export default class UEditPDFUploadComponent extends UEDitFileUploader {
  titleKey: string = 'pdf';
  fileUploadRules: FileValidator[] = [
    {
      type: 'filetype',
      value: ['pdf']
    }
  ];
}
