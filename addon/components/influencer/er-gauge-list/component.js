import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,

  blog: Ember.computed('medias', function() {
    return {
      data: this.get('medias.blog'),
      type: 'blog',
      icon: "share",
      meta: this.get('meta.blogMeta'),
      communitySize: this.get('medias.blog.visits')
    };
  }),

  facebook: Ember.computed('medias', function() {
    return {
      data: this.get('medias.facebook'),
      type: 'facebook',
      icon: "facebook",
      meta: this.get('meta.facebookMeta'),
      communitySize: this.get('medias.facebook.communitySize')
    };
  }),

  twitter: Ember.computed('medias', function() {
    return {
      data: this.get('medias.twitter'),
      type: 'twitter',
      icon: "twitter",
      meta: this.get('meta.twitterMeta'),
      communitySize: this.get('medias.twitter.communitySize')
    };
  }),

  instagram: Ember.computed('medias', function() {
    return {
      data: this.get('medias.instagram'),
      type: 'instagram',
      icon: "instagram",
      meta: this.get('meta.instagramMeta'),
      communitySize: this.get('medias.instagram.communitySize')
    };
  }),

  youtube: Ember.computed('medias', function() {
    return {
      data: this.get('medias.youtube'),
      type: 'youtube',
      icon: "youtube-play",
      meta: this.get('meta.youtubeMeta'),
      communitySize: this.get('medias.youtube.communitySize')
    };
  }),

  pinterest: Ember.computed('medias', function() {
    return {
      data: this.get('medias.pinterest'),
      type: 'pinterest',
      icon: "pinterest-p",
      meta: this.get('meta.pinterestMeta'),
      communitySize: this.get('medias.pinterest.communitySize')
    };
  }),

  orderedMedias: Ember.computed(
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
      ].filter(e => e.data != null) // Filter medias that are empty
        .sort((a, b) => a.communitySize - b.communitySize) // Sort them
        .reverse()
        .splice(0, 5); // Take only the 5 first elements
    })
});
