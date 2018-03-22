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
      //disableDragAndDrop: true,
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
      },
      callbacks: {
        onImageUpload(files, editor, $editable) {
          console.log('Uploading...');
          console.log(files);
          let headers = {};
          let options = {
            ajaxSettings: {
              dataType: 'json',
              headers: {
                ...headers,
                'Authorization':
                  `Bearer ${_self.get('session.data.authenticated.access_token')}`
              }
            }
          };
          options.url = Configuration.uploaderUrl;
          let uploader = EmberUploader.Uploader.create(options);
          uploader.upload(files[0]);
          console.log(uploader)
          //$summernote.summernote('insertNode', imgNode)
        }
      }
    });
    this.$('.dropdown-toggle').dropdown();

    this.$().on('clear', () => this.$('#summernote').summernote('code', ''));

    this._super();
  }
});
