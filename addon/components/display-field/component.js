import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
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
