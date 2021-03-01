import EmberObject, { computed } from '@ember/object';
import Service from '@ember/service';

export default Service.extend({
  meta: {},

  facebookMeta: computed('meta.{statsErFacebookMin,statsErFacebookMax}', function() {
    return EmberObject.create({
      erMin: this.get('meta.statsErFacebookMin'),
      erMax: this.get('meta.statsErFacebookMax')
    });
  }),

  twitterMeta: computed('meta.{statsErTwitterMin,statsErTwitterMax}', function() {
    return EmberObject.create({
      erMin: this.get('meta.statsErTwitterMin'),
      erMax: this.get('meta.statsErTwitterMax')
    });
  }),

  pinterestMeta: computed('meta.{statsErPinterestMin,statsErPinterestMax}', function() {
    return EmberObject.create({
      erMin: this.get('meta.statsErPinterestMin'),
      erMax: this.get('meta.statsErPinterestMax')
    });
  }),

  youtubeMeta: computed('meta.{meta.statsErYoutubeMax,statsErYoutubeMax,statsErYoutubeMin}', function() {
    return EmberObject.create({
      erMin: this.get('meta.statsErYoutubeMin'),
      erMax: this.get('meta.statsErYoutubeMax')
    });
  }),

  instagramMeta: computed('meta.{meta.statsErInstagramMax,statsErInstagramMax,statsErInstagramMin}', function() {
    return EmberObject.create({
      erMin: this.get('meta.statsErInstagramMin'),
      erMax: this.get('meta.statsErInstagramMax')
    });
  })
});
