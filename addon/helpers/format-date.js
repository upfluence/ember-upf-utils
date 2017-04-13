import Ember from 'ember';

export function formatDate(params) {
  let rawDate = params[0];
  let format = params[1];
  return moment(rawDate).format(format);
}

export default Ember.Helper.helper(formatDate);
