import Ember from 'ember';
import SummerNoteComponent from 'ember-cli-summernote/components/summer-note';

export default SummerNoteComponent.extend({
  classNames: ['js-summer-note', 'upf-summer-note'],
  disabledOptions: {
    table: false,
    insert: {
      video: false,
    },
    fontname: {
      fontname: false
    },
    view: {
      fullscreen: false
    }
  },

  match: /\B{{(\w*)$/,

  availableVariables: Ember.computed('customVariables', function() {
    return ['influencer_name', 'influencer_email', 'influencer_country',
      'influencer_city', 'has_facebook', 'facebook_fans', 'facebook_name',
      'has_twitter', 'twitter_followers', 'twitter_name', 'has_youtube',
      'youtube_followers', 'youtube_name', 'has_instagram',
      'instagram_followers', 'instagram_name', 'has_pinterest',
      'pinterest_followers', 'pinterest_name', 'has_blog', 'blog_visits',
      'blog_url', 'blog_name', 'largest_social_media_type',
      'largest_social_media_name', 'largest_social_media_community_size'
    ].concat(this.get('customVariables') || []).uniq();
  }),

  didInsertElement: function() {
    let availableVariables = this.get('availableVariables');

    this.$('#summernote').summernote({
      disabledOptions: this.get('disabledOptions'),
      height: this.get('height'),
      dialogsInBody: true,
      hint: {
        match: this.get('match'),
        search: (keyword, callback) => {
          callback(availableVariables.filter((item) => {
            if (this.get('hintDisabled')) { return false; }
            return item.indexOf(keyword) === 0;
          }));
        },
        content: (item) => {
          return `{{${item}}}`;
        }
      }
    });
    this.$('.dropdown-toggle').dropdown();

    this.$().on('clear', () => this.$('#summernote').summernote('code', ''));

    this._super();
  }
});
