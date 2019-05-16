import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import layout from './template';

export default Component.extend({
  layout,

  router: service(),

  cssClass: '',
  target: '',
  tagName: '',

  isRoute: computed('link', function() {
    return getOwner(this).hasRegistration(`route:${this.link}`);
  })
});
