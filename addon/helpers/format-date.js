/* global moment */
import { helper as buildHelper } from '@ember/component/helper';

export function formatDate(params) {
  let rawDate = params[0];
  let format = params[1];
  return moment(rawDate).format(format);
}

export default buildHelper(formatDate);
