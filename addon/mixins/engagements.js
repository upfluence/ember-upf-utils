import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  engagements: computed('likes', 'shares', 'facebookShares', function() {
    return this.get('availableEngagements').map((n) => this.get(n));
  })
});
