import Ember from 'ember';
import SummerNoteComponent from 'ember-cli-summernote/components/summer-note';

const { computed } = Ember;

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

  availableVariables: computed('customVariables', function() {
    return (this.get('customVariables') || []).uniq();
  }),

  didInsertElement: function() {
    var _toolbar = this.getToolbarOptions(this.get('toolbarOptions'));
    var _customButtons = {};

    let availableVariables = this.get('availableVariables');

    if (this.get('customButtons')) {
      this.get('customButtons').forEach(function (item, i) {
        _customButtons['myButton' + i] = item;
        _toolbar.push(['myButton' + i, ['myButton' + i]]);
      });
    }

    this.$('#summernote').summernote({
      disabledOptions: this.get('disabledOptions'),
      height: this.get('height'),
      dialogsInBody: true,
      toolbar: _toolbar,
      buttons: _customButtons,
      hint: {
        match: this.get('match'),
        search: (keyword, callback) => {
          callback(this.get('availableVariables').filter((item) => {
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
