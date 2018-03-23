import Ember from 'ember';
import layout from './template';

const { LinkComponent } = Ember;

export default LinkComponent.extend({
  layout,
  tagName: 'div',
  classNames: ['__table-fluid-row', 'row-link', 'container-fluid'],
  classNameBindings: ['active:__table-fluid-row--active'],
  activeClass: 'active',

  active: false,

  mouseEnter() {
    this.set('active', true);
  },

  mouseLeave() {
    this.set('active', false);
  }
});
