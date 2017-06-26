import Ember from 'ember';
import layout from './template';

export default Ember.LinkComponent.extend({
  layout,
  tagName: 'div',
  classNames: ['__table-fluid-row', 'row-link', 'container-fluid'],
  activeClass: 'active',

  _invoke(event) {
    Ember.run.throttle(this, this._delayed, () => {
      this._super(event);
    }, 1000);
  },

  _delayed(cb) {
    cb();
  }
});
