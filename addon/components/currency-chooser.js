import Component from '@ember/component';
import isoCodes from '../utils/iso-codes';

export default Component.extend({
  classNames: ['upf-currency-chooser'],
  isoCodes: isoCodes,

  actions: {
    updateCurrency(currency) {
      this.set('value', currency);
    }
  }
});
