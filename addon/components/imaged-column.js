import Ember from 'ember';

const {
  Component,
  computed,
  get
} = Ember;

export default Component.extend({
  tagName: 'span',

  imageSrc: computed('item', 'column', function() {
    return get(this.get('item'), this.get('column.property'));
  }),

  imageAltText: computed('item', 'column', function() {
    let text = get(this.get('item'), this.get('column.textProperty')).trim().toLowerCase();
    return text.replace(/\s[^a-z]/gi, '').split(' ').reduce((acc, word) => {
      let trademarkSign = acc.length > 0 && acc[acc.length-1].startsWith('t')
                                         && word.startsWith('m');
      if (!trademarkSign) {
        acc.push(word[0]);
      }

      return acc;
    }, []).slice(0, 3).join('');
  }),

  text: computed('item', 'column', function() {
    return get(this.get('item'), this.get('column.textProperty'));
  }),

  _imageSize: computed('column.imageSize', function() {
    return `${this.get('column.imageSize')}px`;
  }),

  _imageSizeClass: computed('column.imageSize', function() {
    return `upf-image upf-image--round-${this.get('column.imageSize')}`;
  })
});
