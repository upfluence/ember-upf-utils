import Ember from 'ember';
import TooltipActivationMixin from 'ember-upf-utils/mixins/tooltip-activation';
import layout from './template';

const { Component } = Ember;

export default Component.extend(TooltipActivationMixin, {
  layout,

  classNames: ['draft-display'],

  editable: false,

  uploaderHeaders: {
    'Scope': 'publishr_admin'
  },

  uploaderExtra: {
    'privacy': 'public'
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
