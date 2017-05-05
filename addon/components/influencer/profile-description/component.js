import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['profile-description'],
  isSelectable: true,
  toggleAction: null,
  selected: null,

  // Avoid BC break with profile.selected
  _selected: Ember.computed('selected', 'profile.selected', {
    get() {
      return this.get('selected') || this.get('profile.selected');
    },
    set(_, value) {
      //selected not set
      if (this.get('selected') === null) {
        this.set('profile.selected', value);
      } else {
        this.set('selected', value);
      }

      return value;
    }
  })
});
