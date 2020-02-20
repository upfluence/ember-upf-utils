import { on } from '@ember/object/evented';
import { set, observer, computed } from '@ember/object';
import { run, schedule } from '@ember/runloop';

import SlotsMixin from 'ember-block-slots';
import EmberCollection from 'ember-collection/components/ember-collection';
import { EKMixin, getCode, keyDown } from 'ember-keyboard';

import layout from './template';

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

  _1: observer('shouldResetActiveCells', function() {
    if (this.get('keyboardActivated') && this.get('items')) {
      run.later(() => {
        this._resetCurrentlyActiveCell();
      }, 200);
    }
  }),

  _bottomIsReached(scrollTop) {
    let pos = this._contentSize.height - this._clientHeight - scrollTop;
    return pos <= this.get('triggerOffset');
  },

  _resetCurrentlyActiveCell() {
    this.get('_cells').map((cell) => set(cell, 'isActive', false));
    let firstCell = this.get('_cells').find((cell) => cell.index === 0);

    if(firstCell) {
      set(firstCell, 'isActive', true);
    }
  },

  currentlyActiveCell: computed('_cells', '_cells.@each.isActive', function() {
    return this.get('_cells').find((cell) => cell.isActive);
  }),

  _getNextCell(ctx, fromCell) {
    return ctx.get('_cells').reduce(function(acc, v) {
      if (!acc && v.index > fromCell.index) {
        acc = v;
      } else if (v.index > fromCell.index && v.index < acc.index) {
        acc = v;
      }

      return acc;
    }, null);
  },

  _getPreviousCell(ctx, fromCell) {
    return ctx.get('_cells').reduce(function(acc, v) {
      if (!acc && v.index < fromCell.index) {
        acc = v;
      } else if (v.index < fromCell.index && v.index > acc.index) {
        acc = v;
      }

      return acc;
    }, null);
  },

  _switchCellsActiveState(fromCell, toCell) {
    set(fromCell, 'isActive', false);
    set(toCell, 'isActive', true);
  },

  keyboardMapping: on(
    keyDown('ArrowUp'), keyDown('ArrowDown'),
    keyDown('ArrowLeft'), keyDown('ArrowRight'),
    function(e) {
      let key = getCode(e);
      let cell = this.get('currentlyActiveCell');
      switch (key) {
        case 'ArrowDown':
        case 'ArrowUp':
          let goToCell = (key === 'ArrowDown') ? this._getNextCell(this, cell)
            : this._getPreviousCell(this, cell);

          if (goToCell) {
            this._switchCellsActiveState(cell, goToCell);
          }

          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          let totalCells = this.get('_cells.length');
          let directionFn = (cell.index + 1 < totalCells) ? this._getNextCell
            : this._getPreviousCell;
          let nextCell = directionFn(this, cell);
          this.keyboardArrowAction(cell.item, key, () => {
            set(cell, 'isActive', false);

            this.get('_cells').removeObject(cell);

            if (nextCell) {
              set(nextCell, 'isActive', true);
            }
          });

          break;
        default:
          break;
      }
    }
  ),

  didInsertElement() {
    if (this.get('keyboardActivated')) {
      this._resetCurrentlyActiveCell();
    }

    schedule('afterRender', () => {
      if (!this.isReached) {
        this.onBottomReach();
      }
    })
  },

  _needsRevalidate() {
    if (this.isDestroyed || this.isDestroying) { return; }
    this._super();
  },

  actions: {
    scrollChange(scrollLeft, scrollTop) {
      let numItems = this.get('_items.length') || 0;

      // avoid scroll if no items
      if (this.get('loading') || numItems === 0) {
        return;
      }

      if (scrollLeft !== this._scrollLeft || scrollTop !== this._scrollTop) {
        this.set('_scrollLeft', scrollLeft);
        this.set('_scrollTop', scrollTop);
        this._needsRevalidate();

        if (!this.get('isReached') && this._bottomIsReached(scrollTop)) {
          this.set('_bottomReached', true);
          this.onBottomReach();
        }
      }
    }
  }
});
