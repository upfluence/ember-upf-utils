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
  toast: inject.service(),
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

  uploadAllowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
  uploaderHeaders: {
    'Scope': Configuration.scope[0]
  },
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
  uploader: computed('uploaderOptions', function() {
    let uploader = EmberUploader.Uploader.create(this.get('uploaderOptions'));
    uploader
      .on('didUpload', (e) => {
        this.$('#summernote').summernote('insertImage', e.artifact.url);
      });
    return uploader;
  }),

  match: /\B{{(\w*)$/,

  availableVariables: computed('customVariables', function() {
    return (this.get('customVariables') || []).uniq();
  }),

  uploadFile(file) {
    let fileExtension = file.name.split('.').slice(-1).pop()
    if (this.get('uploadAllowedExtensions').includes(fileExtension)) {
      this.get('uploader').upload(file, { privacy: 'public' });
    } else {
      let extsWording = this.get('uploadAllowedExtensions').join(', ');
      this.get('toast').info(
        `Allowed image formats are: ${extsWording}`,
        `Issue uploading ${file.name}`,
      );
    }
  },

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
      onCreateLink(link) {
        if (link.indexOf('{{') === 0) {
          return link;
        }

        // BC
        return /^[A-Za-z][A-Za-z0-9+-.]*\:[\/\/]?/.test(link)
          ? link : 'http://' + link;
      },
      callbacks: {
        ..._callbacks,
        onImageUpload(files) {
          Array.prototype.forEach.call(files, (file) => _self.uploadFile(file))
        }
      }
    });

    this.$('.dropdown-toggle').dropdown();

    this.$().on('clear', () => this.$('#summernote').summernote('code', ''));
    this._super();
  }
});
