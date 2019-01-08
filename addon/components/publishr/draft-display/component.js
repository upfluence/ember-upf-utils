import Component from '@ember/component';
import { computed } from '@ember/object';
import TooltipActivationMixin from '@upfluence/ember-upf-utils/mixins/tooltip-activation';
import layout from './template';

export default Component.extend(TooltipActivationMixin, {
  layout,

  classNames: ['draft-display'],
  classNameBindings: [
    'editable:draft-display--editable',
    'contentOnly:draft-display--content-only'
  ],

  editable: false,
  contentOnly: false,

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
