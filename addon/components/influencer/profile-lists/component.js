import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  layout,

  tagName: 'a',
  classNames: ['profile-lists'],

  maxDisplay: 5,

  content: computed('profile.lists', function() {
    return this.get('profile.lists').slice(
      0, this.get('maxDisplay')
    ).map((list) => {
      return `<div class='profile-lists__list'>${list.get('name')}</div>`;
    }).join('');
  }),

  didInsertElement() {
    this.$().popover({
      html: true,
      trigger: 'hover',
      placement: 'bottom',
      content: this.get('content')
    })
  }
});
