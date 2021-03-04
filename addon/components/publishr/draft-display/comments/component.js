import { inject as service } from '@ember/service';
import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  _currentUser: service('currentUser'),
  store: service(),
  toast: service(),

  classNames: ['draft-display__comments'],

  commentText: '',
  savableComment: notEmpty('commentText'),

  init() {
    this._super();
    this._currentUser.fetch().then(({ user }) => {
      this.set('currentUser', user);
    });
  },

  actions: {
    addComment(_, defer) {
      this.store
        .createRecord('draft-comment', {
          draft: this.draft,
          text: this.commentText
        })
        .save()
        .then(() => {
          this.set('commentText', '');
        })
        .catch(() => {
          this.toast.error('Something wrong happened trying to add your commment.');
        })
        .finally(() => defer.resolve());
    },

    removeComment(comment) {
      comment.destroyRecord();
    }
  }
});
