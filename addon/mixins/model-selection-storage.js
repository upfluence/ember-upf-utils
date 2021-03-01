import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  selectionStorage: service(),

  selected: computed('id', 'selectionStorage.storageScope', {
    get() {
      return this.selectionStorage.has(this.id);
    },

    set(_, v) {
      if (v === null) {
        return v;
      }

      if (v) {
        this.selectionStorage.add(this.id);
      } else {
        this.selectionStorage.remove(this.id);
      }

      return v;
    }
  })
});
