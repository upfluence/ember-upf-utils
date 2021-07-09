import UEDitFileUploader from '@upfluence/ember-upf-utils/components/u-edit/shared-triggers/modals/file-uploader';

export default class UEditPDFUploadComponent extends UEDitFileUploader {
  allowedExtensions = 'pdf';
  titleKey = 'pdf';
}
