import Ember from 'ember';
import SummerNoteComponent from 'ember-cli-summernote/components/summer-note';
import EmberUploader from 'ember-uploader';
import Configuration from 'ember-upf-utils/configuration';

const {
  computed,
  get,
  inject
} = Ember;

export default SummerNoteComponent.extend({
  session: inject.service(),

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
  uploaderHeaders: {},
  uploaderOptions: computed('uploaderHeaders', function() {
    /* jshint ignore:start */
    return {
      ajaxSettings: {
        dataType: 'json',
        headers: {
          ...this.get('uploaderHeaders'),
          'Authorization':
            `Bearer ${this.get('session.data.authenticated.access_token')}`
        }
      },
      url: Configuration.uploaderUrl
    };
    /* jshint ignore:end */
  }),

  match: /\B{{(\w*)$/,

  availableVariables: computed('customVariables', function() {
    return (this.get('customVariables') || []).uniq();
  }),

  didInsertElement: function() {
    let _self = this;
    let _toolbar = this.getToolbarOptions(this.get('toolbarOptions'));
    let _callbacks      = get(this, 'callbacks');
    _callbacks.onChange = this.get('onChange').bind(this);

    this.$('#summernote').summernote({
      toolbar: _toolbar,
      height: this.get('height'),
      dialogsInBody: true,
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
      },
      callbacks: {
        ..._callbacks,
        onImageUpload(files) {
          let uploader = EmberUploader.Uploader.create(
            _self.get('uploaderOptions')
          );
          uploader
            .on('didUpload', (e) => {
              self.$('#summernote').summernote('insertImage', e.artifact.url);
            });
          Array.prototype.forEach.call(files, (file) => {
            uploader.upload(file, { privacy: 'public' });
          });
        }
      }
    });

    this.$('.dropdown-toggle').dropdown();

    this.$().on('clear', () => this.$('#summernote').summernote('code', ''));
    this._super();
  }
});
