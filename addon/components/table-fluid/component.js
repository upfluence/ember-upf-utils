import Ember from 'ember';
import layout from './template';
import EmberCollection from 'ember-collection/components/ember-collection';
import SlotsMixin from 'ember-block-slots';
import { EKMixin } from 'ember-keyboard';
import { getCode, keyUp, keyDown } from 'ember-keyboard';

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
    let cell = this.get('_cells').find((cell) => cell.isActive);
    return {
      cell,
      index: this.get('_cells').indexOf(cell)
    };
  }),

  keyboardMapping: on(
    keyDown('ArrowUp'), keyDown('ArrowDown'),
    keyDown('ArrowLeft'), keyDown('ArrowRight'),
    function(e) {
      const key = getCode(e);
      let { cell, index } = this.get('currentlyActiveCell');
      let totalCells = this.get('_cells').length;
      switch (key) {
        case 'ArrowUp':
        case 'ArrowDown':
          let canNavigate = (key === 'ArrowUp') ? index > 0 : index+1 < totalCells;

          if (canNavigate) {
            const direction = (key === 'ArrowUp') ? -1 : 1;
            let goToCell = this.get('_cells')[index + direction];
            set(cell, 'isActive', false);
            set(goToCell, 'isActive', true);
          }

          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          set(cell, 'isActive', false);
          set(this.get('_cells')[index + 1], 'isActive', true);
          this.get('_cells').splice(index, 1);
          this.sendAction('keyboardArrowAction', cell.item, key);

          break;
        default:
          break;
      }
    }
  ),

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
