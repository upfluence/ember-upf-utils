import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['__medias-list'],

  blog: computed('profile.blog.visits', function() {
    return {
      type: 'blog',
      icon: 'fa fa-wordpress',
      communitySize: this.get('profile.blog.visits'),
      communitySlug: 'monthly visits'
    };
  }),

  facebook: computed('profile.facebook.fans', function() {
    return {
      type: 'facebook',
      icon: 'fa fa-facebook-official',
      communitySize: this.get('profile.facebook.fans'),
      communitySlug: 'fans'
    };
  }),

  twitter: computed('profile.twitter.followers', function() {
    return {
      type: 'twitter',
      icon: 'fa fa-twitter',
      communitySize: this.get('profile.twitter.followers'),
      communitySlug: 'followers'
    };
  }),

  instagram: computed('profile.instagram.followers', function() {
    return {
      type: 'instagram',
      icon: 'fa fa-instagram',
      communitySize: this.get('profile.instagram.followers'),
      communitySlug: 'followers'
    };
  }),

  tiktok: computed('profile.tiktok.followers', function() {
    return {
      type: 'tiktok',
      icon: 'upf-icon-- upf-icon--tiktok fa',
      communitySize: this.get('profile.tiktok.followers'),
      communitySlug: 'followers'
    };
  }),

  youtube: computed('profile.youtube.followers', function() {
    return {
      type: 'youtube',
      icon: 'fa fa-youtube-play',
      communitySize: this.get('profile.youtube.followers'),
      communitySlug: 'subscribers'
    };
  }),

  pinterest: computed('profile.pinterest.followers', function() {
    return {
      type: 'pinterest',
      icon: 'fa fa-pinterest-p',
      communitySize: this.get('profile.pinterest.followers'),
      communitySlug: 'followers'
    };
  }),

  twitch: computed('profile.twitch.followers', function() {
    return {
      type: 'twitch',
      icon: 'fa fa-twitch',
      communitySize: this.get('profile.twitch.followers'),
      communitySlug: 'followers'
    };
  }),

  orderedMedias: computed(
    'blog',
    'facebook',
    'twitter',
    'youtube',
    'instagram',
    'tiktok',
    'pinterest',
    'twitch',
    function() {
      return [
        this.get('blog'),
        this.get('facebook'),
        this.get('twitter'),
        this.get('youtube'),
        this.get('instagram'),
        this.get('tiktok'),
        this.get('pinterest'),
        this.get('twitch'),
      ].filter(e => e.communitySize != null) // Filter medias that are empty
        .sort((a, b) => {
          if (a.type === 'twitch') { return -1; }
          if (b.type === 'twitch') { return 1; }
          return a.communitySize - b.communitySize;
        }) // Sort them
        .reverse()
        .splice(0, 3)
        .map((media) => {
          media['model'] = this.get('profile').get(media['type']);
          return media;
        }); // Take only the 3 first elements
    }
  )
});
