import Ember from 'ember';
import layout from './template';
import EmberCollection from 'ember-collection/components/ember-collection';
import SlotsMixin from 'ember-block-slots';
import { EKMixin, getCode, keyDown, keyUp } from 'ember-keyboard';

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

  keyboardMapping: on(
    keyDown('ArrowUp'), keyDown('ArrowDown'),
    keyDown('ArrowLeft'), keyDown('ArrowRight'),
    function(e) {
      const key = getCode(e);
      let cell = this.get('currentlyActiveCell');
      switch (key) {
        case 'ArrowDown':
        case 'ArrowUp':
          let direction = (key === 'ArrowDown') ? 1 : -1;
          let goToCell = this.get('_cells').find((x) => {
            return x.index === cell.index + direction
          });

          if (goToCell) {
            set(cell, 'isActive', false);
            set(goToCell, 'isActive', true);
          }

          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          this.sendAction('keyboardArrowAction', cell.item, key);

          set(cell, 'isActive', false);
          let afterDeletionCell = this.get('_cells').find((x) => {
            return x.index === cell.index + 1 || x.index === cell.index - 1;
          });

          if (afterDeletionCell) {
            set(afterDeletionCell, 'isActive', true);
          };
          this.get('_cells').removeObject(cell);

          break;
        default:
          break;
      }
    }
  ),

  init() {
    this._super();
    this.set('keyboardActivated', true);
  },

  didRender() {
    set(this.get('_cells')[0], 'isActive', true);
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
