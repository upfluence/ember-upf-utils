import Ember from 'ember';
import layout from './template';
import EmberCollection from 'ember-collection/components/ember-collection';
import SlotsMixin from 'ember-block-slots';
import { EKMixin, getCode, keyDown, keyUp } from 'ember-keyboard';

const {
  computed,
  observer,
  on,
  run,
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

  _getNextCell(fromCell) {
    return this.get('_cells').reduce(function(acc, v) {
      if (!acc && v.index > fromCell.index) {
        acc = v;
      } else if (v.index > fromCell.index && v.index < acc.index) {
        acc = v;
      }

      return acc;
    }, null);
  },

  _getPreviousCell(fromCell) {
    return this.get('_cells').reduce(function(acc, v) {
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
          let goToCell = (key === 'ArrowDown') ? this._getNextCell(cell) :
            this._getPreviousCell(cell);

          if (goToCell) {
            this._switchCellsActiveState(cell, goToCell);
          }

          break;
        case 'ArrowLeft':
        case 'ArrowRight':


          this.sendAction('keyboardArrowAction', cell.item, key, () => {
            set(cell, 'isActive', false);
            this.get('_cells').removeObject(cell);

            let totalCells = this.get('_cells.length');
            let direction = (cell.index + 1 < totalCells) ? 1 : -1;
            let goToCell = this.get('_cells').find((x) => {
              return x.index === cell.index + direction;
            });

            if (goToCell) {
              set(goToCell, 'isActive', true);
            };
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
