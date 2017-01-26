import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['__title'],

  title: '',

  canEdit: true,
  isEditing: false,

  exitEditIcon: 'check',
  editIcon: 'pencil-square-o',

  exitEditModeAction: null,
  enterEditModeAction: null,

  editAllowed: Ember.computed.bool('canEdit'),

  actions: {
    enterEditMode() {
      this.sendAction('enterEditModeAction');
      this.set('isEditing', true);
    },

    exitEditMode() {
      this.sendAction('exitEditModeAction');
      this.set('isEditing', false);
    }
  }
});
