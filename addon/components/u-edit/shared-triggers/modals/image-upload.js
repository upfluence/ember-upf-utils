import UEDitFileUploader from '@upfluence/ember-upf-utils/components/u-edit/shared-triggers/modals/file-uploader';

export default class UEditImageUploadComponent extends UEDitFileUploader {
  allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'].join(',');
  titleKey = 'image';
}
