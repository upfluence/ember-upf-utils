import Mixin from '@ember/object/mixin';
import { scheduleOnce } from '@ember/runloop';

export default Mixin.create({
  activate() {
    scheduleOnce('afterRender', this, () => {
      window.scrollTo(0, 0);
    });
  }
});
