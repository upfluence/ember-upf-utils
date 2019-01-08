import Component from '@ember/component';
import layout from '../templates/components/currency-chooser';
import isoCodes from '../utils/iso-codes';

export default Component.extend({
  layout,
  classNames: ['upf-currency-chooser'],
  isoCodes: isoCodes,

  actions: {
    updateCurrency(currency) {
      this.set('value', currency);
    }
  }
});
