import Ember from 'ember';

export default Ember.Service.extend({
  meta: {},

  facebookMeta: ( function() {
    return Ember.Object.create({
      erMin: this.get('meta.statsErFacebookMin'),
      erMax: this.get('meta.statsErFacebookMax')
    });
  }).property('meta.statsErFacebookMin', 'meta.statsErFacebookMax'),

  twitterMeta: ( function() {
    return Ember.Object.create({
      erMin: this.get('meta.statsErTwitterMin'),
      erMax: this.get('meta.statsErTwitterMax')
    });
  }).property('meta.statsErTwitterMin', 'meta.statsErTwitterMax'),

  pinterestMeta: ( function() {
    return Ember.Object.create({
      erMin: this.get('meta.statsErPinterestMin'),
      erMax: this.get('meta.statsErPinterestMax')
    });
  }).property('meta.statsErPinterestMin', 'meta.statsErPinterestMax'),

  youtubeMeta: ( function() {
    return Ember.Object.create({
      erMin: this.get('meta.statsErYoutubeMin'),
      erMax: this.get('meta.statsErYoutubeMax')
    });
  }).property('meta.statsErYoutubeMin', 'meta.statsErYoutubeMax'),

  instagramMeta: ( function() {
    return Ember.Object.create({
      erMin: this.get('meta.statsErInstagramMin'),
      erMax: this.get('meta.statsErInstagramMax')
    });
  }).property('meta.statsErInstagramMin', 'meta.statsErInstagramMax')
});
