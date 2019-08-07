import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagNames: ['li'],
  classNames: ['team--selected']
});
