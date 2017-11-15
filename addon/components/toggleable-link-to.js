import Ember from 'ember';

const {
  LinkComponent,
  observer
} = Ember;

export default LinkComponent.extend({
  backRoute: null,
  _initialTargetRouteName: null,

  _: observer('willBeActive', function() {
    if (this.get('targetRouteName') !== this.get('backRoute')) {
      this.set('targetRouteName', this.get('backRoute'));
    } else {
      this.set('targetRouteName', this.get('_initialTargetRouteName'));
    }
  }),

  didInsertElement() {
    this.set('_initialTargetRouteName', this.get('targetRouteName'));
  }
});
