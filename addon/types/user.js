import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  fullName: computed('first_name', 'last_name', function() {
    let { first_name, last_name } = this;
    if (first_name || last_name) {
      return  `${first_name} ${last_name}`;
    }

    return this.set('fullName', 'Anonymous User');
  })
});
