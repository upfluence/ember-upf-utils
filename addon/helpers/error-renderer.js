import Ember from 'ember';

export default Ember.Helper.extend({
  i18n: Ember.inject.service(),

  compute(params) {
    let [error] = params;

    if (typeof error === 'string') {
      return error;
    }

    return this.get('i18n').t(`${error.resource}.${error.field}.${error.code}`);
  }
});