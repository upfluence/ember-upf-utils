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

  savable: computed.notEmpty('comment.text'),

  init() {
    this.set('comment', this.get('store').createRecord('draft-comment'));
    this._super();
  },

  actions: {
    addComment() {
      this.get('draft.draftComments').pushObject(this.get('comment'));
      this.get('draft').save();
    }
  }
});
