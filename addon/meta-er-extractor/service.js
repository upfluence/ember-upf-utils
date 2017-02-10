import Ember from 'ember';

export default Ember.Service.extend({
  meta: {},

  facebookMeta: Ember.computed('meta.statsErFacebookMin', 'meta.statsErFacebookMax', function() {
    return Ember.Object.create({
      erMin: this.get('meta.statsErFacebookMin'),
      erMax: this.get('meta.statsErFacebookMax')
    });
  }),

  twitterMeta: Ember.computed('meta.statsErTwitterMin', 'meta.statsErTwitterMax', function() {
    return Ember.Object.create({
      erMin: this.get('meta.statsErTwitterMin'),
      erMax: this.get('meta.statsErTwitterMax')
    });
  }),

  pinterestMeta: Ember.computed('meta.statsErPinterestMin', 'meta.statsErPinterestMax', function() {
    return Ember.Object.create({
      erMin: this.get('meta.statsErPinterestMin'),
      erMax: this.get('meta.statsErPinterestMax')
    });
  }),

  youtubeMeta: Ember.computed('meta.statsErYoutubeMin', 'meta.statsErYoutubeMax', function() {
    return Ember.Object.create({
      erMin: this.get('meta.statsErYoutubeMin'),
      erMax: this.get('meta.statsErYoutubeMax')
    });
  }),

  instagramMeta: Ember.computed('meta.statsErInstagramMin', 'meta.statsErInstagramMax', function() {
    return Ember.Object.create({
      erMin: this.get('meta.statsErInstagramMin'),
      erMax: this.get('meta.statsErInstagramMax')
    });
  })
});
