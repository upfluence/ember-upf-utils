import Component from '@ember/component';

import { computed } from '@ember/object';
import $ from 'jquery';
import layout from './template';

export default Component.extend({
  layout,
  classNames: ['__drag-and-drop'],
  classNameBindings: ['dragElementClass', 'dragElementInZoneClass'],

  _onDragElement: false,
  _onDragElementInZone: false,
  _nodeCollection: $(),

  dragElementClass: computed('_onDragElement', 'onDragClass', function () {
    if (this._onDragElement && this.onDragClass) {
      return this.onDragClass;
    }

    return;
  }),

  dragElementInZoneClass: computed('_onDragElementInZone', 'onDragInZoneClass', function () {
    if (this._onDragElementInZone && this.onDragInZoneClass) {
      return this.onDragInZoneClass;
    }

    return;
  }),

  didInsertElement() {
    this._super();
    this._nodeCollection = this.$();
    this.$()
      .on('dragover', false)
      .on('dragenter', this._documentDragEnter.bind(this))
      .on('dragleave', this._documentDragLeave.bind(this))
      .on('drop', this._documentDrop.bind(this));
  },

  dragEnter() {
    if (this._onDragElementInZone) {
      return;
    }

    this.set('_onDragElementInZone', true);
    this.sendAction('onEnterDropZone');
  },

  dragLeave() {
    if (!this._onDragElementInZone) {
      return;
    }

    this.set('_onDragElementInZone', false);
    this.sendAction('onLeaveDropZone');
  },

  dragOver(event) {
    event.preventDefault();
  },

  drop(event) {
    event.preventDefault();
    this.set('_onDragElementInZone', false);
    this.sendAction('onDropFiles', event.dataTransfer.files);
  },

  _documentDragEnter(event) {
    if (!this._nodeCollection.length) {
      this.set('_onDragElement', true);
      this.sendAction('onEnter');
    }

    this._nodeCollection = this._nodeCollection.add(event.target);
  },

  _documentDragLeave(event) {
    this._nodeCollection = this._nodeCollection.not(event.target);
    if (!this._nodeCollection.length) {
      this.set('_onDragElement', false);
      this.sendAction('onLeave');
    }
  },

  _documentDrop() {
    this._nodeCollection = $();
    this.set('_onDragElement', false);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$()
      .off('dragover', false)
      .off('dragenter', this._documentDragEnter.bind(this))
      .off('dragleave', this._documentDragLeave.bind(this))
      .off('drop', this._documentDrop.bind(this));
  }
});
