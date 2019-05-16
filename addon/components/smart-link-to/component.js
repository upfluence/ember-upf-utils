import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,

  cssClass: '',
  target: '',
  tagName: '',

  isRoute: computed('link', function() {
    return getOwner(this).hasRegistration(`route:${this.link}`);
  })
});
