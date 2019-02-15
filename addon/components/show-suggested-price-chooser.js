import Component from '@ember/component';
import layout from '../templates/components/show-suggested-price-chooser';
import state from '../utils/select-state-suggested-price';

export default Component.extend({
  layout,
  classNames: ['upf-show-suggested-price-chooser'],
  isoCodes: state,

  actions: {
    updateShowSuggestedPrice(new_state) {
      this.set('value', new_state);
    }
  }
});