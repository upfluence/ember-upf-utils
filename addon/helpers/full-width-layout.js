import ShelfFirst from 'layout-bin-packer/shelf-first';
import { formatPercentageStyle } from 'ember-collection/utils/style-generators';
import Ember from 'ember';

export class FullWidthLayout
{
  constructor(itemCount, height) {
    let positions = [];
    for (var i = 0; i < itemCount; i++) {
      positions.push({
        width: 100,
        height: height,
        percent: 100
      });
    }
    this.positions = positions;
    this.bin = new ShelfFirst(positions, 100);
  }

  contentSize(clientWidth/*, clientHeight*/) {
    return {
      width: clientWidth,
      height: this.bin.height(100)
    };
  }

  indexAt(offsetX, offsetY, width, height) {
    return this.bin.visibleStartingIndex(offsetY, 100, height);
  }

  positionAt(index, width, height) {
    return this.bin.position(index, 100, height);
  }

  widthAt(index) {
    return this.bin.widthAtIndex(index);
  }

  heightAt(index) {
    return this.bin.heightAtIndex(index);
  }

  count(offsetX, offsetY, width, height) {
    return this.bin.numberVisibleWithin(offsetY, 100, height, true);
  }

  formatItemStyle(itemIndex, clientWidth, clientHeight) {
    let pos = this.positionAt(itemIndex, 100, clientHeight);
    let width = this.positions[itemIndex].percent;
    let height = this.heightAt(itemIndex, 100, clientHeight);
    let x = Math.floor((pos.x / 100) * clientWidth);
    return formatPercentageStyle({x:x, y:pos.y}, width, height);
  }
}

export default Ember.Helper.helper(function (params/*, hash*/) {
  return new FullWidthLayout(params[0], params[1]);
});
