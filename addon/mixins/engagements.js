import Ember from 'ember';

export default Ember.Mixin.create({
  engagements: Ember.computed('likes', 'shares', 'facebookShares', function() {
    return this.get('availableEngagements').map((n) => this.get(n));
  })
});
