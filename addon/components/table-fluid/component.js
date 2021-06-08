import { on } from '@ember/object/evented';
import { set, observer, computed } from '@ember/object';
import { run, schedule } from '@ember/runloop';
import { inject as service } from '@ember/service';

import SlotsMixin from 'ember-block-slots';
import EmberCollection from 'ember-collection/components/ember-collection';
import { EKMixin, getCode, keyDown } from 'ember-keyboard';

import layout from './template';

export default EmberCollection.extend(SlotsMixin, EKMixin, {
  layout,

  toast: service(),
  intl: service(),

  classNames: ['__table-fluid'],
  triggerOffset: 600,
  onBottomReach: null,
  _bottomReached: false,
  loading: false,

  isReached: computed('items.{currentPage,reachedInfinity,meta.totalPages}', '_bottomReached', function () {
    // Check infinity
    if (this.get('items.reachedInfinity') === null) {
      return this._bottomReached;
    }

    if (this.get('items.currentPage') >= this.get('items.meta.totalPages')) {
      return true;
    }

    return this.get('items.reachedInfinity');
  }),

  _: observer('_contentSize.height', function () {
    this.set('_bottomReached', false);
  }),

  _1: observer('shouldResetActiveCells', function () {
    if (this.keyboardActivated && this.items) {
      run.later(() => {
        this._resetCurrentlyActiveCell();
      }, 200);
    }
  }),

  _2: observer('errors', function () {
    if ((this.errors || []).length > 0) {
      if (this.errors[0].message === 'limit_exceeded') {
        this.toast.info(
          `${this.intl.t('errors.402.limit_exceeded.congratulation')} ${this.intl.t(
            'errors.402.limit_exceeded.description',
            {
              limit: this.errors[0].limit_total,
              used: this.errors[0].limit_spent
            }
          )}`
        );
      }
    }
  }),

  _bottomIsReached(scrollTop) {
    let pos = this._contentSize.height - this._clientHeight - scrollTop;
    return pos <= this.triggerOffset;
  },

  _resetCurrentlyActiveCell() {
    this._cells.map((cell) => set(cell, 'isActive', false));
    let firstCell = this._cells.find((cell) => cell.index === 0);

    if (firstCell) {
      set(firstCell, 'isActive', true);
    }
  },

  currentlyActiveCell: computed('_cells', '_cells.@each.isActive', function () {
    return this._cells.find((cell) => cell.isActive);
  }),

  _getNextCell(ctx, fromCell) {
    return ctx.get('_cells').reduce(function (acc, v) {
      if (!acc && v.index > fromCell.index) {
        acc = v;
      } else if (v.index > fromCell.index && v.index < acc.index) {
        acc = v;
      }

      return acc;
    }, null);
  },

  _getPreviousCell(ctx, fromCell) {
    return ctx.get('_cells').reduce(function (acc, v) {
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
    keyDown('ArrowUp'),
    keyDown('ArrowDown'),
    keyDown('ArrowLeft'),
    keyDown('ArrowRight'),
    function (e) {
      let key = getCode(e);
      let cell = this.currentlyActiveCell;
      let goToCell, totalCells, directionFn, nextCell;

      switch (key) {
        case 'ArrowDown':
        case 'ArrowUp':
          goToCell = key === 'ArrowDown' ? this._getNextCell(this, cell) : this._getPreviousCell(this, cell);

          if (goToCell) {
            this._switchCellsActiveState(cell, goToCell);
          }

          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          totalCells = this.get('_cells.length');
          directionFn = cell.index + 1 < totalCells ? this._getNextCell : this._getPreviousCell;
          nextCell = directionFn(this, cell);
          this.keyboardArrowAction(cell.item, key, () => {
            set(cell, 'isActive', false);

            this._cells.removeObject(cell);

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
    this._super(...arguments);
    if (this.keyboardActivated) {
      this._resetCurrentlyActiveCell();
    }

    schedule('afterRender', () => {
      if (!this.isReached) {
        this.onBottomReach();
      }
    });
  },

  _needsRevalidate() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    this._super();
  },

  actions: {
    scrollChange(scrollLeft, scrollTop) {
      let numItems = this.get('_items.length') || 0;

      // avoid scroll if no items
      if (this.loading || numItems === 0) {
        return;
      }

      if (this.didScroll) {
        this.didScroll(scrollLeft, scrollTop);
      }

      if (scrollLeft !== this._scrollLeft || scrollTop !== this._scrollTop) {
        this.set('_scrollLeft', scrollLeft);
        this.set('_scrollTop', scrollTop);
        this._needsRevalidate();

        if (!this.isReached && this._bottomIsReached(scrollTop)) {
          this.set('_bottomReached', true);
          this.onBottomReach();
        }
      }
    }
  }
});
