import Ember from 'ember';
import TooltipActivationMixin from 'ember-upf-utils/mixins/tooltip-activation';
import layout from './template';

const { Component, inject } = Ember;

export default Component.extend(TooltipActivationMixin, {
  layout,

  _currentUser: inject.service('currentUser'),

  classNames: ['draft-display'],

  editable: false,

  uploaderHeaders: {
    'Scope': 'publishr_admin'
  },

  uploaderExtra: {
    'privacy': 'public'
  },

  init() {
    this._super();
    this.get('_currentUser').fetch().then(({ user }) => {
      this.set('currentUser', user);
    });
  },

  actions: {
    onContentChange(text) {
      this.set('draft.draftArticleAttachment.body', text);
    },

    removeComment(comment) {
      comment.destroyRecord();
    }
  }
});
