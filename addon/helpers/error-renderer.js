import Helper from '@ember/component/helper';
import { service } from '@ember/service';

export default Helper.extend({
  intl: service(),

  compute(params) {
    let [error] = params;

    if (typeof error === 'string') {
      return error;
    }

    return this.intl.t(`${error.resource}.${error.field}.${error.code}`);
  }
});
