import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { nameInitials } from '@upfluence/ember-upf-utils/helpers/name-initials';

export default Component.extend({
  tagName: 'span',

  imageSrc: computed('column.property', 'item', function () {
    return get(this.item, this.get('column.property'));
  }),

  imageAltText: computed('column.textProperty', 'item', function () {
    return nameInitials([get(this.item, this.get('column.textProperty'))]);
  }),

  text: computed('column.textProperty', 'item', function () {
    return get(this.item, this.get('column.textProperty'));
  }),

  _imageSize: computed('column.imageSize', function () {
    return `${this.get('column.imageSize')}px`;
  }),

  _imageSizeClass: computed('column.imageSize', function () {
    return `upf-image upf-image--round-${this.get('column.imageSize')}`;
  })
});
