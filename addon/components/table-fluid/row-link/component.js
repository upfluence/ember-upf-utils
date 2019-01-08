import LinkComponent from '@ember/routing/link-component';
import { observer } from '@ember/object';
import { run } from '@ember/runloop';
import layout from './template';

export default LinkComponent.extend({
  layout,
  tagName: 'div',
  classNames: ['__table-fluid-row', 'row-link', 'container-fluid'],
  classNameBindings: ['active:__table-fluid-row--active'],
  activeClass: 'active',

  active: false,

  _: observer('activeCell', function() {
    this.set('active', this.get('activeCell'));
    if (this.get('activeCell')) {
      run.later(() => {
        document.getElementById(this.elementId).scrollIntoView({
          block: 'center'
        });
      }, 100);
    }
  }),

  mouseEnter() {
    this.set('active', true);
  },

  mouseLeave() {
    if (!this.get('activeCell')) {
      this.set('active', false);
    }
  }
});
