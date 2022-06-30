import { inject as service } from '@ember/service';
import { notEmpty } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  _currentUser: service('currentUser'),
  store: service(),
  toast: service(),

  classNames: ['draft-display__comments'],

  commentText: '',
  savableComment: notEmpty('commentText'),
  savingComment: false,

  init() {
    this._super();
    this._currentUser.fetch().then(({ user }) => {
      this.set('currentUser', user);
    });
  },

  actions: {
    addComment() {
      this.set('savingComment', true);
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
        .finally(() => this.set('savingComment', false));
    },

    removeComment(comment) {
      comment.destroyRecord();
    }
  }
});
