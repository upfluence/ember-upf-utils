import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';

export default Helper.extend({
  i18n: service(),

  compute(params) {
    let [error] = params;

    if (typeof error === 'string') {
      return error;
    }

    return this.get('i18n').t(`${error.resource}.${error.field}.${error.code}`);
  }
});
