import Ember from 'ember';
import SummerNoteComponent from 'ember-cli-summernote/components/summer-note';

const {
  computed,
  get
} = Ember;

export default SummerNoteComponent.extend({
  classNames: ['js-summer-note', 'upf-summer-note'],
  toolbarOptions: {
    font: {
      bold: true,
      italic: true,
      underline: true,
      superscript: false,
      subscript: false,
    },
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
    let _toolbar = this.getToolbarOptions(this.get('toolbarOptions'));
    let _callbacks      = get(this, 'callbacks');
    _callbacks.onChange = this.get('onChange').bind(this);

    this.$('#summernote').summernote({
      disableDragAndDrop: true,
      toolbar: _toolbar,
      height: this.get('height'),
      dialogsInBody: true,
      callbacks: _callbacks,
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
