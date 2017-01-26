import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__medias-list'],

  blog: Ember.computed('model', function() {
    return {
      type: 'blog',
      icon: "pencil-square-o",
      communitySize: this.get('profile.blog.visits'),
      communitySlug: '/month'
    };
  }),

  facebook: Ember.computed('model', function() {
    return {
      type: 'facebook',
      icon: "facebook-official",
      communitySize: this.get('profile.facebook.fans'),
      communitySlug: 'fans'
    };
  }),

  twitter: Ember.computed('model', function() {
    return {
      type: 'twitter',
      icon: "twitter",
      communitySize: this.get('profile.twitter.followers'),
      communitySlug: 'followers'
    };
  }),

  instagram: Ember.computed('model', function() {
    return {
      type: 'instagram',
      icon: "instagram",
      communitySize: this.get('profile.instagram.followers'),
      communitySlug: 'followers'
    };
  }),

  youtube: Ember.computed('model', function() {
    return {
      type: 'youtube',
      icon: "youtube-play",
      communitySize: this.get('profile.youtube.followers'),
      communitySlug: 'subscribers'
    };
  }),

  pinterest: Ember.computed('model', function() {
    return {
      type: 'pinterest',
      icon: "pinterest-p",
      communitySize: this.get('profile.pinterest.followers'),
      communitySlug: 'followers'
    };
  }),

  medias: Ember.computed(
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
        .splice(0, 5); // Take only the 5 first elements
    })
});
