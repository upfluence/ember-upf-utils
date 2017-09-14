/* global document */
import Ember from 'ember';
import layout from './template';

const { Component, computed, $ } = Ember;

export default Component.extend({
  layout,
  classNames: ['__drag-and-drop'],
  classNameBindings: [
    'dragElementClass',
    'dragElementInZoneClass'
  ],

  _onDragElement: false,
  _onDragElementInZone: false,
  _nodeCollection: $(),

  dragElementClass: computed('_onDragElement', 'onDragClass', function() {
    if(this.get('_onDragElement') && this.get('onDragClass')) {
      return this.get('onDragClass');
    }
  }),

  dragElementInZoneClass: computed(
    '_onDragElementInZone',
    'onDragInZoneClass',
    function() {
      if(this.get('_onDragElementInZone') && this.get('onDragInZoneClass')) {
        return this.get('onDragInZoneClass');
      }
  }),

  init() {
    this._super();

    this._nodeCollection = $();
    $(document)
      .on('dragover', false)
      .on('dragenter', this._documentDragEnter.bind(this))
      .on('dragleave', this._documentDragLeave.bind(this))
      .on('drop', this._documentDrop.bind(this))
    ;
  },

  dragEnter() {
    if (this.get('_onDragElementInZone')) {
      return;
    }

    this.set('_onDragElementInZone', true);
    this.sendAction('onEnterDropZone');
  },

  dragLeave() {
    if (!this.get('_onDragElementInZone')) {
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
    var files = event.dataTransfer.files;
    this.sendAction('onDropFiles', files);
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
    $(document)
      .off('dragover', false)
      .off('dragenter', this._documentDragEnter.bind(this))
      .off('dragleave', this._documentDragLeave.bind(this))
      .off('drop', this._documentDrop.bind(this))
    ;
  }
});
