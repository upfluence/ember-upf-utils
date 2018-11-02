import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  inject
} = Ember;

const ENTER_KEY = 13;

export default Component.extend({
  layout,

  store: inject.service(),

  classNames: ['draft-display__add-comment'],

  commentText: '',
  savable: computed.notEmpty('commentText'),

  actions: {
    addComment() {
      this.get('store').createRecord('draft-comment', {
        draft: this.get('draft'),
        text: this.get('commentText')
      }).save().then(() => this.set('commentText', ''));
    }
  }
});
