import Ember from 'ember';
import layout from './template';
import EmberCollection from 'ember-collection/components/ember-collection';
import SlotsMixin from 'ember-block-slots';
import { EKMixin } from 'ember-keyboard';
import { keyUp, keyDown } from 'ember-keyboard';

const {
  computed,
  observer,
  on,
  set
} = Ember;

export default EmberCollection.extend(SlotsMixin, EKMixin, {
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
    }
  ),

  _: observer('_contentSize.height', function() {
    this.set('_bottomReached', false);
  }),

  _bottomIsReached(scrollTop) {
    let pos = this._contentSize.height - this._clientHeight - scrollTop;
    return pos <= this.get('triggerOffset');
  },

  currentlyActiveCell: computed('_cells.@each.isActive', function() {
    return this.get('_cells').find((cell) => cell.isActive);
  }),

  keyUpListener: on(keyDown('ArrowUp'), function() {
    let activeCellIndex = this.get('_cells').indexOf(this.get('currentlyActiveCell'));
    let previousCell = this.get('_cells')[activeCellIndex - 1];

    if (activeCellIndex > 0) {
      set(this.get('currentlyActiveCell'), 'isActive', false);
      set(previousCell, 'isActive', true);
    }
  }),

  keyDownListener: on(keyDown('ArrowDown'), function() {
    let activeCellIndex = this.get('_cells').indexOf(this.get('currentlyActiveCell'));
    let nextCell = this.get('_cells')[activeCellIndex + 1];

    if (activeCellIndex < this.get('_cells').length) {
      set(this.get('currentlyActiveCell'), 'isActive', false);
      set(nextCell, 'isActive', true);
    }
  }),

  didInsertElement() {
    set(this.get('_cells')[0], 'isActive', true);
    this.set('keyboardActivated', true);
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
