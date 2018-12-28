import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  selectionStorage: service(),

  selected: computed('selectionStorage.storageScope', {
    get() {
      return this.get('selectionStorage').has(this.get('id'));
    },

    set(_, v) {
      if (v === null) {
        return v;
      }

      if (v) {
        this.get('selectionStorage').add(this.get('id'));
      } else {
        this.get('selectionStorage').remove(this.get('id'));
      }

      return v;
    }
  })
});
