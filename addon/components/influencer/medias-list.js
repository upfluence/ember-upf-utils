import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['__medias-list'],

  blog: computed('profile.blog.visits', function () {
    return {
      type: 'blog',
      icon: 'wordpress',
      communitySize: this.get('profile.blog.visits'),
      communitySlug: 'monthly visits'
    };
  }),

  facebook: computed('profile.facebook.fans', function () {
    return {
      type: 'facebook',
      icon: 'facebook-f',
      communitySize: this.get('profile.facebook.fans'),
      communitySlug: 'fans'
    };
  }),

  twitter: computed('profile.twitter.followers', function () {
    return {
      type: 'twitter',
      icon: 'twitter',
      communitySize: this.get('profile.twitter.followers'),
      communitySlug: 'followers'
    };
  }),

  instagram: computed('profile.instagram.followers', function () {
    return {
      type: 'instagram',
      icon: 'instagram',
      communitySize: this.get('profile.instagram.followers'),
      communitySlug: 'followers'
    };
  }),

  tiktok: computed('profile.tiktok.followers', function () {
    return {
      type: 'tiktok',
      icon: 'tiktok',
      communitySize: this.get('profile.tiktok.followers'),
      communitySlug: 'fans'
    };
  }),

  youtube: computed('profile.youtube.followers', function () {
    return {
      type: 'youtube',
      icon: 'youtube',
      communitySize: this.get('profile.youtube.followers'),
      communitySlug: 'subscribers'
    };
  }),

  pinterest: computed('profile.pinterest.followers', function () {
    return {
      type: 'pinterest',
      icon: 'pinterest-p',
      communitySize: this.get('profile.pinterest.followers'),
      communitySlug: 'followers'
    };
  }),

  twitch: computed('profile.twitch.followers', function () {
    return {
      type: 'twitch',
      icon: 'twitch',
      communitySize: this.get('profile.twitch.followers'),
      communitySlug: 'followers'
    };
  }),

  orderedMedias: computed(
    'blog',
    'facebook',
    'instagram',
    'pinterest',
    'profile',
    'tiktok',
    'twitch',
    'twitter',
    'youtube',
    function () {
      return [
        this.blog,
        this.facebook,
        this.twitter,
        this.youtube,
        this.instagram,
        this.tiktok,
        this.pinterest,
        this.twitch
      ]
        .filter((e) => e.communitySize != null) // Filter medias that are empty
        .sort((a, b) => {
          if (a.type === 'twitch') {
            return -1;
          }
          if (b.type === 'twitch') {
            return 1;
          }
          return a.communitySize - b.communitySize;
        }) // Sort them
        .reverse()
        .splice(0, 3)
        .map((media) => {
          media['model'] = this.profile.get(media['type']);
          return media;
        }); // Take only the 3 first elements
    }
  )
});
