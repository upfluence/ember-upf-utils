import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,

  classNames: ['table-fluid-content__row'],
  classNameBindings: ['active:table-fluid-content__row--active'],
  attributeBindings: ['style'],

  active: false,
  style: computed('cell.style', function() {
    return `border-bottom: 1px solid #efefef; ${this.get('cell.style')}`;
  }),

  mouseEnter() {
    this.set('active', true);
  },

  mouseLeave() {
    this.set('active', false);
  }
});
