import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';

export default Mixin.create({
  activityNotifier: service(),

  init() {
    this._super();
    run.later(this, () => this.get('activityNotifier').start(), 3000);
  }
});
