import Ember from 'ember';
import layout from './template';
import EmberCollection from 'ember-collection/components/ember-collection';
import SlotsMixin from 'ember-block-slots';

const {
  computed,
  observer
} = Ember;

export default EmberCollection.extend(SlotsMixin, {
  layout,
  classNames: ['__table-fluid'],
  triggerOffset: 600,
  onBottomReach: null,
  _bottomReached: false,
  loading: false,

  isReached: computed(
    'items.reachedInfinity',
    '_bottomReached', function() {
      // Check infinity
      if (this.get('items.reachedInfinity') === null) {
        return this.get('_bottomReached');
      }

      return this.get('items.reachedInfinity');
  }),

  _: observer('_contentSize.height', function() {
    this.set('_bottomReached', false);
  }),

  _bottomIsReached(scrollTop) {
    let pos = this._contentSize.height - this._clientHeight - scrollTop;
    return pos <= this.get('triggerOffset');
  },

  actions: {
    scrollChange(scrollLeft, scrollTop) {
      if (this.get('loading')) {
        return;
      }

      if (scrollLeft !== this._scrollLeft ||
        scrollTop !== this._scrollTop) {
        this.set('_scrollLeft', scrollLeft);
        this.set('_scrollTop', scrollTop);
        this._needsRevalidate();

        if (!this.get('isReached') && this._bottomIsReached(scrollTop)) {
          this.set('_bottomReached', true);
          this.sendAction('onBottomReach');
        }
      }
    }
  }
});
