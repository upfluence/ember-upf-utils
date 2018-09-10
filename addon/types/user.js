import Ember from 'ember';

const { computed } = Ember;

export default Ember.Object.extend({
  fullName: computed('first_name', 'last_name', function() {
    let { first_name, last_name } = this;
    if (first_name || last_name) {
      return  `${first_name} ${last_name}`;
    }

    return this.set('fullName', 'Anonymous User');
  })
});
