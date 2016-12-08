import Ember from 'ember';
import layout from '../templates/components/new-account-form';

export default Ember.Component.extend({
  layout,

  name: Ember.computed('model.firstName', 'model.lastName', {
    get() {
      if (Ember.isEmpty(this.get('model.firstName')) && Ember.isEmpty(this.get('model.lastName'))) {
        return null;
      }

      return `${this.get('model.firstName') || ''} ${this.get('model.lastName') || ''}`;
    },

    set(_, value) {
      let splittedName = value.split(" ");
      this.set('model.firstName', splittedName[0]);
      this.set('model.lastName', splittedName.slice(1).join(" "));
    }
  })
});
