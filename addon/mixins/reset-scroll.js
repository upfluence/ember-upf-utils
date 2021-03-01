import Mixin from '@ember/object/mixin';
import { scheduleOnce } from '@ember/runloop';

export default Mixin.create({
  _scrollTop() {
    window.scrollTo(0, 0);
  },

  activate() {
    scheduleOnce('afterRender', this, this._scrollTop);
  }
});
