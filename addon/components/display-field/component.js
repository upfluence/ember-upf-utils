import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: [
    'wrapped-text',
    'profile-description__content--location',
    'text-size-4',
    'text-color-default-lighter'
  ],

  cleanedValue: Ember.computed('value', function() {
    if(this.get('value')) {
      return this.get('value')
        .replace("<<not-applicable>>", "")
        .replace("Nenjiang River, China", "")
        .replace("NenjiangRiver,China", "")
        // Formalize the spacing around comma
        .replace(new RegExp(",\s?", 'g'), ', ');
    } else {
      return "";
    }
  })
});
