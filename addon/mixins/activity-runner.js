import Mixin from '@ember/object/mixin';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Mixin.create({
  activityNotifier: service(),

  init() {
    this._super();
    later(this, () => this.activityNotifier.start(), 3000);
  }
});
