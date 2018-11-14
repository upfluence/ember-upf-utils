import Ember from 'ember';
import TooltipActivationMixin from 'ember-upf-utils/mixins/tooltip-activation';
import layout from './template';

const { Component, computed } = Ember;

export default Component.extend(TooltipActivationMixin, {
  layout,

  classNames: ['draft-display'],
  classNameBindings: ['editable:draft-display--editable'],

  editable: false,

  draftDisplayComponent: computed('draft.draftAttachableType', function() {
    switch (this.get('draft.draftAttachableType')) {
      case 'draft-article-attachment':
        return 'publishr/draft-display/article';
      case 'draft-youtube-video-attachment':
        return 'publishr/draft-display/youtube';
      case 'draft-media-collection-attachment':
        return 'publishr/draft-display/medias'
    }
  })
});
