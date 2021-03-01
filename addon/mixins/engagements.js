import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  engagements: computed('availableEngagements', 'facebookShares', 'likes', 'shares', function() {
    return this.availableEngagements.map((n) => this.get(n));
  })
});
