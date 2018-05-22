import Ember from 'ember';
import layout from './template';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  layout,
  classNames: ['__medias-list'],

  blog: computed('profile.blog.visits', function() {
    return {
      type: 'blog',
      icon: 'wordpress',
      communitySize: this.get('profile.blog.visits'),
      communitySlug: 'monthly visits',
      meta: this.get('meta.blogMeta')
    };
  }),

  facebook: computed('profile.facebook.fans', function() {
    return {
      type: 'facebook',
      icon: 'facebook-official',
      communitySize: this.get('profile.facebook.fans'),
      communitySlug: 'fans',
      meta: this.get('meta.facebookMeta')
    };
  }),

  twitter: computed('profile.twitter.followers', function() {
    return {
      type: 'twitter',
      icon: 'twitter',
      communitySize: this.get('profile.twitter.followers'),
      communitySlug: 'followers',
      meta: this.get('meta.twitterMeta')
    };
  }),

  instagram: computed('profile.instagram.followers', function() {
    return {
      type: 'instagram',
      icon: 'instagram',
      communitySize: this.get('profile.instagram.followers'),
      communitySlug: 'followers',
      meta: this.get('meta.instagramMeta')
    };
  }),

  youtube: computed('profile.youtube.followers', function() {
    return {
      type: 'youtube',
      icon: 'youtube-play',
      communitySize: this.get('profile.youtube.followers'),
      communitySlug: 'subscribers',
      meta: this.get('meta.youtubeMeta')
    };
  }),

  pinterest: computed('profile.pinterest.followers', function() {
    return {
      type: 'pinterest',
      icon: 'pinterest-p',
      communitySize: this.get('profile.pinterest.followers'),
      communitySlug: 'followers',
      meta: this.get('meta.pinterestMeta')
    };
  }),

  orderedMedias: computed(
    'blog',
    'facebook',
    'twitter',
    'youtube',
    'instagram',
    'pinterest',
    function() {
      return [
        this.get('blog'),
        this.get('facebook'),
        this.get('twitter'),
        this.get('youtube'),
        this.get('instagram'),
        this.get('pinterest')
      ].filter(e => e.communitySize != null) // Filter medias that are empty
        .sort((a, b) => a.communitySize - b.communitySize) // Sort them
        .reverse()
        .splice(0, 3)
        .map((media) => {
          media['model'] = this.get('profile').get(media['type']);
          return media;
        }); // Take only the 3 first elements
    }),



    position: computed(
      'meta.erMin',
      'meta.erMax',
      'media.averageFacebookShares', function() {
        if (this.get('media.engagement_rate')) {
          return (this.get('media.engagement_rate') - (this.get('meta.erMin') / (this.get('meta.erMax') - this.get('meta.erMin')))) * 2000;
        } else if (this.get('media.averageFacebookShares')) {
          return this.get('media.averageFacebookShares') * 2;
        } else {
          return 0;
        }
      }
    )
});
