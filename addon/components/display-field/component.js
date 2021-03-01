import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  classNames: [
    'wrapped-text',
    'profile-description__content--location',
    'text-size-4',
    'text-color-default-lighter'
  ],

  /* eslint-disable no-useless-escape */
  cleanedValue: computed('value', function() {
    if(this.value) {
      return this.value
        .replace("<<not-applicable>>", "")
        .replace("Nenjiang River, China", "")
        .replace("NenjiangRiver,China", "")
        // Formalize the spacing around comma
        .replace(new RegExp(",\s?", 'g'), ', ');
    } else {
      return "";
    }
  })
  /* eslint-enable no-useless-escape */
});
