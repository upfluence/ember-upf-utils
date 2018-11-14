import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed,
  inject
} = Ember;

export default Component.extend({
  layout,

  _currentUser: inject.service('currentUser'),
  store: inject.service(),
  toast: inject.service(),

  classNames: ['draft-display__comments'],

  commentText: '',
  savableComment: computed.notEmpty('commentText'),

  init() {
    this._super();
    this.get('_currentUser').fetch().then(({ user }) => {
      this.set('currentUser', user);
    });
  },

  actions: {
    addComment() {
      this.get('store').createRecord('draft-comment', {
        draft: this.get('draft'),
        text: this.get('commentText')
      }).save().then(() => {
        this.set('commentText', '')
      }).catch(() => {
        this.get('toast').error(
          'Something wrong happened trying to add your commment.'
        );
      });
    },

    removeComment(comment) {
      comment.destroyRecord();
    }
  }
});
