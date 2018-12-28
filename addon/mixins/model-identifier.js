import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  identifier: computed('id', function() {
    let id = this.get('id');

    if (id) {
      return id;
    }

    // Return the string representation of the model
    // It's give something like that: <facade-web@model:list::ember2506:null>
    // "null" is replaced by the id when there is one.
    // This representation is useful for fresh model (no saving) without id but with the need
    // of an unique value
    return this.toString();
  })
});
