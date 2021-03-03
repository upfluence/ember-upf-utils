import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import SummerNoteComponent from 'ember-cli-summernote/components/summer-note';
import $ from 'jquery';
import Uploader from '@upfluence/ember-upf-utils/uploader';
import Configuration from '@upfluence/ember-upf-utils/configuration';

export default SummerNoteComponent.extend({
  toast: service(),
  session: service(),

  classNames: ['js-summer-note', 'upf-summer-note'],
  toolbarOptions: {
    font: {
      bold: true,
      italic: true,
      underline: true,
      superscript: false,
      subscript: false
    },
    table: false,
    insert: {
      video: false
    },
    fontname: {
      fontname: false
    },
    view: {
      fullscreen: false
    }
  },

  uploadAllowedExtensions: 'jpg,jpeg,png,gif',
  uploadMaxSize: null,

  uploaderHeaders: {
    Scope: Configuration.scope[0]
  },

  uploaderOptions: computed(
    'session.data.authenticated.access_token',
    'uploadAllowedExtensions',
    'uploadMaxSize',
    'uploaderHeaders',
    function () {
      /* jshint ignore:start */
      return {
        ajaxSettings: {
          dataType: 'json',
          headers: {
            ...this.uploaderHeaders,
            Authorization: `Bearer ${this.get('session.data.authenticated.access_token')}`
          }
        },
        url: Configuration.uploaderUrl,
        allowedExtensions: this.uploadAllowedExtensions,
        maxSize: this.uploadMaxSize
      };
      /* jshint ignore:end */
    }
  ),

  uploader: computed('uploaderOptions', function () {
    let uploader = Uploader.create(this.uploaderOptions);
    uploader
      .on('didValidationError', (error) => {
        this.toast.error(error.message || 'Your file is invalid. Please check the requirements.');
      })
      .on('didUpload', (e) => {
        this.$('#summernote').summernote('insertImage', e.artifact.url);
      });

    return uploader;
  }),

  match: /\B{{(\w*)$/,

  availableVariables: computed('customVariables', function () {
    return (this.customVariables || []).uniq();
  }),

  uploadFile(file) {
    this.uploader.upload(file, { privacy: 'public' });
  },

  didInsertElement: function () {
    let _self = this;
    let _toolbar = this.getToolbarOptions(this.toolbarOptions);
    let _callbacks = this.callbacks;
    _callbacks.onChange = this.onChange.bind(this);

    let _customButtons = {};
    let arrayOfCustomButtons = this.customButtons;

    if (arrayOfCustomButtons) {
      let plugins = arrayOfCustomButtons.reduce((acc, v) => {
        acc[v.name] = v;

        return acc;
      }, {});

      Object.assign($.summernote.plugins, plugins);
      _toolbar.push(['insert', Object.keys(plugins)]);
    }

    this.$('#summernote').summernote({
      toolbar: _toolbar,
      buttons: _customButtons,
      height: this.height,
      dialogsInBody: true,

      hint: {
        match: this.match,
        search: (keyword, callback) => {
          callback(
            this.availableVariables.filter((item) => {
              if (this.hintDisabled) {
                return false;
              }
              return item.indexOf(keyword) === 0;
            })
          );
        },
        content: (item) => {
          return `{{${item}}}`;
        }
      },

      /* eslint-disable no-useless-escape */
      onCreateLink(link) {
        if (link.indexOf('{{') === 0) {
          return link;
        }

        // BC
        return /^[A-Za-z][A-Za-z0-9+-.]*\:[\/\/]?/.test(link) ? link : 'http://' + link;
      },
      /* eslint-enable no-useless-escape */

      callbacks: {
        ..._callbacks,
        onImageUpload(files) {
          Array.prototype.forEach.call(files, (file) => _self.uploadFile(file));
        }
      }
    });

    this.$('.dropdown-toggle').dropdown();

    this.$().on('clear', () => this.$('#summernote').summernote('code', ''));
    this.$('#summernote').summernote('code', this.content);
    this._super(...arguments);
  }
});
