import Ember from 'ember';

const { Mixin, inject, run } = Ember;

export default Mixin.create({
  activityNotifier: inject.service(),

  init() {
    this._super();

    run.later(this, () => this.get('activityNotifier').start(), 2000);
  }
});
